import Image from "next/image";
import Link from "next/link";
import { CONTAINER } from "@/lib/layout";
import { FOOTER_LINKS } from "@/lib/data/landing";

export function Footer() {
  return (
    <footer className="pt-[clamp(48px,6vw,72px)] pb-10">
      <div className={CONTAINER}>
        <div className="flex flex-wrap items-start justify-between gap-7 border-b border-ink/12 pb-9">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-green.png" alt="Growth Social" width={28} height={30} className="h-7 w-auto" />
            <span className="text-lg font-bold tracking-[-0.02em]">Growth Social</span>
          </div>
          <div className="flex flex-wrap gap-x-[30px] gap-y-3">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink/60 no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-between gap-4 font-mono text-xs text-ink/42">
          <span>© 2026 Growth Social — UGC, done differently.</span>
          <span>Creators first. Outcomes always.</span>
        </div>
      </div>
    </footer>
  );
}
