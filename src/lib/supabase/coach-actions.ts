"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Marks a coach intro video watched for the current user — called when the
 * Stream player fires its real 'ended' event, not just on click-to-open. */
export async function markCoachWatched(coachId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { error } = await supabase.from("coach_progress").upsert(
    {
      user_id: user.id,
      coach_id: coachId,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,coach_id" },
  );

  if (error) return { error: error.message };

  revalidatePath("/academy");
  return { error: null };
}
