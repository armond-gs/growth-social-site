import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Academy — Growth Social",
  description: "Login and course library for Growth Social creators.",
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
