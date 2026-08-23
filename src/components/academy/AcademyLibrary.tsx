"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ModuleRow, ContinueWatching, CoachRow } from "@/lib/academy/types";
import { AvatarPlaceholder } from "@/components/ui/AvatarPlaceholder";
import { ContinueWatchingCard } from "@/components/academy/ContinueWatchingCard";
import { CoachesSection } from "@/components/academy/CoachesSection";
import { CurriculumModule } from "@/components/academy/CurriculumModule";
import { StreamLightbox } from "@/components/ui/StreamLightbox";
import { markLessonComplete } from "@/lib/supabase/academy-actions";
import { createClient } from "@/lib/supabase/client";

export function AcademyLibrary({
  creatorEmail,
  modules,
  continueWatching,
  progressPercent,
  coaches,
}: {
  creatorEmail: string;
  modules: ModuleRow[];
  continueWatching: ContinueWatching | null;
  progressPercent: number;
  coaches: CoachRow[];
}) {
  const router = useRouter();

  // One lightbox for the whole curriculum rather than one per module — the
  // player is a singleton, so only the open lesson's id needs tracking.
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const openLesson = useMemo(
    () => modules.flatMap((m) => m.lessons).find((l) => l.id === openLessonId) ?? null,
    [modules, openLessonId],
  );
  // No profiles table yet, so the display name is just derived from the
  // email — swap for a real display name once creator profiles exist.
  const displayName = creatorEmail.split("@")[0] || "creator";
  const lessonCount = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink/10 bg-cream/90 px-4.5 py-3.5 backdrop-saturate-150 backdrop-blur-[10px] md:px-[clamp(20px,4vw,44px)] md:py-4">
        <Link href="/" className="flex items-center gap-2 text-ink no-underline md:gap-3">
          <Image src="/logo-green.png" alt="Growth Social" width={22} height={23} className="h-[22px] w-auto md:h-[27px]" />
          <span className="hidden text-[17px] font-bold tracking-[-0.02em] md:inline">Growth Social</span>
          <span className="rounded-full border border-ink/16 px-2 py-0.75 font-mono text-[10px] tracking-[0.14em] text-ink/50 uppercase md:ml-1 md:px-2.25 md:text-[11px]">
            Academy
          </span>
        </Link>
        <div className="flex items-center gap-3 md:gap-4.5">
          <button
            onClick={handleLogout}
            className="order-1 border-none bg-transparent p-0 font-sans text-[13px] font-medium text-ink/60 md:order-2 md:text-sm"
          >
            Log out
          </button>
          <div className="order-2 flex items-center gap-2.5 md:order-1">
            <AvatarPlaceholder size={32} name={displayName} />
            <span className="hidden text-sm font-semibold md:inline">{displayName}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4.5 pt-5.5 pb-16 md:px-[clamp(20px,4vw,44px)] md:pt-[clamp(28px,4vw,48px)]">
        <div className="mb-6 md:mb-9">
          <span className="font-mono text-[11px] tracking-[0.14em] text-ink/45 uppercase md:text-xs md:tracking-[0.16em]">
            Your progress · {progressPercent}% complete
          </span>
          <h1 className="mt-2.5 mb-4 text-[30px] font-bold tracking-[-0.03em] md:mt-3 md:mb-0 md:text-[clamp(30px,4vw,46px)]">
            Welcome back, {displayName}.
          </h1>
          <div className="h-1.25 overflow-hidden rounded-full bg-ink/10 md:hidden">
            <div className="h-full bg-green" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {continueWatching && (
          <ContinueWatchingCard
            data={continueWatching}
            onOpen={() => setOpenLessonId(continueWatching.lessonId)}
          />
        )}

        <CoachesSection coaches={coaches} />

        <div className="mb-1 flex items-baseline justify-between md:mb-7">
          <h2 className="m-0 text-xl font-bold tracking-[-0.02em] md:text-[22px]">Curriculum</h2>
          <span className="font-mono text-[11px] text-ink/45 md:hidden">{modules.length} modules</span>
          <span className="hidden font-mono text-xs text-ink/45 md:inline">
            {modules.length} modules · {lessonCount} lessons
          </span>
        </div>
        <div className="mb-7 font-mono text-[11px] text-ink/40 md:hidden">{lessonCount} lessons</div>

        <div className="flex flex-col gap-8.5 md:mt-4 md:gap-11">
          {modules.map((mod) => (
            <CurriculumModule key={mod.id} mod={mod} onOpenLesson={setOpenLessonId} />
          ))}
        </div>
      </div>

      {/* Completion is written on the player's real "ended" event, not on
          click — opening a lesson isn't the same as watching it. */}
      <StreamLightbox
        videoUid={openLesson?.videoUid ?? null}
        onClose={() => setOpenLessonId(null)}
        onEnded={openLesson ? () => markLessonComplete(openLesson.id) : undefined}
      />
    </div>
  );
}
