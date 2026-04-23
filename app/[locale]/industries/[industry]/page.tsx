import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { IndustryView } from "./view";
import type { Metadata } from "next";

const INDUSTRIES = ["maritime", "defence", "medical", "space"] as const;
type Industry = (typeof INDUSTRIES)[number];

export function generateStaticParams() {
  return INDUSTRIES.flatMap((i) => [
    { locale: "en", industry: i },
    { locale: "no", industry: i },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; industry: string }>;
}): Promise<Metadata> {
  const { locale, industry } = await params;
  if (!INDUSTRIES.includes(industry as Industry)) return {};
  const t = await getTranslations({ locale, namespace: "industries" });
  return { title: t(`${industry}.name`) };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; industry: string }>;
}) {
  const { locale, industry } = await params;
  setRequestLocale(locale);
  if (!INDUSTRIES.includes(industry as Industry)) notFound();
  return <IndustryView industry={industry as Industry} />;
}
