import type { Metadata } from "next";
import { archivo, newsreader, spaceMono } from "@/lib/fonts";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const title = "Growth Social — UGC Agency";
const description =
  "Growth Social is a UGC agency built around the people who make the content — and the results our clients actually care about.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "Growth Social",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${newsreader.variable} ${spaceMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-cream text-ink font-sans">
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
