"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMode } from "@/lib/landing/mode";

/**
 * The brand / creator switch that sits at the top of the hero.
 *
 * The sliding thumb is positioned by measuring the active button rather than
 * from hardcoded widths: "I'm a brand" and "I'm a creator" are different
 * lengths, and the gap between them changes with the font. Measurement is
 * written straight to the element's style rather than held in React state —
 * it's a layout read feeding a visual, so a render round-trip would only add
 * a frame of lag.
 */
export function AudienceToggle() {
  const { mode, isBrand, setMode } = useMode();
  const brandRef = useRef<HTMLButtonElement>(null);
  const creatorRef = useRef<HTMLButtonElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  const syncThumb = useCallback(() => {
    const active = (isBrand ? brandRef : creatorRef).current;
    const thumb = thumbRef.current;
    if (!active || !thumb) return;
    thumb.style.width = `${active.offsetWidth}px`;
    thumb.style.transform = `translateX(${active.offsetLeft}px)`;
  }, [isBrand]);

  useEffect(() => {
    syncThumb();

    // Web fonts land after first paint and change the label widths, so a
    // thumb measured before they load ends up short.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) syncThumb();
    });

    // Container queries would be neater, but the track is centred so its
    // children shift on any width change.
    const observer = new ResizeObserver(syncThumb);
    if (brandRef.current?.parentElement) observer.observe(brandRef.current.parentElement);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [syncThumb]);

  const base =
    "relative z-10 rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-500 md:px-5 md:text-[12px]";

  return (
    <div className="flex justify-center">
      <div
        role="tablist"
        aria-label="Choose your audience"
        className="relative inline-flex items-center gap-1 rounded-full border border-[var(--rule)] p-1 backdrop-blur-[6px]"
        style={{ background: "var(--chip-bg)" }}
      >
        <span
          ref={thumbRef}
          aria-hidden="true"
          className="absolute top-1 bottom-1 left-0 rounded-full transition-[transform,width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{ background: "var(--btn-bg)" }}
        />
        <button
          ref={brandRef}
          role="tab"
          aria-selected={isBrand}
          onClick={() => setMode("brand")}
          className={`${base} ${isBrand ? "text-[var(--btn-fg)]" : "text-[var(--fg-subtle)] hover:text-[var(--fg)]"}`}
        >
          I&rsquo;m a brand
        </button>
        <button
          ref={creatorRef}
          role="tab"
          aria-selected={!isBrand}
          onClick={() => setMode("creator")}
          className={`${base} ${!isBrand ? "text-[var(--btn-fg)]" : "text-[var(--fg-subtle)] hover:text-[var(--fg)]"}`}
        >
          I&rsquo;m a creator
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {mode === "brand" ? "Showing information for brands" : "Showing information for creators"}
      </span>
    </div>
  );
}
