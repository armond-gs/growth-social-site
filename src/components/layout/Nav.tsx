"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data/landing";
import { PillButton } from "@/components/ui/Button";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[clamp(20px,5vw,48px)] py-4 backdrop-saturate-150 backdrop-blur-[10px] transition-colors duration-300 ${
        scrolled ? "bg-cream/82 border-b border-ink/10" : "border-b border-transparent"
      }`}
    >
      <Link href="#top" className="flex items-center gap-2.5 text-ink no-underline">
        <Image src="/logo-green.png" alt="Growth Social" width={27} height={29} className="h-[27px] w-auto" priority />
        <span className="text-[17px] font-bold tracking-[-0.02em]">Growth Social</span>
      </Link>

      {/* Desktop */}
      <div className="hidden items-center gap-6 md:flex">
        <div className="flex gap-[30px]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14.5px] font-medium text-ink/66 no-underline transition-colors duration-200 hover:text-green"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <span className="h-[18px] w-px bg-ink/16" />
        <Link
          href="/academy"
          className="text-[14.5px] font-medium text-ink/55 no-underline transition-colors duration-200 hover:text-green"
        >
          Creator login
        </Link>
        <PillButton href="#book" className="px-5 py-[11px] text-[14.5px]">
          Book a call
        </PillButton>
      </div>

      {/* Mobile */}
      <div className="flex items-center gap-3.5 md:hidden">
        <Link href="/academy" className="text-[13px] font-medium text-ink/60 no-underline">
          Log in
        </Link>
        <Link
          href="#book"
          className="rounded-full bg-green px-[15px] py-[9px] text-[13px] font-semibold text-cream no-underline"
        >
          Book a call
        </Link>
      </div>
    </nav>
  );
}
