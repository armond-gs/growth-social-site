// Pure types + helpers shared between server-only data-fetching code
// (src/lib/supabase/academy-queries.ts) and client components — kept in a
// separate module with zero server-only imports so client components can
// import these without accidentally pulling `next/headers` etc. into the
// browser bundle.

export type LessonRow = {
  id: string;
  no: string;
  title: string;
  videoUid: string | null;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  done: boolean;
};

export type ModuleRow = {
  id: string;
  no: string;
  title: string;
  lessons: LessonRow[];
};

export type ContinueWatching = {
  lessonId: string;
  moduleLabel: string;
  lessonTitle: string;
  progressPercent: number;
  videoUid: string | null;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  // True when there's no real progress yet and this is just a "start here"
  // suggestion (the first lesson) rather than an actual resume point.
  isStart: boolean;
};

export type CoachRow = {
  id: string;
  name: string;
  role: string;
  videoUid: string;
  durationSeconds: number;
  thumbnailUrl: string;
  watched: boolean;
};

export function formatLessonDuration(seconds: number | null): string {
  if (seconds === null) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function getProgressPercent(modules: ModuleRow[]): number {
  const allLessons = modules.flatMap((m) => m.lessons);
  if (allLessons.length === 0) return 0;
  const doneCount = allLessons.filter((l) => l.done).length;
  return Math.round((doneCount / allLessons.length) * 100);
}
