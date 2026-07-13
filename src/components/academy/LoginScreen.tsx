"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col md:grid md:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative overflow-hidden rounded-b-[22px] bg-green p-6.5 pt-13.5 pb-7.5 text-cream md:flex md:flex-col md:justify-between md:rounded-none md:p-14 md:pt-12 md:pb-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_15%_0%,rgba(241,241,231,0.10),transparent_60%)]" />
        <Image
          src="/logo-cream.png"
          alt=""
          aria-hidden="true"
          width={190}
          height={201}
          className="pointer-events-none absolute -right-[8%] -bottom-[18%] w-[190px] opacity-[0.06] md:w-[clamp(220px,26vw,340px)]"
        />
        <Link
          href="/"
          className="relative mb-7.5 flex items-center gap-2.25 text-cream no-underline md:mb-0"
        >
          <Image src="/logo-cream.png" alt="Growth Social" width={24} height={25} className="h-6 w-auto md:h-[27px]" />
          <span className="text-base font-bold tracking-[-0.02em] md:text-[17px]">Growth Social</span>
        </Link>
        <div className="relative">
          <span className="font-mono text-[11px] tracking-[0.18em] text-cream/55 uppercase md:text-xs">
            Creator Academy
          </span>
          <h1 className="mt-3 max-w-[14ch] text-[38px] leading-[0.98] font-extrabold tracking-[-0.03em] md:mt-4.5 md:text-[clamp(38px,4vw,60px)]">
            Coached like <span className="font-serif font-medium italic">a team.</span>
          </h1>
          <p className="mt-4 max-w-[40ch] text-[14.5px] leading-[1.55] text-cream/64 md:mt-5.5 md:text-base md:leading-[1.6]">
            Your library of lessons, hook breakdowns and performance
            playbooks — everything that makes a Growth Social creator
            convert.
          </p>
        </div>
        <div className="relative hidden gap-10 font-mono text-xs text-cream/50 md:flex">
          <span>150+ creators</span>
          <span>New drops weekly</span>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-6 pt-8 pb-10 md:px-10 md:py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-[380px]">
          <span className="font-mono text-[11px] tracking-[0.16em] text-ink/45 uppercase md:text-xs">
            Creator login
          </span>
          <h2 className="mt-3 mb-6.5 text-[30px] font-bold tracking-[-0.025em] md:mt-3.5 md:mb-8 md:text-[34px]">
            Welcome back.
          </h2>

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
            className="mb-4 w-full rounded-xl border border-ink/18 bg-cream-card px-4 py-3.5 text-[15px] text-ink outline-none"
          />

          <label htmlFor="password" className="mb-1.75 block text-[13px] font-semibold text-ink/70">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mb-2.5 w-full rounded-xl border border-ink/18 bg-cream-card px-4 py-3.5 text-[15px] text-ink outline-none"
          />

          <div className="mb-5.5 text-right md:mb-6">
            <Link href="/academy/reset-password" className="text-[13px] text-ink/55 no-underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green py-4 font-semibold text-cream disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in to Academy"}
          </button>

          <p className="mt-5.5 text-center text-sm text-ink/60 md:mt-6">
            New creator?{" "}
            <Link href="/#book" className="font-semibold text-ink no-underline border-b border-ink/30">
              Request access
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
