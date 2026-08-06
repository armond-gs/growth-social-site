"use server";

import { createClient } from "@/lib/supabase/server";
import { signStreamToken } from "@/lib/cloudflare/stream";

/**
 * Issues a signed Cloudflare Stream playback token, but only to an
 * authenticated creator AND only for a video that is actually part of the
 * Academy. This is the real access-control enforcement point — the video's
 * own `requireSignedURLs` flag just makes the token necessary, it doesn't
 * decide who deserves one.
 *
 * The uid is checked against the curriculum because it arrives from the
 * client: without that check, any logged-in creator could mint a token for
 * *any* video in the Cloudflare account — the VSL, unreleased lessons,
 * client work — simply by passing its uid.
 */
export async function getSignedStreamToken(videoUid: string): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // RLS already restricts these tables to authenticated readers; this is a
  // membership check, not an authorization one. `limit(1)` rather than
  // `maybeSingle()` so that reusing one video across two lessons stays a
  // valid setup instead of erroring into a denial.
  const [{ data: lessons }, { data: coaches }] = await Promise.all([
    supabase.from("lessons").select("id").eq("video_uid", videoUid).limit(1),
    supabase.from("coaches").select("id").eq("video_uid", videoUid).limit(1),
  ]);

  if (!lessons?.length && !coaches?.length) return null;

  return signStreamToken(videoUid);
}
