"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    // Name and password in one call — this is the only moment an invited
    // creator is guaranteed to be here, so asking twice would lose most of them.
    const trimmed = name.trim();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
      ...(trimmed ? { data: { display_name: trimmed } } : {}),
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/academy");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-[380px]">
        <span className="font-mono text-[11px] tracking-[0.16em] text-ink/45 uppercase">
          Creator Academy
        </span>
        <h2 className="mt-3 mb-6.5 text-[30px] font-bold tracking-[-0.025em]">
          Set up your account.
        </h2>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>
        )}

        <label htmlFor="name" className="mb-1.75 block text-[13px] font-semibold text-ink/70">
          Your name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="How should we greet you?"
          className="mb-4 w-full rounded-xl border border-ink/18 bg-cream-card px-4 py-3.5 text-[15px] text-ink outline-none"
        />

        <label htmlFor="password" className="mb-1.75 block text-[13px] font-semibold text-ink/70">
          New password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mb-4 w-full rounded-xl border border-ink/18 bg-cream-card px-4 py-3.5 text-[15px] text-ink outline-none"
        />

        <label htmlFor="confirm" className="mb-1.75 block text-[13px] font-semibold text-ink/70">
          Confirm password
        </label>
        <input
          id="confirm"
          type="password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          className="mb-6 w-full rounded-xl border border-ink/18 bg-cream-card px-4 py-3.5 text-[15px] text-ink outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green py-4 font-semibold text-cream disabled:opacity-60"
        >
          {loading ? "Saving…" : "Set password"}
        </button>
      </form>
    </div>
  );
}
