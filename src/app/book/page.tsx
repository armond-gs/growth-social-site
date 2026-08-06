import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { SLOT_DURATION_MINUTES } from "@/lib/booking/config";

export const metadata: Metadata = {
  title: "Book a call — Growth Social",
  description:
    "Book a short intro call with Growth Social. Tell us what you're building and we'll show you what UGC can do for it.",
};

/**
 * Standalone booking page — the shareable link to hand out in emails, DMs,
 * and ad destinations. Renders the same <BookingFlow /> the landing page
 * reveals inline, so both stay in step by construction.
 */
export default function BookPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(135%_95%_at_50%_-12%,#f6f6ee_0%,#f1f1e7_44%,#eaeadd_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[820px] flex-col px-[clamp(20px,5vw,48px)] py-8 md:py-14">
        <Link href="/" className="mb-10 inline-flex items-center gap-2.5 self-start text-ink no-underline md:mb-14">
          <Image src="/logo-green.png" alt="Growth Social" width={27} height={29} className="h-[26px] w-auto" priority />
          <span className="text-[17px] font-bold tracking-[-0.02em]">Growth Social</span>
        </Link>

        <div className="mb-8 md:mb-10">
          <span className="font-mono text-[11px] tracking-[0.2em] text-ink/45 uppercase md:text-xs">
            / Let&rsquo;s talk
          </span>
          <h1 className="mt-4 text-[38px] leading-[1.02] font-extrabold tracking-[-0.035em] md:text-[clamp(40px,5.5vw,62px)]">
            Book a <span className="font-serif font-medium italic">call.</span>
          </h1>
          <p className="mt-4 max-w-[46ch] text-[15.5px] leading-[1.6] text-ink/62 md:text-base">
            {SLOT_DURATION_MINUTES}{" "}
            minutes with the team. We&rsquo;ll talk through what
            you&rsquo;re building, what&rsquo;s working, and whether creator content is
            the right lever for it.
          </p>
        </div>

        <BookingFlow />

        <p className="mt-8 font-mono text-[12px] text-ink/45">
          Prefer email?{" "}
          <a href="mailto:contact@growthsocialhq.com" className="border-b border-ink/25 text-ink/70 no-underline">
            contact@growthsocialhq.com
          </a>
        </p>
      </div>
    </div>
  );
}
