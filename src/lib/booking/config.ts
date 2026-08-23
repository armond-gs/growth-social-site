/**
 * Everything tunable about the booking system lives here — change these and
 * the whole flow (slot generation, validation, UI copy) follows. Nothing
 * else should hardcode hours, durations, or day names.
 *
 * Note this is the *agency's* schedule: hours are wall-clock times in
 * AGENCY_TIMEZONE, not in whatever timezone the visitor happens to be in.
 * Slots get converted to the visitor's local time for display only.
 */

/** IANA zone the working hours below are expressed in. */
export const AGENCY_TIMEZONE = "America/New_York";

/** 0 = Sunday … 6 = Saturday. Currently Mon–Fri. */
export const WORKING_DAYS = [1, 2, 3, 4, 5];

/** Wall-clock start/end of the bookable window, in AGENCY_TIMEZONE. */
export const DAY_START_HOUR = 10;
export const DAY_END_HOUR = 17;

/** Length of a call. Slots are generated on this cadence. */
export const SLOT_DURATION_MINUTES = 30;

/**
 * How soon someone can book. Stops a prospect grabbing a slot that starts in
 * four minutes, which nobody would actually make.
 */
export const MINIMUM_NOTICE_HOURS = 12;

/** How far ahead the calendar lets people book. */
export const BOOKING_WINDOW_DAYS = 14;

export const BUDGET_RANGES = [
  "Under $2k / month",
  "$2k – $5k / month",
  "$5k – $10k / month",
  "$10k – $25k / month",
  "$25k+ / month",
  "Not sure yet",
] as const;
