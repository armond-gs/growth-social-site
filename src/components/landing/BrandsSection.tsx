import { CONTAINER } from "@/lib/layout";
import { BRANDS } from "@/lib/data/landing";
import { Marquee } from "@/components/ui/Marquee";

export function BrandsSection() {
  return (
    <section className="border-y border-ink/10 py-[clamp(28px,4vw,44px)]">
      <div className={`${CONTAINER} mb-[22px]`}>
        <span className="font-mono text-[10.5px] tracking-[0.18em] text-ink/45 uppercase md:text-xs">
          Trusted by brands of every size
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
              className="whitespace-nowrap text-[22px] font-bold tracking-[-0.02em] text-ink/34 md:text-[clamp(20px,2.4vw,30px)]"
            >
              {brand}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
