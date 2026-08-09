"use client";

import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Hero headline animation: each word rises out of a clipping mask.
 *
 * Words stagger by 60ms within a line; lines are offset by 110ms via
 * `lineDelay`. Built on CSS animation rather than JS so a dropped frame
 * can't leave a word stranded mid-rise — the browser always lands it on the
 * final position.
 *
 * `replayKey` is bumped by the mode switch so the animation replays when the
 * headline copy changes, instead of only running once on mount.
 */
export function WordRise({
  text,
  lineDelay = 0,
  replayKey,
  className = "",
  italic = false,
}: {
  text: string;
  lineDelay?: number;
  replayKey?: string | number;
  className?: string;
  italic?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span key={replayKey} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          // The mask. Bottom padding + negative margin give descenders room
          // to travel without being clipped at rest.
          className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]"
        >
          <span
            className={`inline-block will-change-transform ${italic ? "font-serif font-medium italic" : ""}`}
            style={{
              animation: `gs-word-rise 0.9s cubic-bezier(0.16,1,0.3,1) ${lineDelay + i * 60}ms both`,
            }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

/** Wraps mixed content (e.g. a line with an italic span) on one baseline. */
export function WordRiseLine({ children }: { children: ReactNode }) {
  return <span className="block">{children}</span>;
}
