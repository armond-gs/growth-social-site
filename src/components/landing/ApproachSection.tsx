"use client";

import { CONTAINER } from "@/lib/layout";
import { Reveal } from "@/components/ui/Reveal";
import { MonoTick } from "@/components/landing/MonoTick";
import { useMode } from "@/lib/landing/mode";

export function ApproachSection() {
  const { copy, modeEpoch } = useMode();

  // Padding is asymmetric on purpose: tightened at the top to close the gap
  // with Services above, full spacing at the bottom where it meets the dark
  // final-CTA block.
  return (
    <section id="approach" className="mode-band pt-[clamp(40px,5vw,68px)] pb-[clamp(72px,10vw,140px)]"
      style={{ background: "var(--panel-bg)" }}>
      <div className={CONTAINER}>
        <Reveal className="mb-[clamp(48px,6vw,84px)]">
          <MonoTick
            key={`why-${modeEpoch}`}
            text="/ Why we exist"
            replayKey={modeEpoch}
            className="font-mono text-[10.5px] tracking-[0.2em] text-[var(--fg-subtle)] uppercase md:text-xs"
          />
          <p className="mt-3.5 max-w-[30ch] text-[30px] leading-[1.06] font-bold tracking-[-0.03em] md:text-[clamp(30px,4.6vw,60px)]">
            {copy.approachHeadA}{" "}
            <span className="font-serif font-medium italic">{copy.approachHeadItalic}</span>
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-6.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[clamp(28px,3vw,48px)]">
          {copy.principles.map((p) => (
            <Reveal key={p.no} className="border-t border-[var(--rule-strong)] pt-4.5 md:pt-[22px]">
              <span className="font-mono text-[13px] text-[var(--fg-faint)]">{p.no}</span>
              <h3 className="mt-2.5 mb-2 text-xl font-bold tracking-[-0.02em] md:mt-3.5 md:mb-3 md:text-[clamp(21px,2.2vw,27px)]">
                {p.title}
              </h3>
              <p className="m-0 text-[14.5px] leading-[1.55] text-[var(--fg-muted)] md:text-[15.5px] md:leading-[1.6]">
                {p.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
