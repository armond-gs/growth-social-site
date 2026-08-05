"use server";

import { createClient } from "@/lib/supabase/server";
import { signStreamToken } from "@/lib/cloudflare/stream";

/**
 * Issues a signed Cloudflare Stream playback token for a video, but only to
 * an authenticated creator — this is the actual access-control enforcement
 * point, not just "the video happens to require a signed URL."
 */
export async function getSignedStreamToken(videoUid: string): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return signStreamToken(videoUid);
}
