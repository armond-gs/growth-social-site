"use client";

import { CONTAINER } from "@/lib/layout";
import { BRANDS } from "@/lib/data/landing";
import { Marquee } from "@/components/ui/Marquee";
import { useMode } from "@/lib/landing/mode";

export function BrandsSection() {
  const { copy } = useMode();

  return (
    <section className="border-y border-[var(--rule)] py-[clamp(28px,4vw,44px)]">
      <div className={`${CONTAINER} mb-[22px]`}>
        <span className="font-mono text-[10.5px] tracking-[0.18em] text-[var(--fg-subtle)] uppercase md:text-xs">
          {copy.proofLabel}
        </span>
      </div>
      <div className="[mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <Marquee
          durationSeconds={38}
          direction="right"
          trackClassName="flex w-max items-center gap-9 md:gap-[clamp(40px,5vw,72px)]"
        >
          {BRANDS.map((brand) => (
            <span
              key={brand}
              className="whitespace-nowrap text-[22px] font-bold tracking-[-0.02em] text-[var(--fg-faint)] md:text-[clamp(20px,2.4vw,30px)]"
            >
              {brand}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
