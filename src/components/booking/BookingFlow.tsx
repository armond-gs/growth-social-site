"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { BUDGET_RANGES, SLOT_DURATION_MINUTES } from "@/lib/booking/config";
import {
  formatDayLabel,
  formatSlotDate,
  formatSlotTime,
  guestTimeZone,
  type DayOption,
} from "@/lib/booking/slots";
import { createBooking, fetchAvailability } from "@/lib/supabase/booking-actions";
import { trackBooking } from "@/lib/booking/analytics";

type Step = "select" | "details" | "done";

const INPUT =
  "w-full rounded-xl border border-ink/18 bg-cream-card px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-green/50";
const LABEL = "mb-1.5 block text-[13px] font-semibold text-ink/70";

/**
 * The visitor's timezone, read the way a browser-only value should be: null
 * during SSR, resolved on the client. Reading it directly during render would
 * desync server and client markup; setting it from an effect would cascade
 * an extra render on every mount.
 */
const noopSubscribe = () => () => {};
function useViewerZone(): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => guestTimeZone(),
    () => null,
  );
}

/**
 * The booking system. This is the single implementation — the standalone
 * /book page and the inline reveal on the landing page both render this
 * exact component, so there is only ever one flow to maintain, style, or
 * instrument.
 *
 * It fetches its own availability rather than taking it as a prop, which
 * keeps it self-contained and keeps the statically-generated landing page
 * from serving build-time slots.
 */
