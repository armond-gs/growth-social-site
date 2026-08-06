import { CONTAINER } from "@/lib/layout";
import { PRINCIPLES } from "@/lib/data/landing";
import { Reveal } from "@/components/ui/Reveal";

export function ApproachSection() {
  // Padding is asymmetric on purpose: tightened at the top to close the gap
  // with Services above, full spacing at the bottom where it meets the dark
  // final-CTA block.
  return (
    <section id="approach" className="bg-panel pt-[clamp(40px,5vw,68px)] pb-[clamp(72px,10vw,140px)]">
      <div className={CONTAINER}>
        <Reveal className="mb-[clamp(48px,6vw,84px)]">
          <span className="font-mono text-[10.5px] tracking-[0.2em] text-ink/45 uppercase md:text-xs">
            / Why we exist
          </span>
          <p className="mt-3.5 max-w-[30ch] text-[30px] leading-[1.06] font-bold tracking-[-0.03em] md:text-[clamp(30px,4.6vw,60px)]">
            Traditional agencies optimize for output.{" "}
            <span className="font-serif font-medium italic">
              We optimize for you.
            </span>
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-6.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[clamp(28px,3vw,48px)]">
          {PRINCIPLES.map((p) => (
            <Reveal key={p.no} className="border-t border-ink/20 pt-4.5 md:pt-[22px]">
              <span className="font-mono text-[13px] text-ink/40">{p.no}</span>
              <h3 className="mt-2.5 mb-2 text-xl font-bold tracking-[-0.02em] md:mt-3.5 md:mb-3 md:text-[clamp(21px,2.2vw,27px)]">
                {p.title}
              </h3>
              <p className="m-0 text-[14.5px] leading-[1.55] text-ink/66 md:text-[15.5px] md:leading-[1.6]">
                {p.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
