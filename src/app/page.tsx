import { ModeProvider } from "@/lib/landing/mode";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { BrandsSection } from "@/components/landing/BrandsSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { StatementBand } from "@/components/landing/StatementBand";
import { ApproachSection } from "@/components/landing/ApproachSection";
import { FinalCta } from "@/components/landing/FinalCta";

export default function Home() {
  return (
    // ModeProvider renders the page wrapper: it owns the data-mode attribute
    // the whole palette keys off, and the wash that cross-fades on switch.
    <ModeProvider>
      <Nav />
      <Hero />
      <BrandsSection />
      {/* Stats ("The receipts") pulled from both modes. To restore: re-add
          <StatsSection /> here and the "Results" #results link to NAV_LINKS
          and FOOTER_LINKS. */}
      <ServicesSection />
      <StatementBand />
      <ApproachSection />
      {/* Testimonials stay out until there are real client quotes. To restore:
          re-add <TestimonialsSection /> here and the "Clients" #voices link to
          NAV_LINKS and FOOTER_LINKS. */}
      <FinalCta />
      <Footer />
    </ModeProvider>
  );
}
