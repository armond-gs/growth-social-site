"use client";

import { useState } from "react";
import { Marquee } from "@/components/ui/Marquee";
import { ReelCard } from "@/components/ui/ReelCard";
import { ReelLightbox } from "@/components/ui/ReelLightbox";
import type { Clip } from "@/lib/data/landing";

export function ReelStrip({ clips }: { clips: Clip[] }) {
  const [openClip, setOpenClip] = useState<Clip | null>(null);

  return (
    <>
      <div className="mt-6 md:mt-[clamp(48px,7vw,88px)] [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]">
        <Marquee durationSeconds={46} direction="left" trackClassName="flex w-max gap-3 px-2 md:gap-4.5">
          {clips.map((clip) => (
            <ReelCard key={clip.id} clip={clip} onOpen={() => setOpenClip(clip)} />
          ))}
        </Marquee>
      </div>
      <ReelLightbox clip={openClip} onClose={() => setOpenClip(null)} />
    </>
  );
}
