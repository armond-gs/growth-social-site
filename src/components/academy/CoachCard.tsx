import type { CoachRow } from "@/lib/academy/types";
import { formatLessonDuration } from "@/lib/academy/types";

export function CoachCard({ coach, onOpen }: { coach: CoachRow; onOpen: () => void }) {
  return (
    <div className="w-[200px] flex-none snap-start md:w-auto md:snap-align-none">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Play ${coach.name}'s intro`}
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-ink/10 bg-[repeating-linear-gradient(135deg,#e6e6da_0_14px,#eeeee4_14px_28px)] bg-cover bg-center text-left md:rounded-[14px]"
        style={{ backgroundImage: `url(${coach.thumbnailUrl})` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/90 md:h-14 md:w-14">
            <svg width="14" height="16" viewBox="0 0 14 16" className="md:h-5 md:w-[18px]">
              <path d="M1 1l12 7-12 7z" fill="#f1f1e7" />
            </svg>
          </span>
        </div>
        <span className="absolute right-2 bottom-2 rounded-md bg-ink/62 px-1.75 py-0.75 font-mono text-[10px] text-cream md:right-3 md:bottom-3 md:text-[11px]">
          {formatLessonDuration(coach.durationSeconds)}
        </span>
        <span className="absolute top-2 left-2 rounded-md bg-cream/85 px-1.75 py-0.75 font-mono text-[9px] tracking-[0.06em] text-ink uppercase md:top-3 md:left-3 md:text-[10px]">
          Intro
        </span>
        {coach.watched && (
          <span className="absolute top-2 right-2 rounded-md bg-success px-1.75 py-0.75 font-mono text-[9px] tracking-[0.06em] text-cream uppercase md:top-3 md:right-3 md:text-[10px]">
            Watched
          </span>
        )}
      </button>
      <div className="mt-2.5 md:mt-3.5">
        <span className="text-[15px] font-bold tracking-[-0.01em] md:text-base">{coach.name}</span>
        <span className="mt-0.75 block font-mono text-[11px] text-ink/45 md:mt-1 md:text-xs">{coach.role}</span>
      </div>
    </div>
  );
}
