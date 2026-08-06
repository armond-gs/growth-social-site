/**
 * Pure, timezone-aware slot maths. No server-only imports — this module is
 * shared by the server action (which re-derives slots to validate what the
 * client sent) and by the client components (which render them).
 *
 * The whole file exists to keep one rule true: a slot is an absolute instant,
 * and wall-clock time is only ever a *view* of it. Business hours are wall
 * clock in the agency's zone; the visitor sees the same instant rendered in
 * theirs.
 */

import {
  AGENCY_TIMEZONE,
  BOOKING_WINDOW_DAYS,
  DAY_END_HOUR,
  DAY_START_HOUR,
  MINIMUM_NOTICE_HOURS,
  SLOT_DURATION_MINUTES,
  WORKING_DAYS,
} from "@/lib/booking/config";

export type Slot = {
  /** Absolute instant, ISO-8601 UTC. The identity of a slot. */
  startsAt: string;
  /** Already taken by someone else. */
  taken: boolean;
};

export type DayOption = {
  /** Calendar date in the agency's zone, as YYYY-MM-DD. */
  date: string;
  slots: Slot[];
};

/**
 * How far `timeZone` is from UTC at a given instant, in ms. Derived from
 * Intl rather than hardcoded, so DST is handled by the platform's tz data
 * instead of by us guessing.
 */
function offsetMs(timeZone: string, instant: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);

  const at: Record<string, number> = {};
  for (const p of parts) if (p.type !== "literal") at[p.type] = Number(p.value);

  // `hour` comes back as 24 at midnight in some implementations.
  const asIfUtc = Date.UTC(at.year, at.month - 1, at.day, at.hour % 24, at.minute, at.second);
  return asIfUtc - instant.getTime();
}

/**
 * The instant at which the clock in `timeZone` reads the given wall-clock
 * time. Applied twice because the offset itself depends on the instant:
 * the first pass can land on the wrong side of a DST transition, and the
 * second corrects it.
 */
export function wallClockToInstant(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string = AGENCY_TIMEZONE,
): Date {
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  const firstPass = offsetMs(timeZone, new Date(naive));
  const candidate = new Date(naive - firstPass);
  const secondPass = offsetMs(timeZone, candidate);
  return secondPass === firstPass ? candidate : new Date(naive - secondPass);
}

/** The YYYY-MM-DD date that `instant` falls on, as seen in `timeZone`. */
export function dateKeyIn(instant: Date, timeZone: string = AGENCY_TIMEZONE): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const at: Record<string, string> = {};
  for (const p of parts) if (p.type !== "literal") at[p.type] = p.value;
  return `${at.year}-${at.month}-${at.day}`;
}

/** Day of week (0=Sun) that `instant` falls on, as seen in `timeZone`. */
function weekdayIn(instant: Date, timeZone: string = AGENCY_TIMEZONE): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(instant);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

/**
 * Every slot the agency offers in the booking window, before accounting for
 * what's already booked. `now` is injectable so this stays testable and so
 * the server can evaluate it against its own clock.
 */
export function generateSlots(now: Date = new Date()): DayOption[] {
  const earliest = now.getTime() + MINIMUM_NOTICE_HOURS * 60 * 60 * 1000;
  const days: DayOption[] = [];

  for (let dayOffset = 0; dayOffset <= BOOKING_WINDOW_DAYS; dayOffset++) {
    // Step through days by advancing the instant, then asking what calendar
    // date that lands on in the agency's zone — rather than doing arithmetic
    // on date parts, which breaks across DST and month ends.
    const probe = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    if (!WORKING_DAYS.includes(weekdayIn(probe))) continue;

    const dateKey = dateKeyIn(probe);
    const [year, month, day] = dateKey.split("-").map(Number);

    const slots: Slot[] = [];
    for (let hour = DAY_START_HOUR; hour < DAY_END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_DURATION_MINUTES) {
        const startsAt = wallClockToInstant(year, month, day, hour, minute);
        if (startsAt.getTime() < earliest) continue;
        slots.push({ startsAt: startsAt.toISOString(), taken: false });
      }
    }

    if (slots.length > 0) days.push({ date: dateKey, slots });
  }

  return days;
}

/**
 * Whether `startsAt` is a slot the agency actually offers. The server action
 * calls this before writing — the client sends a time, and a time being in
 * the request is not evidence that it was ever on offer.
 */
export function isValidSlot(startsAt: string, now: Date = new Date()): boolean {
  const parsed = new Date(startsAt);
  if (Number.isNaN(parsed.getTime())) return false;
  const target = parsed.toISOString();
  return generateSlots(now).some((day) => day.slots.some((slot) => slot.startsAt === target));
}

/** e.g. "2:30 PM" in the viewer's own zone. */
export function formatSlotTime(startsAt: string, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(startsAt));
}

/** e.g. "Thursday, August 6" in the viewer's own zone. */
export function formatSlotDate(startsAt: string, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(startsAt));
}

/** Short label for a day column header, e.g. { weekday: "Thu", day: "6" }. */
export function formatDayLabel(dateKey: string, timeZone: string = AGENCY_TIMEZONE) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const instant = wallClockToInstant(year, month, day, 12, 0, timeZone);
  return {
    weekday: new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(instant),
    day: new Intl.DateTimeFormat("en-US", { timeZone, day: "numeric" }).format(instant),
    month: new Intl.DateTimeFormat("en-US", { timeZone, month: "short" }).format(instant),
  };
}

/** The visitor's own IANA zone, for display and for storing with a booking. */
export function guestTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}
