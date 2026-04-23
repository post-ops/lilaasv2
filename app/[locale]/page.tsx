import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { StatementBanner } from "@/components/sections/StatementBanner";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { MarqueeStrip } from "@/components/sections/MarqueeStrip";
import { ProcessSticky } from "@/components/sections/ProcessSticky";
import { CinematicReveal } from "@/components/sections/CinematicReveal";
import { ProductRail } from "@/components/sections/ProductRail";
import { ClientsBand } from "@/components/sections/ClientsBand";
import { IndustriesGrid } from "@/components/sections/IndustriesGrid";
import { CaseStudyTeaser } from "@/components/sections/CaseStudyTeaser";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <StatementBanner />
      <StatsStrip />
      <MarqueeStrip />
      <ProcessSticky />
      <CinematicReveal />
      <ProductRail />
      <IndustriesGrid />
      <CaseStudyTeaser />
      <ClientsBand />
      <ContactCTA />
    </>
  );
}
