"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidSlot, type DayOption } from "@/lib/booking/slots";
import { BUDGET_RANGES, SLOT_DURATION_MINUTES } from "@/lib/booking/config";
import { getAvailability } from "@/lib/supabase/booking-queries";
import { notifyBooking } from "@/lib/booking/notify";

/**
 * Availability for the booking UI, fetched at open time rather than baked in
 * as props. The landing page is statically generated, so anything passed down
 * from it would be frozen at build time and would go stale — and would also
 * miss slots taken since. Both the standalone page and the embed call this.
 */
export async function fetchAvailability(): Promise<DayOption[]> {
  return getAvailability();
}

export type BookingRequest = {
  startsAt: string;
  guestTimezone: string;
  name: string;
  email: string;
  brand?: string;
  budgetRange?: string;
  website?: string;
  details?: string;
};

export type BookingResult =
  | { ok: true; startsAt: string }
  | { ok: false; error: string; slotTaken?: boolean };

/** Caps on free-text so a form post can't write unbounded data. */
const LIMITS = { name: 120, email: 200, brand: 160, website: 300, details: 2000 };

function clean(value: string | undefined, max: number): string | null {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

/**
 * Books a call. Everything here treats the request as untrusted: this is a
 * public, unauthenticated endpoint, so the slot is re-derived server-side
 * rather than believed, and the DB has the final say on double-booking.
 */
export async function createBooking(request: BookingRequest): Promise<BookingResult> {
  const name = clean(request.name, LIMITS.name);
  const email = clean(request.email, LIMITS.email);

  if (!name) return { ok: false, error: "Please add your name." };
  if (!email || !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Please add a valid email address." };
  }

  // The client sends a time; that isn't evidence the time was ever offered.
  // Re-generate the real schedule and check membership, which also enforces
  // working days, business hours, and the minimum-notice rule in one go.
  if (!isValidSlot(request.startsAt)) {
    return { ok: false, error: "That time isn't available anymore. Please pick another." };
  }

  // Only accept a budget we actually offer, so the column stays a clean enum
  // to report on rather than arbitrary text.
  const budget = clean(request.budgetRange, 60);
  const budgetRange =
    budget && (BUDGET_RANGES as readonly string[]).includes(budget) ? budget : null;

  const supabase = await createClient();
  const { error } = await supabase.from("bookings").insert({
    starts_at: new Date(request.startsAt).toISOString(),
    duration_minutes: SLOT_DURATION_MINUTES,
    guest_timezone: clean(request.guestTimezone, 80) ?? "UTC",
    name,
    email,
    brand: clean(request.brand, LIMITS.brand),
    budget_range: budgetRange,
    website: clean(request.website, LIMITS.website),
    details: clean(request.details, LIMITS.details),
  });

  if (error) {
    // 23505 = unique violation on bookings_unique_active_slot: someone else
    // took this slot between it rendering and this submit.
    if (error.code === "23505") {
      return {
        ok: false,
        slotTaken: true,
        error: "Someone just booked that time. Please pick another slot.",
      };
    }
    return { ok: false, error: "Something went wrong booking that call. Please try again." };
  }

  // After the row is safely written, never before — and awaited so the
  // serverless invocation isn't torn down mid-send. notifyBooking swallows its
  // own failures, so a notification problem can't fail a real booking.
  await notifyBooking(request);

  return { ok: true, startsAt: request.startsAt };
}
