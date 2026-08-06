import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_NEXT = "/academy/update-password";

/**
 * Constrains the `next` param to a same-origin path. Without this, a value
 * like `https://evil.com` or `//evil.com` would resolve to that origin in
 * `new URL(next, request.url)` and turn this route into an open redirect
 * (CWE-601) — a phishing hop that borrows our domain's credibility, and one
 * that would leak the token_hash in the outbound Referer.
 */
function safeNext(raw: string | null): string {
  if (!raw) return DEFAULT_NEXT;
  // Must be a single-slash-rooted path: rejects absolute URLs ("https://…"),
  // protocol-relative ("//evil.com"), and backslash variants IE/Edge coerce.
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return DEFAULT_NEXT;
  return raw;
}

// Lands here from the link in Supabase's invite/recovery emails
// (`{{ .SiteURL }}/auth/confirm?token_hash=...&type=...`). Verifies the
// token server-side (establishing a real session cookie) then redirects
// into the app instead of Supabase's generic hosted page.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"));

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/academy", request.url));
}