export function BookingFlow({ onDone }: { onDone?: () => void }) {
  const [step, setStep] = useState<Step>("select");
  const [days, setDays] = useState<DayOption[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [chosenSlot, setChosenSlot] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [website, setWebsite] = useState("");
  const [details, setDetails] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // All times are shown in the visitor's own zone, not the agency's.
  const viewerZone = useViewerZone();

  // Bumping this re-runs the fetch below — the reload trigger is state, so
  // the effect stays a pure subscription rather than something callers poke.
  const [reloadKey, setReloadKey] = useState(0);
  const reloadAvailability = useCallback(() => {
    setLoadError(false);
    setDays(null);
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchAvailability().then(
      (result) => {
        if (cancelled) return;
        setDays(result);
        setActiveDate((current) => current ?? result[0]?.date ?? null);
      },
      () => {
        if (!cancelled) setLoadError(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    trackBooking("booking_opened");
  }, []);

  const activeDay = useMemo(
    () => days?.find((d) => d.date === activeDate) ?? null,
    [days, activeDate],
  );

  const handlePickSlot = (startsAt: string) => {
    setChosenSlot(startsAt);
    setStep("details");
    trackBooking("booking_slot_selected", { startsAt });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenSlot) return;

    setSubmitting(true);
    setFormError(null);

    const result = await createBooking({
      startsAt: chosenSlot,
      guestTimezone: viewerZone ?? "UTC",
      name,
      email,
      brand,
      budgetRange,
      website,
      details,
    });

    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      // The slot went while they were typing — send them back to pick again
      // against a freshly loaded calendar rather than retrying a dead slot.
      if (result.slotTaken) {
        setChosenSlot(null);
        setStep("select");
        reloadAvailability();
      }
      return;
    }

    setStep("done");
    trackBooking("booking_confirmed", { startsAt: chosenSlot });
  };

  // ---- Confirmation -------------------------------------------------------
  if (step === "done" && chosenSlot) {
    return (
      <div className="rounded-[20px] border border-ink/10 bg-cream-card p-7 text-center text-ink md:p-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success">
          <svg width="20" height="15" viewBox="0 0 20 15" aria-hidden="true">
            <path d="M2 7.5l5.5 5L18 2" fill="none" stroke="#f1f1e7" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-5 mb-2 text-[26px] font-bold tracking-[-0.02em]">You&rsquo;re booked.</h3>
        <p className="mx-auto max-w-[38ch] text-[15px] leading-[1.55] text-ink/66">
          {formatSlotDate(chosenSlot, viewerZone ?? undefined)} at{" "}
          <strong className="font-semibold text-ink">
            {formatSlotTime(chosenSlot, viewerZone ?? undefined)}
          </strong>
          . We&rsquo;ve got your details and will be in touch at{" "}
          <span className="font-mono text-[13.5px]">{email}</span>.
        </p>
        {viewerZone && (
          <p className="mt-3 font-mono text-[11px] tracking-[0.06em] text-ink/40">
            {SLOT_DURATION_MINUTES} min · {viewerZone.replace(/_/g, " ")}
          </p>
        )}
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="mt-7 rounded-full border border-ink/20 bg-transparent px-6 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  // ---- Details form -------------------------------------------------------
  if (step === "details" && chosenSlot) {
    return (
      <div className="rounded-[20px] border border-ink/10 bg-cream-card p-6 text-ink md:p-9">
        <button
          type="button"
          onClick={() => {
            setStep("select");
            setFormError(null);
          }}
          className="mb-5 inline-flex items-center gap-1.5 border-none bg-transparent p-0 font-mono text-[11px] tracking-[0.08em] text-ink/50 uppercase transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> Change time
        </button>

        <h3 className="m-0 text-[22px] font-bold tracking-[-0.02em] md:text-[26px]">
          {formatSlotDate(chosenSlot, viewerZone ?? undefined)}
        </h3>
        <p className="mt-1.5 mb-6 font-mono text-[12px] tracking-[0.06em] text-ink/50">
          {formatSlotTime(chosenSlot, viewerZone ?? undefined)} · {SLOT_DURATION_MINUTES} min
          {viewerZone ? ` · ${viewerZone.replace(/_/g, " ")}` : ""}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {formError && (
            <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{formError}</p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="bk-name" className={LABEL}>Name</label>
              <input id="bk-name" required value={name} onChange={(e) => setName(e.target.value)} className={INPUT} placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="bk-email" className={LABEL}>Email</label>
              <input id="bk-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} placeholder="you@brand.com" />
            </div>
            <div>
              <label htmlFor="bk-brand" className={LABEL}>Brand / company</label>
              <input id="bk-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={INPUT} placeholder="Brand name" />
            </div>
            <div>
              <label htmlFor="bk-website" className={LABEL}>Website or social</label>
              <input id="bk-website" value={website} onChange={(e) => setWebsite(e.target.value)} className={INPUT} placeholder="@handle or url" />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="bk-budget" className={LABEL}>Monthly budget</label>
            <select id="bk-budget" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className={INPUT}>
              <option value="">Select a range</option>
              {BUDGET_RANGES.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="bk-details" className={LABEL}>What are you looking for?</label>
            <textarea id="bk-details" rows={4} value={details} onChange={(e) => setDetails(e.target.value)} className={`${INPUT} resize-y`} placeholder="Tell us about the project — goals, timeline, anything useful." />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-green py-4 font-semibold text-cream transition-all duration-300 ease-out hover:bg-green-hover disabled:opacity-60"
          >
            {submitting ? "Booking…" : "Confirm booking"}
          </button>
        </form>
      </div>
    );
  }

  // ---- Date + time picker -------------------------------------------------
  return (
    <div className="rounded-[20px] border border-ink/10 bg-cream-card p-6 text-ink md:p-9">
      <h3 className="m-0 text-[22px] font-bold tracking-[-0.02em] md:text-[26px]">
        Book a call
      </h3>
      <p className="mt-1.5 mb-6 text-[14.5px] leading-[1.5] text-ink/60">
        {SLOT_DURATION_MINUTES} minutes, no pitch deck. Pick a time that works.
      </p>

      {loadError && (
        <div className="rounded-xl bg-red-50 px-4 py-3.5 text-sm text-red-700">
          Couldn&rsquo;t load available times.{" "}
          <button type="button" onClick={reloadAvailability} className="border-none bg-transparent p-0 font-semibold text-red-800 underline">
            Try again
          </button>
        </div>
      )}

      {!days && !loadError && (
        <div className="py-10 text-center font-mono text-[12px] tracking-[0.08em] text-ink/40 uppercase">
          Loading times…
        </div>
      )}

      {days && days.length === 0 && (
        <p className="py-8 text-center text-[15px] text-ink/60">
          No times available right now — email{" "}
          <a href="mailto:contact@growthsocialhq.com" className="font-semibold text-ink underline">
            contact@growthsocialhq.com
          </a>{" "}
          and we&rsquo;ll sort something out.
        </p>
      )}

      {days && days.length > 0 && (
        <>
          {/* Day strip — horizontal scroll so a month of days stays usable on mobile */}
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
            {days.map((day) => {
              const label = formatDayLabel(day.date);
              const isActive = day.date === activeDate;
              const soldOut = day.slots.every((s) => s.taken);
              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => setActiveDate(day.date)}
                  aria-pressed={isActive}
                  className={`flex min-w-[62px] flex-none flex-col items-center rounded-xl border px-3 py-2.5 transition-colors ${
                    isActive
                      ? "border-green bg-green text-cream"
                      : "border-ink/12 bg-cream text-ink hover:border-ink/30"
                  } ${soldOut && !isActive ? "opacity-40" : ""}`}
                >
                  <span className="font-mono text-[10px] tracking-[0.08em] uppercase opacity-70">
                    {label.weekday}
                  </span>
                  <span className="mt-0.5 text-[17px] font-bold">{label.day}</span>
                  <span className="font-mono text-[9.5px] tracking-[0.06em] uppercase opacity-60">
                    {label.month}
                  </span>
                </button>
              );
            })}
          </div>

          {viewerZone && (
            <p className="mt-4 font-mono text-[11px] tracking-[0.06em] text-ink/40">
              Times shown in {viewerZone.replace(/_/g, " ")}
            </p>
          )}

          {/* Times for the selected day */}
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {activeDay?.slots.map((slot) => (
              <button
                key={slot.startsAt}
                type="button"
                disabled={slot.taken}
                onClick={() => handlePickSlot(slot.startsAt)}
                className="rounded-xl border border-ink/14 bg-cream py-3 text-[15px] font-semibold text-ink transition-all duration-200 hover:border-green hover:bg-green hover:text-cream disabled:cursor-not-allowed disabled:border-ink/8 disabled:bg-transparent disabled:text-ink/25 disabled:line-through disabled:hover:bg-transparent disabled:hover:text-ink/25"
              >
                {formatSlotTime(slot.startsAt, viewerZone ?? undefined)}
              </button>
            ))}
          </div>

          {activeDay && activeDay.slots.every((s) => s.taken) && (
            <p className="mt-5 text-center text-[14.5px] text-ink/55">
              Fully booked that day — try another.
            </p>
          )}
        </>
      )}
    </div>
  );
}
