import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UpdatePasswordForm } from "@/components/academy/UpdatePasswordForm";

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No session means the invite/recovery link is missing, expired, or
  // already used — verifyOtp in /auth/confirm would have set one otherwise.
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6 text-center">
        <div className="max-w-[380px]">
          <h1 className="text-2xl font-bold tracking-[-0.02em]">This link has expired.</h1>
          <p className="mt-3 text-ink/66">
            Request a new one from the login page.
          </p>
          <Link
            href="/academy"
            className="mt-6 inline-block border-b border-ink/30 text-sm font-semibold text-ink no-underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return <UpdatePasswordForm />;
}
