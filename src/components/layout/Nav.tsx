"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data/landing";
import { useMode } from "@/lib/landing/mode";
import { BookCallButton } from "@/components/booking/BookingReveal";

/** Mono chip with a slowly pulsing dot — "Now booking" / "Applications open". */
function StatusChip({ label }: { label: string }) {
  return (
    <span
      className="hidden items-center gap-2 rounded-full border border-[var(--rule)] px-3 py-[7px] font-mono text-[10.5px] tracking-[0.14em] text-[var(--fg-muted)] uppercase lg:inline-flex"
      style={{ background: "var(--chip-bg)" }}
    >
      <span
        aria-hidden="true"
        className="gs-pulse-dot h-[6px] w-[6px] rounded-full bg-[var(--btn-bg)]"
        style={{ animation: "gs-pulse 2.4s ease-in-out infinite" }}
      />
      {label}
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { isBrand, copy } = useMode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ctaClass =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--btn-bg)] px-4 py-[9px] text-[13px] font-semibold whitespace-nowrap text-[var(--btn-fg)] no-underline transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_rgba(20,56,40,0.7)] md:px-5 md:py-[11px] md:text-[14.5px]";

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b px-[clamp(20px,5vw,48px)] py-4 backdrop-saturate-150 backdrop-blur-[10px] transition-colors duration-300"
      style={{
        background: scrolled ? "var(--nav-scrolled)" : "transparent",
        borderColor: scrolled ? "var(--rule)" : "transparent",
      }}
    >
      {/* Left: wordmark */}
      <Link href="#top" className="flex items-center gap-2.5 text-[var(--fg)] no-underline">
        <Image
          src={isBrand ? "/logo-green.png" : "/logo-cream.png"}
          alt="Growth Social"
          width={27}
          height={29}
          className="h-[27px] w-auto"
          priority
        />
        <span className="hidden text-[17px] font-bold tracking-[-0.02em] sm:inline">Growth Social</span>
      </Link>

      {/* Centre: section links in hover pills */}
      <div className="hidden justify-center gap-1 md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full px-3.5 py-2 text-[14.5px] font-medium text-[var(--fg-muted)] no-underline transition-all duration-200 hover:bg-[var(--nav-hover)] hover:font-bold hover:text-[var(--fg)]"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right: status + CTA */}
      <div className="flex items-center justify-end gap-3 md:gap-4">
        <StatusChip label={copy.statusLabel} />
        <Link
          href="/academy"
          className="hidden text-[14.5px] font-medium text-[var(--fg-subtle)] no-underline transition-colors duration-200 hover:text-[var(--fg)] md:inline"
        >
          Creator login
        </Link>
        <Link href="/academy" className="whitespace-nowrap text-[13px] font-medium text-[var(--fg-subtle)] no-underline md:hidden">
          Log in
        </Link>

        {/* Brand keeps the inline booking flow; creator goes to the application. */}
        {isBrand ? (
          <BookCallButton className={ctaClass}>{copy.navCta}</BookCallButton>
        ) : (
          <a href={copy.heroCtaHref} target="_blank" rel="noopener noreferrer" className={ctaClass}>
            {copy.navCta}
          </a>
        )}
      </div>
    </nav>
  );
}
