"use client";

import { useEffect } from "react";
import type { Clip } from "@/lib/data/landing";

export function ReelLightbox({ clip, onClose }: { clip: Clip | null; onClose: () => void }) {
  useEffect(() => {
    if (!clip) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [clip, onClose]);

  if (!clip) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 1l14 14M15 1L1 15" />
        </svg>
      </button>

      <div
        className="relative aspect-[9/16] h-full max-h-[85vh] w-auto overflow-hidden rounded-2xl bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          key={clip.id}
          src={clip.src}
          controls
          autoPlay
          playsInline
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
