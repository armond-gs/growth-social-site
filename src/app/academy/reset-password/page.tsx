"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?type=recovery&next=/academy/update-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    // Always show the same success state whether or not the email has an
    // account — avoids leaking which addresses are registered.
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6 text-center">
        <div className="max-w-[380px]">
          <h1 className="text-2xl font-bold tracking-[-0.02em]">Check your email.</h1>
          <p className="mt-3 text-ink/66">
            If an account exists for {email}, we&rsquo;ve sent a link to reset your password.
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-[380px]">
        <span className="font-mono text-[11px] tracking-[0.16em] text-ink/45 uppercase">
          Creator Academy
        </span>
        <h2 className="mt-3 mb-3.5 text-[30px] font-bold tracking-[-0.025em]">
          Reset your password.
        </h2>
        <p className="mb-6.5 text-sm text-ink/66">
          Enter your email and we&rsquo;ll send you a reset link.
        </p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>
        )}

        <label htmlFor="email" className="mb-1.75 block text-[13px] font-semibold text-ink/70">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="mb-6 w-full rounded-xl border border-ink/18 bg-cream-card px-4 py-3.5 text-[15px] text-ink outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green py-4 font-semibold text-cream disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>

        <p className="mt-5.5 text-center text-sm text-ink/60">
          <Link href="/academy" className="border-b border-ink/30 font-semibold text-ink no-underline">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
}
