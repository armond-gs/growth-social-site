"use client";

import { useEffect, useRef, useState } from "react";
import type { Clip } from "@/lib/data/landing";

function EyeIcon() {
  return (
    <svg width="11" height="8" viewBox="0 0 14 10" fill="none" className="shrink-0">
      <path
        d="M1 5C2.5 2 4.5 0.5 7 0.5S11.5 2 13 5c-1.5 3-3.5 4.5-6 4.5S2.5 8 1 5Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="7" cy="5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function ReelCard({ clip, onOpen }: { clip: Clip; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { label, src, views } = clip;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // preload="metadata" only guarantees duration/dimensions, not a decoded
    // frame — force a tiny seek so the browser actually renders one instead
    // of leaving the video blank/black.
    const seekToFirstFrame = () => {
      if (video.currentTime === 0) video.currentTime = 0.1;
    };
    const markLoaded = () => setLoaded(true);

    video.addEventListener("loadedmetadata", seekToFirstFrame);
    video.addEventListener("seeked", markLoaded);
    video.addEventListener("loadeddata", markLoaded);

    // A native <video> starts loading as soon as it's parsed — often before
    // React finishes hydrating and attaching the listeners above, so its
    // metadata/data events can fire and be missed entirely. Check the
    // element's actual state directly to cover that race.
    if (video.readyState >= 1) seekToFirstFrame();
    if (video.readyState >= 2) setLoaded(true);

    return () => {
      video.removeEventListener("loadedmetadata", seekToFirstFrame);
      video.removeEventListener("seeked", markLoaded);
      video.removeEventListener("loadeddata", markLoaded);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Play reel: ${label}`}
      className="group relative aspect-[9/16] w-[clamp(150px,15vw,210px)] flex-none cursor-pointer overflow-hidden rounded-2xl border border-ink/9 bg-[repeating-linear-gradient(135deg,#e8e8dc_0_11px,#eeeee4_11px_22px)] text-left"
    >
      {src && (
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="metadata"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-200 group-hover:bg-ink/15 group-hover:opacity-100">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/90">
          <svg width="14" height="16" viewBox="0 0 14 16">
            <path d="M1 1l12 7-12 7z" fill="#111110" />
          </svg>
        </span>
      </div>

      <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-md bg-ink/65 px-2 py-1 font-mono text-[11px] font-semibold text-cream">
        <EyeIcon />
        {views}
      </span>
    </button>
  );
}
