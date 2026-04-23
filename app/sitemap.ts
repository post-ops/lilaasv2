import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const BASE = "https://lilaas-concept.vercel.app";
const LOCALES = ["en", "no"] as const;
const INDUSTRIES = ["maritime", "defence", "medical", "space"] as const;

const STATIC_ROUTES = [
  "",
  "/control-levers",
  "/precision-mechanics",
  "/case-studies",
  "/case-studies/cern",
  "/about",
  "/support",
  "/contact",
  "/news",
  "/careers",
  "/legal/terms",
  "/legal/privacy",
  "/legal/transparency",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    const prefix = locale === "en" ? "" : `/${locale}`;
    for (const r of STATIC_ROUTES) {
      entries.push({
        url: `${BASE}${prefix}${r}`,
        lastModified: new Date(),
        changeFrequency: r === "" ? "weekly" : "monthly",
        priority: r === "" ? 1 : 0.7,
      });
    }
    for (const i of INDUSTRIES) {
      entries.push({
        url: `${BASE}${prefix}/industries/${i}`,
        lastModified: new Date(),
        priority: 0.6,
      });
    }
    for (const p of PRODUCTS) {
      entries.push({
        url: `${BASE}${prefix}/control-levers/${p.slug}`,
        lastModified: new Date(),
        priority: 0.8,
      });
    }
  }
  return entries;
}
