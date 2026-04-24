import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PRODUCTS, getProduct } from "@/lib/products";
import { ProductDetail } from "./view";
import type { Metadata } from "next";

export function generateStaticParams() {
  return PRODUCTS.flatMap((p) => [
    { locale: "en", model: p.slug },
    { locale: "no", model: p.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; model: string }>;
}): Promise<Metadata> {
  const { locale, model } = await params;
  const p = getProduct(model);
  if (!p) return {};
  const t = await getTranslations({ locale, namespace: "products" });
  return {
    title: `${p.model}`,
    description: t(`${p.slug}.tagline`),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; model: string }>;
}) {
  const { locale, model } = await params;
  setRequestLocale(locale);
  const product = getProduct(model);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
