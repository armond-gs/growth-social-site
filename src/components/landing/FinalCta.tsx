"use client";

import Image from "next/image";
import { CONTAINER } from "@/lib/layout";
import { Reveal } from "@/components/ui/Reveal";
import { BookCallButton, BookingReveal } from "@/components/booking/BookingReveal";
import { MonoTick } from "@/components/landing/MonoTick";
import { useMode } from "@/lib/landing/mode";

const CTA_CLASS =
  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[var(--band-btn-bg)] px-8 py-4 font-semibold text-[var(--band-btn-fg)] no-underline transition-all duration-300 ease-out md:w-auto md:rounded-full md:px-8 md:py-[18px] md:text-[17px] md:hover:-translate-y-0.5 md:hover:shadow-[0_16px_34px_-14px_rgba(0,0,0,0.5)]";

export function FinalCta() {
  const { copy, modeEpoch } = useMode();

  return (
    <section
      id="book"
      className="mode-band relative overflow-hidden py-[clamp(80px,12vw,160px)]"
      style={{ background: "var(--band-bg)", color: "var(--band-fg)" }}
    >
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(70% 80% at 50% 0%, var(--band-glow), transparent 60%)" }} />
      <Image
        src="/logo-cream.png"
        alt=""
        aria-hidden="true"
        width={620}
        height={654}
        className="pointer-events-none absolute top-1/2 left-1/2 w-[clamp(340px,42vw,620px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.045] transition-[filter] duration-[900ms]"
        style={{ filter: "var(--watermark-filter)" }}
      />
      <div className={`relative ${CONTAINER} text-center`}>
        <Reveal as="span" className="mb-6.5 inline-block" >
          <span style={{ color: "var(--band-subtle)" }}>
            <MonoTick
              key={`cta-kicker-${modeEpoch}`}
              text={copy.ctaKicker}
              replayKey={modeEpoch}
              className="font-mono text-xs tracking-[0.2em] uppercase"
            />
          </span>
        </Reveal>
        <Reveal
          delay={80}
          className="mx-auto max-w-[16ch] text-[46px] leading-[0.98] font-extrabold tracking-[-0.035em] md:text-[clamp(40px,7vw,96px)] md:leading-[0.96]"
        >
          <h2 className="m-0">
            {copy.ctaHeadA} <span className="font-serif font-medium italic">{copy.ctaHeadItalic}</span>
          </h2>
        </Reveal>
        <Reveal
          delay={160}
          className="mt-[30px] flex flex-col items-center gap-3.5 md:mt-[clamp(36px,5vw,52px)] md:flex-row md:flex-wrap md:justify-center md:gap-4.5"
        >
          {/* Brand books a call inline; creator applies. */}
          {copy.heroCtaOpensBooking ? (
            <BookCallButton className={CTA_CLASS}>
              {copy.heroCta} <span className="font-mono">↓</span>
            </BookCallButton>
          ) : (
            <a
              href={copy.heroCtaHref}
              target="_blank"
              rel="noopener noreferrer"
              className={CTA_CLASS}
            >
              {copy.heroCta} <span className="font-mono">→</span>
            </a>
          )}
        </Reveal>

        {/* Brand only. Creators apply rather than book a call, so the panel
            isn't mounted in creator mode at all — that also means a /#book
            deep link can't expand it behind the wrong audience. */}
        {copy.heroCtaOpensBooking && <BookingReveal />}
      </div>
    </section>
  );
}
