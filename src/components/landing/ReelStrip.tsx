"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ReelCard } from "@/components/ui/ReelCard";
import { ReelLightbox } from "@/components/ui/ReelLightbox";
import type { Clip } from "@/lib/data/landing";

// Matches the previous Framer Motion marquee's perceived speed (~46s to
// scroll one full set of cards).
const SPEED_PX_PER_SEC = 40;

export function ReelStrip({ clips }: { clips: Clip[] }) {
  const [openClip, setOpenClip] = useState<Clip | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || shouldReduceMotion) return;

    let rafId: number;
    let lastTime: number | null = null;
    let interacting = false;
    // The scrollLeft value we last set ourselves — used to tell our own
    // programmatic scrolling apart from real user scrolling by comparing
    // values rather than relying on scroll-event ordering (which the
    // browser can coalesce/reorder relative to when we set scrollLeft).
    let lastProgrammaticValue: number | null = null;
    let resumeTimeout: number | undefined;

    const onScroll = () => {
      if (lastProgrammaticValue !== null && Math.abs(el.scrollLeft - lastProgrammaticValue) < 0.5) {
        return;
      }
      // Real user-driven scroll (touch drag, trackpad, momentum) — pause
      // the auto-advance and resume a bit after activity settles, so it
      // doesn't fight the user's own scrolling or its momentum.
      interacting = true;
      window.clearTimeout(resumeTimeout);
      resumeTimeout = window.setTimeout(() => {
        interacting = false;
      }, 1200);
    };

    const step = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!interacting) {
        const half = el.scrollWidth / 2;
        let next = el.scrollLeft + SPEED_PX_PER_SEC * dt;
        if (next >= half) next -= half;
        el.scrollLeft = next;
        lastProgrammaticValue = el.scrollLeft;
      }
      rafId = requestAnimationFrame(step);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(resumeTimeout);
      el.removeEventListener("scroll", onScroll);
    };
  }, [shouldReduceMotion]);

  return (
    <>
      <div
        ref={scrollerRef}
        className="mt-6 flex touch-pan-x gap-3 overflow-x-auto px-2 [-ms-overflow-style:none] [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)] [scrollbar-width:none] md:mt-[clamp(48px,7vw,88px)] md:gap-4.5 [&::-webkit-scrollbar]:hidden"
      >
        {clips.map((clip) => (
          <ReelCard key={`a-${clip.id}`} clip={clip} onOpen={() => setOpenClip(clip)} />
        ))}
        {clips.map((clip) => (
          <ReelCard key={`b-${clip.id}`} clip={clip} onOpen={() => setOpenClip(clip)} />
        ))}
      </div>
      <ReelLightbox clip={openClip} onClose={() => setOpenClip(null)} />
    </>
  );
}
