import { CONTAINER } from "@/lib/layout";
import { SERVICES } from "@/lib/data/landing";
import { Reveal } from "@/components/ui/Reveal";

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.75">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-ink/16 px-2.75 py-1.5 font-mono text-[10.5px] tracking-[0.02em] text-ink/60 md:text-[11.5px]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="py-[clamp(72px,10vw,140px)]">
      <div className={CONTAINER}>
        <Reveal className="mb-[clamp(44px,6vw,80px)] max-w-[60ch]">
          <span className="font-mono text-[10.5px] tracking-[0.2em] text-ink/45 uppercase md:text-xs">
            / What we do
          </span>
          <h2 className="mt-3 text-[34px] leading-[1] font-bold tracking-[-0.03em] md:mt-[18px] md:text-[clamp(32px,5vw,60px)]">
            Three things, done{" "}
            <span className="font-serif font-medium italic">obsessively</span>{" "}
            well.
          </h2>
        </Reveal>

        <div className="border-t border-ink/14">
          {SERVICES.map((svc) => (
            <Reveal key={svc.no} className="border-b border-ink/14">
              {/* Mobile */}
              <div className="py-[26px] md:hidden">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-ink/40">{svc.no}</span>
                    <h3 className="m-0 text-2xl leading-[1.05] font-bold tracking-[-0.02em]">
                      {svc.title}
                    </h3>
                  </div>
                  <span className="font-mono text-lg text-ink">↗</span>
                </div>
                <p className="m-0 mt-3.5 mb-4 text-[14.5px] leading-[1.55] text-ink/66">
                  {svc.desc}
                </p>
                <Tags tags={svc.tags} />
              </div>

              {/* Desktop */}
              <div className="hidden grid-cols-[0.14fr_0.32fr_0.44fr_0.1fr] items-start gap-[clamp(16px,3vw,48px)] rounded-xl py-[clamp(30px,4vw,52px)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green/5 hover:px-5 md:grid">
                <span className="font-mono text-sm text-ink/40">{svc.no}</span>
                <h3 className="m-0 text-[clamp(24px,2.8vw,36px)] leading-[1.04] font-bold tracking-[-0.02em]">
                  {svc.title}
                </h3>
                <div>
                  <p className="m-0 mb-5 text-[clamp(15px,1.3vw,18px)] leading-[1.6] text-ink/66">
                    {svc.desc}
                  </p>
                  <Tags tags={svc.tags} />
                </div>
                <span className="flex h-11 w-11 items-center justify-center justify-self-end rounded-full border border-ink/20 font-mono text-lg text-green">
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
