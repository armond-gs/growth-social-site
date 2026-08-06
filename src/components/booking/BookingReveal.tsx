"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { BOOKING_ANCHOR, BOOKING_OPEN_EVENT, openBooking } from "@/lib/booking/open";

/**
 * The inline booking panel. Sits in the final CTA section and expands in
 * place — clicking "Book a call" anywhere on the site reveals the booking
 * interface here rather than sending anyone to another page.
 *
 * The flow inside is the same <BookingFlow /> the standalone /book page
 * renders. This component only owns the reveal: opening, animating, and
 * scrolling itself into view.
 */
export function BookingReveal() {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  // Set when opening, consumed once the panel has actually rendered — the
  // scroll has to wait for the expanded height to exist or it lands short.
  const pendingScroll = useRef(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
    pendingScroll.current = true;
  }, []);

  useEffect(() => {
    window.addEventListener(BOOKING_OPEN_EVENT, handleOpen);

    // Deep links: /#book should arrive with the panel already open.
    const openIfAnchored = () => {
      if (window.location.hash === `#${BOOKING_ANCHOR}`) handleOpen();
    };
    openIfAnchored();
    window.addEventListener("hashchange", openIfAnchored);

    return () => {
      window.removeEventListener(BOOKING_OPEN_EVENT, handleOpen);
      window.removeEventListener("hashchange", openIfAnchored);
    };
  }, [handleOpen]);

  useEffect(() => {
    if (!open || !pendingScroll.current) return;
    pendingScroll.current = false;

    // Next frame, so the panel has laid out before we scroll to it.
    const frame = requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "center",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, shouldReduceMotion]);

  return (
    <div ref={panelRef} className="scroll-mt-24">
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="booking-panel"
            initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {/* Inner wrapper carries the spacing so the height animation
                measures content, not collapsing margins. */}
            <div className="mx-auto max-w-[720px] pt-10 text-left md:pt-14">
              <BookingFlow onDone={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * "Book a call" CTA. Reveals the panel above instead of navigating, and
 * falls back to the real /book page when JS hasn't loaded — so the CTA is
 * never dead, and crawlers still find a genuine booking URL.
 */
export function BookCallButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href="/book"
      onClick={(e) => {
        // Let modified clicks (new tab, etc.) behave normally.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        openBooking();
      }}
      className={className}
    >
      {children}
    </a>
  );
}
