import { setRequestLocale, getTranslations } from "next-intl/server";
import { PRODUCTS } from "@/lib/products";
import { ControlLeversView } from "./view";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("controlLevers") };
}

export default async function ControlLeversPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ControlLeversView products={PRODUCTS} />;
}
