import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { StatsStrip } from "@/components/sections/StatsStrip";
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
      <StatsStrip />
      <ClientsBand />
      <IndustriesGrid />
      <CaseStudyTeaser />
      <ContactCTA />
    </>
  );
}
