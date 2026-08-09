"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MS_PER_CHAR = 26;

/**
 * Mono kicker that types itself in, character by character, the first time it
 * scrolls into view.
 *
 * The reveal is derived from elapsed time rather than incremented per frame,
 * so a janky frame skips ahead instead of stretching the animation — and the
 * final state is always the complete string. The real text is rendered
 * throughout and visually clipped, so screen readers and view-source get the
 * whole label regardless of animation state.
 */
export function MonoTick({
  text,
  className = "",
  replayKey,
}: {
  text: string;
  className?: string;
  replayKey?: string | number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [typed, setTyped] = useState(0);

  // Derived rather than stored: with reduced motion the full string is simply
  // what we render, so the effect never has to write state to "catch up".
  const shown = shouldReduceMotion ? text.length : typed;

  useEffect(() => {
    if (shouldReduceMotion) return;

    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let startedAt: number | null = null;

    const tick = (now: number) => {
      if (startedAt === null) startedAt = now;
      const elapsed = now - startedAt;
      const next = Math.min(text.length, Math.floor(elapsed / MS_PER_CHAR));
      setTyped(next);
      if (next < text.length) rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        rafId = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [text, shouldReduceMotion, replayKey]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{text.slice(0, shown)}</span>
      {/* Holds the full width so surrounding layout doesn't reflow as it
          types, and carries the accessible text. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="invisible">
        {text.slice(shown)}
      </span>
    </span>
  );
}
