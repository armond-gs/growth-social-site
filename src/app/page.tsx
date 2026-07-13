import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { BrandsSection } from "@/components/landing/BrandsSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { StatementBand } from "@/components/landing/StatementBand";
import { ApproachSection } from "@/components/landing/ApproachSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FinalCta } from "@/components/landing/FinalCta";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(135%_95%_at_50%_-12%,#f6f6ee_0%,#f1f1e7_44%,#eaeadd_100%)]">
      <Nav />
      <Hero />
      <BrandsSection />
      <StatsSection />
      <ServicesSection />
      <StatementBand />
      <ApproachSection />
      <TestimonialsSection />
      <FinalCta />
      <Footer />
    </div>
  );
}
