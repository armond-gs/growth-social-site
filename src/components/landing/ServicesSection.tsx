"use client";

import { CONTAINER } from "@/lib/layout";
import { Reveal } from "@/components/ui/Reveal";
import { MonoTick } from "@/components/landing/MonoTick";
import { useMode } from "@/lib/landing/mode";

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.75">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-[var(--band-rule-strong)] px-2.75 py-1.5 font-mono text-[10.5px] tracking-[0.02em] text-[var(--band-muted)] md:text-[11.5px]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export function ServicesSection() {
  const { copy, modeEpoch } = useMode();

  // This is the page's mid-point colour break, the role the stats block used
  // to play before it was removed. Padding is symmetric again now that the
  // section carries its own background — the old asymmetry existed to close a
  // whitespace gap with Approach that a colour boundary now handles.
  return (
    <section
      id="services"
      className="mode-band py-[clamp(72px,10vw,140px)]"
      style={{ background: "var(--band-bg)", color: "var(--band-fg)" }}
    >
      <div className={CONTAINER}>
        <Reveal className="mb-[clamp(44px,6vw,80px)] max-w-[60ch]">
          <MonoTick
            key={`svc-kicker-${modeEpoch}`}
            text={copy.servicesKicker}
            replayKey={modeEpoch}
            className="font-mono text-[10.5px] tracking-[0.2em] text-[var(--band-subtle)] uppercase md:text-xs"
          />
          <h2 className="mt-3 text-[34px] leading-[1] font-bold tracking-[-0.03em] md:mt-[18px] md:text-[clamp(32px,5vw,60px)]">
            {copy.servicesHeadA}
            <span className="font-serif font-medium italic">{copy.servicesHeadItalic}</span>
            {copy.servicesHeadB}
          </h2>
        </Reveal>

        <div className="border-t border-[var(--band-rule)]">
          {copy.services.map((svc) => (
            <Reveal key={svc.no} className="border-b border-[var(--band-rule)]">
              {/* Mobile */}
              <div className="py-[26px] md:hidden">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-[var(--band-faint)]">{svc.no}</span>
                    <h3 className="m-0 text-2xl leading-[1.05] font-bold tracking-[-0.02em]">
                      {svc.title}
                    </h3>
                  </div>
                  <span className="font-mono text-lg text-[var(--band-fg)]">↗</span>
                </div>
                <p className="m-0 mt-3.5 mb-4 text-[14.5px] leading-[1.55] text-[var(--band-muted)]">
                  {svc.desc}
                </p>
                <Tags tags={svc.tags} />
              </div>

              {/* Desktop */}
              <div className="hidden grid-cols-[0.14fr_0.32fr_0.44fr_0.1fr] items-start gap-[clamp(16px,3vw,48px)] rounded-xl py-[clamp(30px,4vw,52px)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--band-hover)] hover:px-5 md:grid">
                <span className="font-mono text-sm text-[var(--band-faint)]">{svc.no}</span>
                <h3 className="m-0 text-[clamp(24px,2.8vw,36px)] leading-[1.04] font-bold tracking-[-0.02em]">
                  {svc.title}
                </h3>
                <div>
                  <p className="m-0 mb-5 text-[clamp(15px,1.3vw,18px)] leading-[1.6] text-[var(--band-muted)]">
                    {svc.desc}
                  </p>
                  <Tags tags={svc.tags} />
                </div>
                <span className="flex h-11 w-11 items-center justify-center justify-self-end rounded-full border border-[var(--band-rule-strong)] font-mono text-lg text-[var(--band-fg)]">
                  ↗
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
