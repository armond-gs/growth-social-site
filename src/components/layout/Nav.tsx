"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data/landing";
import { useMode } from "@/lib/landing/mode";
import { BookCallButton } from "@/components/booking/BookingReveal";

/**
 * Mono chip with a slowly pulsing dot. No border and no divider — it reads as
 * a status line sitting next to the CTA, not as another control.
 */
function StatusChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.09em] whitespace-nowrap text-[var(--fg-subtle)] uppercase">
      <span
        aria-hidden="true"
        className="gs-pulse-dot h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--btn-bg)]"
        style={{ animation: "gs-pulse 2.4s ease-in-out infinite" }}
      />
      {label}
    </span>
  );
}

/**
 * Section link as a hover pill. The label is rendered twice — an invisible
 * bold copy sets the width, the visible copy sits on top — so going to
 * weight 700 on hover doesn't nudge the row of links sideways.
 */
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="grid rounded-full px-[15px] py-2 text-[14.5px] font-medium text-[var(--fg-muted)] no-underline transition-all duration-250 hover:bg-[var(--nav-hover)] hover:font-bold hover:text-[var(--fg)]"
    >
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 font-bold">
        {label}
      </span>
      <span className="col-start-1 row-start-1 text-center">{label}</span>
    </Link>
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
    // Fixed at every width. The handoff specified a static bar on mobile,
    // but scrolling away takes the CTA and the audience toggle's context with
    // it — the nav is the only persistent way back to booking.
    <nav
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b px-[clamp(20px,5vw,48px)] py-4 backdrop-saturate-150 backdrop-blur-[10px] transition-colors duration-300"
      style={{
        // Only the background responds to scroll — the hairline is always
        // there, so the bar reads as a bar even at the top of the page.
        background: scrolled ? "var(--nav-scrolled)" : "transparent",
        borderColor: "var(--rule)",
      }}
    >
      {/* Left: logo + wordmark (wordmark shows on mobile too) */}
      <Link href="#top" className="flex items-center gap-2.5 text-[var(--fg)] no-underline">
        <Image
          src={isBrand ? "/logo-green.png" : "/logo-cream.png"}
          alt="Growth Social"
          width={27}
          height={29}
          className="h-[24px] w-auto md:h-[27px]"
          priority
        />
        <span className="text-[15px] font-bold whitespace-nowrap tracking-[-0.02em] md:text-[17px]">
          Growth Social
        </span>
      </Link>

      {/* Centre: absolutely centred on the page, not within the leftover space
          between the two clusters — otherwise it drifts as either side grows. */}
      <div className="absolute left-1/2 hidden -translate-x-1/2 gap-1.5 md:flex">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} />
        ))}
      </div>

      {/* Right: status + CTA */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Chip yields below md: its label length varies by mode and would
            otherwise wrap the wordmark. The toggle directly beneath the bar
            already communicates which mode is active. */}
        <span className="hidden md:inline">
          <StatusChip label={copy.statusLabel} />
        </span>
        {copy.navCtaOpensBooking ? (
          <BookCallButton className={ctaClass}>{copy.navCta}</BookCallButton>
        ) : (
          <Link href={copy.navCtaHref} className={ctaClass}>
            {copy.navCta}
          </Link>
        )}
      </div>
    </nav>
  );
}
