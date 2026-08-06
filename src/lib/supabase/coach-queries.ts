import { createClient } from "@/lib/supabase/server";
import type { CoachRow } from "@/lib/academy/types";
import { getThumbnailUrl } from "@/lib/cloudflare/stream";

export async function getCoaches(userId: string): Promise<CoachRow[]> {
  const supabase = await createClient();

  const [{ data: coaches, error: coachesError }, { data: progress, error: progressError }] = await Promise.all([
    supabase.from("coaches").select("id, name, role, video_uid, duration_seconds, sort_order").order("sort_order", { ascending: true }),
    supabase.from("coach_progress").select("coach_id, completed_at").eq("user_id", userId),
  ]);

  if (coachesError) throw coachesError;
  if (progressError) throw progressError;

  const watchedByCoach = new Set((progress ?? []).filter((p) => p.completed_at).map((p) => p.coach_id));

  return (coaches ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    role: c.role,
    videoUid: c.video_uid,
    durationSeconds: c.duration_seconds,
    thumbnailUrl: getThumbnailUrl(c.video_uid),
    watched: watchedByCoach.has(c.id),
  }));
}
