/**
 * Opens the inline booking panel from anywhere on the page.
 *
 * The "Book a call" CTAs live in unrelated parts of the tree — the fixed nav
 * sits in the layout, the others in page sections — so rather than threading
 * state (or a provider) through all of them, opening is a broadcast: any
 * button can ask, and the single <BookingReveal /> answers.
 *
 * The `#book` hash is kept in sync so `/#book` still works as a deep link
 * from elsewhere (the Academy's "Request access", the footer, shared URLs).
 */

export const BOOKING_ANCHOR = "book";
export const BOOKING_OPEN_EVENT = "gs:open-booking";

export function openBooking() {
  if (typeof window === "undefined") return;

  // Doesn't fire hashchange when it's already #book, which is exactly why
  // the event below is the real signal and the hash is just bookkeeping.
  if (window.location.hash !== `#${BOOKING_ANCHOR}`) {
    window.history.replaceState(null, "", `#${BOOKING_ANCHOR}`);
  }

  window.dispatchEvent(new Event(BOOKING_OPEN_EVENT));
}
