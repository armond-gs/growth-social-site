import Link from "next/link";
import type { ContinueWatching } from "@/lib/academy/types";
import { formatLessonDuration } from "@/lib/academy/types";

export function ContinueWatchingCard({ data }: { data: ContinueWatching }) {
  const { moduleLabel, lessonTitle, progressPercent, durationSeconds, thumbnailUrl, isStart } = data;

  return (
    <div className="mb-14 flex flex-col gap-5 rounded-[20px] bg-green p-3.5 text-cream md:mb-14 md:grid md:grid-cols-[1.4fr_1fr] md:items-center md:gap-[clamp(20px,3vw,40px)] md:p-[clamp(20px,2.5vw,32px)]">
      <div
        className="relative aspect-video overflow-hidden rounded-xl bg-[repeating-linear-gradient(135deg,#16281f_0_14px,#1d3327_14px_28px)] bg-cover bg-center"
        style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : undefined}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/92 md:h-16 md:w-16">
            <svg width="18" height="20" viewBox="0 0 20 22" className="md:h-[22px] md:w-5">
              <path d="M2 2l16 9-16 9z" fill="#111110" />
            </svg>
          </span>
        </div>
        <span className="absolute right-2.5 bottom-2.5 rounded-md bg-black/40 px-2 py-1 font-mono text-[10px] text-cream md:right-3 md:bottom-3 md:bg-ink/60 md:text-[11px]">
          {formatLessonDuration(durationSeconds)}
        </span>
        <span className="absolute top-2.5 left-2.5 hidden rounded-md bg-cream/75 px-1.75 py-0.75 font-mono text-[10px] text-ink/70 md:block">
          16:9 · lesson video
        </span>
      </div>
      <div className="px-0.5 pb-1.5 md:px-0 md:pb-0">
        <span className="font-mono text-[10px] tracking-[0.16em] text-cream/55 uppercase md:text-[11px]">
          {isStart ? "Start here" : "Continue watching"} · {moduleLabel}
        </span>
        <h3 className="mt-2.5 mb-3.5 text-[23px] font-bold tracking-[-0.02em] md:mt-3.5 md:mb-4 md:text-[clamp(22px,2.4vw,30px)]">
          {lessonTitle}
        </h3>
        <div className="mb-1.75 h-1.25 overflow-hidden rounded-full bg-cream/16">
          <div className="h-full bg-cream" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="mb-4.5 font-mono text-[10.5px] text-cream/55 md:mb-5.5 md:text-[11px]">
          {isStart ? "Not started yet" : `${progressPercent}% complete`}
        </div>
        <Link
          href="#"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream px-6 py-3.5 font-semibold text-ink no-underline md:w-auto md:px-6 md:py-[13px] md:text-[15px]"
        >
          {isStart ? "Start" : "Resume"} <span className="font-mono">→</span>
        </Link>
      </div>
    </div>
  );
}
