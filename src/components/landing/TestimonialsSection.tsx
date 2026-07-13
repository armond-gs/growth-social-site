import { CONTAINER } from "@/lib/layout";
import { TESTIMONIALS } from "@/lib/data/landing";
import { AvatarPlaceholder } from "@/components/ui/AvatarPlaceholder";
import { Reveal } from "@/components/ui/Reveal";

function TestimonialCard({
  t,
  carousel = false,
}: {
  t: (typeof TESTIMONIALS)[number];
  carousel?: boolean;
}) {
  return (
    <Reveal className={carousel ? "w-[290px] flex-none snap-start" : ""}>
      <figure className="m-0 flex min-h-[250px] flex-col justify-between rounded-2xl border border-ink/10 bg-cream-card p-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] md:min-h-[280px] md:p-[clamp(26px,3vw,38px)] md:hover:-translate-y-1.5 md:hover:border-green/40 md:hover:shadow-[0_22px_44px_-24px_rgba(20,56,40,0.4)]">
        <blockquote className="m-0 font-serif text-xl leading-[1.32] tracking-[-0.01em] text-ink md:text-[clamp(20px,1.9vw,26px)]">
          “{t.quote}”
        </blockquote>
        <figcaption className="mt-5.5 flex items-center gap-2.75 md:mt-7">
          <AvatarPlaceholder size={38} />
          <div>
            <div className="text-sm font-semibold">{t.name}</div>
            <div className="mt-0.5 font-mono text-[11px] text-ink/50">{t.role}</div>
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function TestimonialsSection() {
  return (
    <section id="voices" className="py-[clamp(72px,10vw,140px)]">
      <Reveal className={`${CONTAINER} mb-[22px] flex items-center justify-between md:mb-[clamp(44px,6vw,72px)]`}>
        <span className="font-mono text-[10.5px] tracking-[0.2em] text-ink/45 uppercase md:text-xs">
          / In their words
        </span>
        <span className="font-mono text-[10.5px] text-ink/35 md:hidden">swipe →</span>
      </Reveal>

      {/* Mobile: scroll-snap carousel */}
      <div className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-[clamp(20px,5vw,48px)] pb-1 md:hidden">
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.name} t={t} carousel />
        ))}
      </div>

      {/* Desktop: 3-up grid */}
      <div className={`${CONTAINER} hidden md:grid md:grid-cols-3 md:gap-[clamp(20px,2.5vw,32px)]`}>
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.name} t={t} />
        ))}
      </div>
    </section>
  );
}
