import type { Lesson } from "@/lib/data/academy";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <div className="w-[200px] flex-none snap-start cursor-pointer md:w-[248px] md:snap-align-none">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-ink/10 bg-[repeating-linear-gradient(135deg,#e6e6da_0_12px,#eeeee4_12px_24px)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-9.5 w-9.5 items-center justify-center rounded-full bg-green/92 md:h-11 md:w-11">
            <svg width="12" height="14" viewBox="0 0 14 16" className="md:h-4 md:w-3.5">
              <path d="M1 1l12 7-12 7z" fill="#f1f1e7" />
            </svg>
          </span>
        </div>
        <span className="absolute right-2 bottom-2 rounded-md bg-ink/60 px-1.75 py-0.75 font-mono text-[9.5px] text-cream">
          {lesson.dur}
        </span>
        {lesson.done && (
          <span className="absolute top-2 left-2 rounded-md bg-success px-1.75 py-0.75 font-mono text-[8.5px] tracking-[0.06em] text-cream">
            DONE
          </span>
        )}
      </div>
      <div className="mt-2.5 flex items-baseline gap-1.75 md:mt-3">
        <span className="font-mono text-[10px] text-ink/40">{lesson.no}</span>
        <span className="text-sm leading-[1.3] font-semibold">{lesson.title}</span>
      </div>
    </div>
  );
}
