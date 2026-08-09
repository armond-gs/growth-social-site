"use client";

import Image from "next/image";
import Link from "next/link";
import { CONTAINER } from "@/lib/layout";
import { CLIPS } from "@/lib/data/landing";
import { Reveal } from "@/components/ui/Reveal";
import { ReelStrip } from "@/components/landing/ReelStrip";
import { BookCallButton } from "@/components/booking/BookingReveal";
import { AudienceToggle } from "@/components/landing/AudienceToggle";
import { WordRise } from "@/components/landing/WordRise";
import { MonoTick } from "@/components/landing/MonoTick";
import { useMode } from "@/lib/landing/mode";

export function Hero() {
  const { copy, modeEpoch } = useMode();

  const primaryCta =
    "flex cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[var(--btn-bg)] px-6 py-4 font-semibold text-[var(--btn-fg)] no-underline transition-all duration-300 ease-out md:inline-flex md:w-auto md:rounded-full md:px-[26px] md:hover:-translate-y-0.5 md:hover:shadow-[0_16px_30px_-14px_rgba(20,56,40,0.7)]";

  return (
    <header id="top" className="relative pt-[clamp(96px,13vh,140px)] pb-[clamp(48px,7vw,80px)]">
      {/* Faint watermark. One literal image, tone-flipped per mode with a CSS
          filter rather than swapping src — no second fetch, no mid-switch flash. */}
      <Image
        src="/logo-green.png"
        alt=""
        aria-hidden="true"
        width={520}
        height={548}
        priority={false}
        className="pointer-events-none absolute -top-[4%] right-[-6%] w-[clamp(220px,30vw,520px)] opacity-[0.05] transition-[filter] duration-[900ms]"
        style={{ filter: "var(--watermark-filter)" }}
      />

      <div className={`relative ${CONTAINER}`}>
        <div className="mb-[clamp(30px,5vw,52px)]">
          <AudienceToggle />
        </div>

        {/* Eyebrow: kicker left, hairline stretching across, Est. 2026 right */}
        <Reveal className="mb-[clamp(26px,4vw,44px)] flex items-center gap-3.5">
          <MonoTick
            key={`kicker-${modeEpoch}`}
            text={copy.heroKicker}
            replayKey={modeEpoch}
            className="font-mono text-[10.5px] tracking-[0.2em] whitespace-nowrap text-[var(--fg-subtle)] uppercase md:text-xs"
          />
          <span
            aria-hidden="true"
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(90deg, var(--rule-strong), var(--rule) 40%, transparent)",
            }}
          />
          <span className="font-mono text-[10.5px] tracking-[0.2em] whitespace-nowrap text-[var(--fg-subtle)] uppercase md:text-xs">
            Est. 2026
          </span>
        </Reveal>

        <h1 className="m-0 max-w-[14ch] text-[41px] leading-[0.98] font-extrabold tracking-[-0.035em] md:text-[clamp(48px,9.2vw,132px)] md:leading-[0.92]">
          <span className="block">
            <WordRise text={copy.heroLine1} lineDelay={0} replayKey={`l1-${modeEpoch}`} />
          </span>
          <span className="block text-[0.95em] tracking-[-0.012em]">
            <WordRise text={copy.heroLine2} lineDelay={110} replayKey={`l2-${modeEpoch}`} italic />
          </span>
          <span className="block">
            <WordRise text={copy.heroLine3} lineDelay={220} replayKey={`l3-${modeEpoch}`} />
          </span>
        </h1>

        <div className="mt-[22px] flex flex-wrap items-end justify-between gap-8 md:mt-[clamp(32px,5vw,56px)]">
          <Reveal
            delay={240}
            className="m-0 max-w-[46ch] text-base leading-[1.55] text-[var(--fg-muted)] md:text-[clamp(17px,1.5vw,21px)]"
          >
            <p className="m-0">{copy.heroBody}</p>
          </Reveal>

          <Reveal
            delay={300}
            className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-5"
          >
            {copy.heroCtaOpensBooking ? (
              <BookCallButton className={primaryCta}>
                {copy.heroCta} <span className="font-mono">→</span>
              </BookCallButton>
            ) : (
              <a
                href={copy.heroCtaHref}
                target="_blank"
                rel="noopener noreferrer"
                className={primaryCta}
              >
                {copy.heroCta} <span className="font-mono">→</span>
              </a>
            )}
            <Link
              href={copy.heroAltHref}
              className="flex items-center justify-center rounded-[14px] border border-[var(--rule-strong)] px-6 py-3.5 font-semibold text-[var(--fg)] no-underline md:inline-flex md:w-auto md:rounded-none md:border-0 md:border-b md:border-[var(--rule-strong)] md:px-0 md:py-0 md:pb-[3px]"
            >
              {copy.heroAlt}
            </Link>
          </Reveal>
        </div>
      </div>

      {/* UGC reel strip — auto-scrolling marquee that stays manually draggable */}
      <ReelStrip clips={CLIPS} />

    </header>
  );
}
