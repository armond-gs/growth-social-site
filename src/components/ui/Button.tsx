import Link from "next/link";
import type { ReactNode } from "react";

const VARIANTS = {
  green:
    "bg-green text-cream hover:bg-green-hover hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_rgba(20,56,40,0.7)]",
  cream:
    "bg-cream text-ink hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-14px_rgba(0,0,0,0.5)]",
} as const;

export function PillButton({
  href,
  children,
  variant = "green",
  className = "",
  fullWidth = false,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold text-base transition-all duration-300 ease-out ${
        fullWidth ? "w-full" : ""
      } ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
