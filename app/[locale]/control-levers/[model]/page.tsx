import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
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
  const { model } = await params;
  const p = getProduct(model);
  if (!p) return {};
  return {
    title: `${p.model} control lever`,
    description: p.tagline,
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
