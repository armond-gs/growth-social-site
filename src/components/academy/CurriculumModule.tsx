import type { Module } from "@/lib/data/academy";
import { LessonCard } from "@/components/academy/LessonCard";

export function CurriculumModule({ mod }: { mod: Module }) {
  return (
    <div>
      <div className="mb-3.5 flex items-baseline gap-2.5 md:gap-3.5">
        <span className="font-mono text-xs text-ink/40">{mod.no}</span>
        <h3 className="m-0 text-xl font-bold tracking-[-0.02em] md:text-[clamp(20px,2.2vw,26px)]">
          {mod.title}
        </h3>
        <span className="font-mono text-[11px] text-ink/40 md:text-xs">
          {mod.count} lessons
        </span>
      </div>
      <div className="-mx-4.5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4.5 pb-3 md:mx-0 md:snap-none md:gap-4 md:px-0">
        {mod.lessons.map((lesson) => (
          <LessonCard key={lesson.no} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
