import { setRequestLocale } from "next-intl/server";
import { CernStory } from "./view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CERN — Large Hadron Collider",
  description: "How Lilaas delivered components to tolerances measured in hundredths of a millimetre, for one of the most demanding research projects on earth.",
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CernStory />;
}
