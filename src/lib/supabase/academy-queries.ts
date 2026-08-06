import { createClient } from "@/lib/supabase/server";
import type { ModuleRow, ContinueWatching } from "@/lib/academy/types";

type ProgressRow = {
  lesson_id: string;
  seconds_watched: number;
  completed_at: string | null;
  updated_at: string;
};

/**
 * Fetches the full curriculum (modules → lessons) along with this user's
 * completion state for each lesson. Lessons/modules are ordered by
 * sort_order — Supabase doesn't guarantee nested-relation ordering, so we
 * sort lessons client-side after fetching.
 */
export async function getCurriculum(userId: string): Promise<ModuleRow[]> {
  const supabase = await createClient();

  const [{ data: modules, error: modulesError }, { data: progress, error: progressError }] = await Promise.all([
    supabase
      .from("modules")
      .select("id, no, title, sort_order, lessons(id, no, title, video_uid, duration_seconds, sort_order)")
      .order("sort_order", { ascending: true }),
    supabase
      .from("lesson_progress")
      .select("lesson_id, seconds_watched, completed_at, updated_at")
      .eq("user_id", userId),
  ]);

  if (modulesError) throw modulesError;
  if (progressError) throw progressError;

  const progressByLesson = new Map<string, ProgressRow>((progress ?? []).map((p) => [p.lesson_id, p]));

  return (modules ?? []).map((m) => ({
    id: m.id,
    no: m.no,
    title: m.title,
    lessons: (m.lessons ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((l) => ({
        id: l.id,
        no: l.no,
        title: l.title,
        videoUid: l.video_uid,
        durationSeconds: l.duration_seconds,
        done: !!progressByLesson.get(l.id)?.completed_at,
      })),
  }));
}

/**
 * The "Continue watching" card's content: the most recently-touched
 * incomplete lesson, or — for a creator with no progress yet — the very
 * first lesson as a "start here" suggestion.
 */
export async function getContinueWatching(
  userId: string,
  modules: ModuleRow[],
): Promise<ContinueWatching | null> {
  const supabase = await createClient();
  const { data: progress, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id, seconds_watched, completed_at, updated_at")
    .eq("user_id", userId)
    .is("completed_at", null)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error) throw error;

  const inProgress = progress?.[0];

  if (inProgress) {
    for (const mod of modules) {
      const lesson = mod.lessons.find((l) => l.id === inProgress.lesson_id);
      if (lesson) {
        const percent =
          lesson.durationSeconds && lesson.durationSeconds > 0
            ? Math.min(100, Math.round((inProgress.seconds_watched / lesson.durationSeconds) * 100))
            : 0;
        return {
          lessonId: lesson.id,
          moduleLabel: `Module ${mod.no} · ${mod.title}`,
          lessonTitle: lesson.title,
          progressPercent: percent,
          videoUid: lesson.videoUid,
          durationSeconds: lesson.durationSeconds,
          isStart: false,
        };
      }
    }
  }

  // No progress yet — suggest the first lesson of the first module.
  const firstModule = modules[0];
  const firstLesson = firstModule?.lessons[0];
  if (!firstModule || !firstLesson) return null;

  return {
    lessonId: firstLesson.id,
    moduleLabel: `Module ${firstModule.no} · ${firstModule.title}`,
    lessonTitle: firstLesson.title,
    progressPercent: 0,
    videoUid: firstLesson.videoUid,
    durationSeconds: firstLesson.durationSeconds,
    isStart: true,
  };
}
