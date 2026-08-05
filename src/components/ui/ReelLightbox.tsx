"use client";

import { LightboxShell } from "@/components/ui/LightboxShell";
import type { Clip } from "@/lib/data/landing";

export function ReelLightbox({ clip, onClose }: { clip: Clip | null; onClose: () => void }) {
  return (
    <LightboxShell open={!!clip} onClose={onClose}>
      <div className="aspect-[9/16] h-full max-h-[85vh] w-auto overflow-hidden rounded-2xl bg-black">
        {clip && (
          <video
            key={clip.id}
            src={clip.src}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-contain"
          />
        )}
      </div>
    </LightboxShell>
  );
}
