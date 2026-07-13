import Link from "next/link";
import { CONTAINER } from "@/lib/layout";
import { CLIPS } from "@/lib/data/landing";
import { Reveal } from "@/components/ui/Reveal";
import { ReelStrip } from "@/components/landing/ReelStrip";

export function Hero() {
  return (
    <header id="top" className="pt-[clamp(130px,17vh,190px)] pb-[clamp(48px,7vw,80px)]">
      <div className={CONTAINER}>
        <Reveal className="mb-[clamp(26px,4vw,44px)] flex items-center gap-3.5">
          <span className="font-mono text-[10.5px] tracking-[0.2em] text-ink/50 uppercase md:text-xs">
            UGC Agency
          </span>
          <span className="h-px w-7 bg-ink/28 md:w-11" />
          <span className="font-mono text-[10.5px] tracking-[0.2em] text-ink/50 uppercase md:text-xs">
            Est. 2026
          </span>
        </Reveal>

        <h1 className="m-0 max-w-[14ch] text-[41px] leading-[0.98] font-extrabold tracking-[-0.035em] md:text-[clamp(48px,9.2vw,132px)] md:leading-[0.92]">
          <Reveal as="span" className="block">
            Creator-focused.
          </Reveal>
          <Reveal
            as="span"
            delay={90}
            className="block font-serif text-[0.95em] font-medium tracking-[-0.01em] italic"
          >
            Outcome-obsessed.
          </Reveal>
          <Reveal as="span" delay={180} className="block">
            Against the grain.
          </Reveal>
        </h1>

        <div className="mt-[22px] flex flex-wrap items-end justify-between gap-8 md:mt-[clamp(32px,5vw,56px)]">
          <Reveal
            delay={240}
            className="m-0 max-w-[46ch] text-base leading-[1.55] text-ink/68 md:text-[clamp(17px,1.5vw,21px)]"
          >
            <p className="m-0">
              Growth Social is a UGC agency built around the people who make
              the content — and the results our clients actually care about.
              We coach creators like a team and measure ourselves on your
              numbers.
            </p>
          </Reveal>

          <Reveal
            delay={300}
            className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-5"
          >
            <Link
              href="#book"
              className="flex items-center justify-center gap-2 rounded-[14px] bg-green px-6 py-4 font-semibold text-cream no-underline transition-all duration-300 ease-out md:inline-flex md:w-auto md:rounded-full md:px-[26px] md:hover:-translate-y-0.5 md:hover:bg-green-hover md:hover:shadow-[0_16px_30px_-14px_rgba(20,56,40,0.7)]"
            >
              Book a call <span className="font-mono">→</span>
            </Link>
            <Link
              href="#services"
              className="flex items-center justify-center rounded-[14px] border border-ink/20 px-6 py-3.5 font-semibold text-ink no-underline md:inline-flex md:w-auto md:border-0 md:border-b md:border-ink/30 md:rounded-none md:px-0 md:py-0 md:pb-[3px]"
            >
              See the work
            </Link>
          </Reveal>
        </div>
      </div>

      {/* UGC reel strip — infinite auto-scrolling marquee, click a card to play */}
      <ReelStrip clips={CLIPS} />
    </header>
  );
}
