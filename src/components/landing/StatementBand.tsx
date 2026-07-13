import Image from "next/image";
import { STATEMENT_BAND } from "@/lib/data/landing";
import { Marquee } from "@/components/ui/Marquee";

export function StatementBand() {
  return (
    <div className="relative hidden overflow-hidden bg-green py-[clamp(20px,2.4vw,34px)] text-cream md:block">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_50%,transparent_40%,rgba(0,0,0,0.18))]" />
      <div className="relative">
        <Marquee
          durationSeconds={42}
          direction="left"
          trackClassName="flex items-center gap-x-[clamp(26px,3.4vw,54px)] whitespace-nowrap"
        >
          {STATEMENT_BAND.map((phrase) => (
            <span key={phrase.text} className="flex items-center gap-x-[clamp(26px,3.4vw,54px)]">
              <span
                className={`text-[clamp(28px,3.8vw,56px)] tracking-[-0.02em] ${
                  phrase.italic ? "font-serif font-medium italic" : "font-bold"
                }`}
              >
                {phrase.text}
              </span>
              <Image
                src="/logo-cream.png"
                alt=""
                aria-hidden="true"
                width={34}
                height={36}
                className="h-[0.62em] w-auto opacity-65"
              />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
