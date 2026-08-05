"use client";

import { useState } from "react";
import type { CoachRow } from "@/lib/academy/types";
import { CoachCard } from "@/components/academy/CoachCard";
import { StreamLightbox } from "@/components/ui/StreamLightbox";
import { markCoachWatched } from "@/lib/supabase/coach-actions";

export function CoachesSection({ coaches }: { coaches: CoachRow[] }) {
  const [openCoachId, setOpenCoachId] = useState<string | null>(null);
  const openCoach = coaches.find((c) => c.id === openCoachId) ?? null;

  return (
    <div className="mb-9 md:mb-14">
      <h2 className="m-0 mb-3.5 text-xl font-bold tracking-[-0.02em] md:mb-5 md:text-[22px]">
        Meet your coaches
      </h2>

      {/* Mobile: horizontal scroll-snap row */}
      <div className="-mx-4.5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4.5 pb-1 md:hidden">
        {coaches.map((coach) => (
          <CoachCard key={coach.id} coach={coach} onOpen={() => setOpenCoachId(coach.id)} />
        ))}
      </div>

      {/* Desktop: 2-up grid */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-[clamp(16px,2.4vw,24px)]">
        {coaches.map((coach) => (
          <CoachCard key={coach.id} coach={coach} onOpen={() => setOpenCoachId(coach.id)} />
        ))}
      </div>

      <StreamLightbox
        videoUid={openCoach?.videoUid ?? null}
        onClose={() => setOpenCoachId(null)}
        onEnded={openCoach ? () => markCoachWatched(openCoach.id) : undefined}
      />
    </div>
  );
}
