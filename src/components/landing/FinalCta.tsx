import Image from "next/image";
import Link from "next/link";
import { CONTAINER } from "@/lib/layout";
import { Reveal } from "@/components/ui/Reveal";
import { BookCallButton, BookingReveal } from "@/components/booking/BookingReveal";

export function FinalCta() {
  return (
    <section
      id="book"
      className="relative overflow-hidden bg-green py-[clamp(80px,12vw,160px)] text-cream"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_0%,rgba(241,241,231,0.10),transparent_60%)]" />
      <Image
        src="/logo-cream.png"
        alt=""
        aria-hidden="true"
        width={620}
        height={654}
        className="pointer-events-none absolute top-1/2 left-1/2 w-[clamp(340px,42vw,620px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.045]"
      />
      <div className={`relative ${CONTAINER} text-center`}>
        <Reveal
          as="span"
          className="mb-6.5 inline-block font-mono text-xs tracking-[0.2em] text-cream/50 uppercase"
        >
          / Let&rsquo;s talk
        </Reveal>
        <Reveal
          delay={80}
          className="mx-auto max-w-[16ch] text-[46px] leading-[0.98] font-extrabold tracking-[-0.035em] md:text-[clamp(40px,7vw,96px)] md:leading-[0.96]"
        >
          <h2 className="m-0">
            Content that <span className="font-serif font-medium italic">performs.</span>
          </h2>
        </Reveal>
        <Reveal
          delay={160}
          className="mt-[30px] flex flex-col items-center gap-3.5 md:mt-[clamp(36px,5vw,52px)] md:flex-row md:flex-wrap md:justify-center md:gap-4.5"
        >
          <BookCallButton className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-cream px-8 py-4 font-semibold text-ink no-underline transition-all duration-300 ease-out md:w-auto md:rounded-full md:px-8 md:py-[18px] md:text-[17px] md:hover:-translate-y-0.5 md:hover:shadow-[0_16px_34px_-14px_rgba(0,0,0,0.5)]">
            Book a call <span className="font-mono">→</span>
          </BookCallButton>
          <Link
            href="mailto:contact@growthsocialhq.com"
            className="border-b border-cream/30 pb-[3px] font-mono text-sm text-cream/85 no-underline"
          >
            contact@growthsocialhq.com
          </Link>
        </Reveal>

        <BookingReveal />
      </div>
    </section>
  );
}
