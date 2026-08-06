/**
 * Booking funnel instrumentation.
 *
 * Because the embedded flow never navigates, there are no page views to hang
 * conversion tracking off — so each meaningful step is emitted here instead.
 * Two channels, both fired for every event, so whichever tag manager you end
 * up using can listen without this file changing:
 *
 *   1. `window.dataLayer.push(...)`  — GTM / GA4
 *   2. a `gs:booking` CustomEvent    — anything else (Meta Pixel, custom)
 *
 * Wiring a Meta Pixel `Schedule` conversion, for example:
 *
 *   window.addEventListener("gs:booking", (e) => {
 *     if (e.detail.event === "booking_confirmed") fbq("track", "Schedule");
 *   });
 *
 * Events, in funnel order:
 *   booking_opened        — flow rendered (standalone page or inline reveal)
 *   booking_slot_selected — a time was picked; { startsAt }
 *   booking_confirmed     — booking written successfully; { startsAt }
 */

export type BookingEvent = "booking_opened" | "booking_slot_selected" | "booking_confirmed";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackBooking(event: BookingEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const detail = { event, ...payload };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(detail);
  window.dispatchEvent(new CustomEvent("gs:booking", { detail }));
}
