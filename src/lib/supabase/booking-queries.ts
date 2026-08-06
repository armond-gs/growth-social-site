import { createClient } from "@/lib/supabase/server";
import { generateSlots, type DayOption } from "@/lib/booking/slots";

/**
 * The bookable calendar: every offered slot in the window, with the ones
 * already taken flagged.
 *
 * Taken slots come from the `taken_slots` function rather than a table read
 * — `bookings` has no select policy, so contact details stay unreadable from
 * the client while availability is still public.
 */
export async function getAvailability(now: Date = new Date()): Promise<DayOption[]> {
  const days = generateSlots(now);
  if (days.length === 0) return days;

  const allSlots = days.flatMap((d) => d.slots);
  const rangeStart = allSlots[0].startsAt;
  // Exclusive upper bound, so nudge past the final slot's start.
  const rangeEnd = new Date(new Date(allSlots[allSlots.length - 1].startsAt).getTime() + 60_000).toISOString();

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("taken_slots", {
    range_start: rangeStart,
    range_end: rangeEnd,
  });

  if (error) throw error;

  const taken = new Set(
    (data ?? []).map((row: { starts_at: string }) => new Date(row.starts_at).toISOString()),
  );

  return days.map((day) => ({
    ...day,
    slots: day.slots.map((slot) => ({ ...slot, taken: taken.has(slot.startsAt) })),
  }));
}
