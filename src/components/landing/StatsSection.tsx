"use client";

import Image from "next/image";
import { CONTAINER } from "@/lib/layout";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { MonoTick } from "@/components/landing/MonoTick";
import { useMode } from "@/lib/landing/mode";

/**
 * Results block. Restructured from the old 4-up equal grid: the lead stat now
 * carries the section at display size, with the rest demoted to mono footnote
 * rows so they read as supporting evidence rather than four competing claims.
 *
 * This is one of the "big blocks" that inverts with the mode — hence the
 * band-* custom properties rather than fixed green/cream.
 */
export function StatsSection() {
  const { copy, modeEpoch } = useMode();
  const [heroStat, ...restStats] = copy.stats;

  return (
    <section
      id="results"
      className="mode-band relative overflow-hidden py-[clamp(72px,10vw,130px)]"
      style={{ background: "var(--band-bg)", color: "var(--band-fg)" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 12% 0%, var(--band-glow), transparent 55%)",
        }}
      />
      <Image
        src="/logo-cream.png"
        alt=""
        aria-hidden="true"
        width={560}
        height={592}
        className="pointer-events-none absolute -right-[4%] -bottom-[16%] w-[clamp(320px,38vw,560px)] opacity-5 transition-[filter] duration-[900ms]"
        style={{ filter: "var(--watermark-filter)" }}
      />

      <div className={`relative ${CONTAINER}`}>
        <Reveal className="mb-[clamp(44px,6vw,72px)] flex flex-wrap items-end justify-between gap-5">
          {/* band-subtle, not fg-subtle: this sits on the inverted block. */}
          <span style={{ color: "var(--band-subtle)" }}>
            <MonoTick
              key={`receipts-${modeEpoch}`}
              text="/ The receipts"
              replayKey={modeEpoch}
              className="font-mono text-xs tracking-[0.2em] uppercase"
            />
          </span>
          <h2 className="m-0 max-w-[18ch] text-[28px] leading-[1.02] font-bold tracking-[-0.025em] md:text-[clamp(28px,4vw,52px)]">
            {copy.resultsHeading}
          </h2>
        </Reveal>

        <div className="grid gap-[clamp(32px,5vw,64px)] md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-end">
          {/* Lead stat */}
          <Reveal>
            <div className="flex items-baseline leading-[0.85] font-extrabold tracking-[-0.04em]">
              <span className="text-[clamp(96px,15vw,232px)]">
                <CountUp key={`hero-${modeEpoch}`} value={heroStat.value} />
              </span>
              <span className="ml-1 text-[clamp(40px,6vw,96px)]">{heroStat.suffix}</span>
            </div>
            <p
              className="mt-4 max-w-[26ch] text-[14px] leading-[1.45] md:text-[16px]"
              style={{ color: "var(--band-muted)" }}
            >
              {heroStat.label}
            </p>
          </Reveal>

          {/* Supporting stats as footnote rows */}
          <div className="flex flex-col">
            {restStats.map((stat) => (
              <Reveal key={stat.label}>
                <div
                  className="flex items-baseline justify-between gap-6 border-t py-[clamp(14px,2vw,20px)]"
                  style={{ borderColor: "var(--band-rule)" }}
                >
                  <span
                    className="max-w-[28ch] font-mono text-[11.5px] leading-[1.45] tracking-[0.02em] md:text-[12.5px]"
                    style={{ color: "var(--band-muted)" }}
                  >
                    {stat.label}
                  </span>
                  <span className="flex shrink-0 items-baseline text-[22px] font-bold tracking-[-0.02em] md:text-[26px]">
                    <CountUp key={`${stat.label}-${modeEpoch}`} value={stat.value} />
                    <span className="text-[0.62em]">{stat.suffix}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
