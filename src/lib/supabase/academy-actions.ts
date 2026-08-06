"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Upserts watch progress for a lesson. Intended to be called periodically
 * by a video player (once lesson videos are wired up) with the current
 * playback position. Not yet called from anywhere — lesson videos aren't
 * uploaded yet — but the write-path is ready for when they are.
 */
export async function updateLessonProgress(lessonId: string, secondsWatched: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      seconds_watched: secondsWatched,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );

  if (error) return { error: error.message };

  revalidatePath("/academy");
  return { error: null };
}

/** Marks a lesson complete for the current user — e.g. on video end. */
export async function markLessonComplete(lessonId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );

  if (error) return { error: error.message };

  revalidatePath("/academy");
  return { error: null };
}
