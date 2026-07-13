import Image from "next/image";
import { CONTAINER } from "@/lib/layout";
import { STATS } from "@/lib/data/landing";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

export function StatsSection() {
  return (
    <section
      id="results"
      className="relative overflow-hidden bg-green py-[clamp(72px,10vw,130px)] text-cream"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_12%_0%,rgba(241,241,231,0.09),transparent_55%)]" />
      <Image
        src="/logo-cream.png"
        alt=""
        aria-hidden="true"
        width={560}
        height={592}
        className="pointer-events-none absolute -right-[4%] -bottom-[16%] w-[clamp(320px,38vw,560px)] opacity-5"
      />
      <div className={`relative ${CONTAINER}`}>
        <Reveal className="mb-[clamp(44px,6vw,72px)] flex flex-wrap items-end justify-between gap-5">
          <span className="font-mono text-xs tracking-[0.2em] text-cream/50 uppercase">
            / The receipts
          </span>
          <h2 className="m-0 max-w-[18ch] text-[28px] leading-[1.02] font-bold tracking-[-0.025em] md:text-[clamp(28px,4vw,52px)]">
            Content that earns its place in the ad account.
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-cream/14 bg-cream/14 md:grid-cols-4">
          {STATS.map((stat) => (
            <Reveal key={stat.label} className="bg-[#111110] p-[22px] md:p-[clamp(28px,3.5vw,44px)]">
              <div className="flex items-baseline text-[44px] leading-none font-extrabold tracking-[-0.03em] md:text-[clamp(46px,6vw,84px)]">
                <CountUp value={stat.value} />
                <span className="ml-0.5 text-[0.5em]">{stat.suffix}</span>
              </div>
              <p className="mt-3 max-w-[22ch] text-[12.5px] leading-[1.45] text-cream/60 md:mt-4 md:text-[14.5px]">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
