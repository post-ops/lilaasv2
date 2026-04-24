export type Product = {
  slug: string;
  model: string;
  family: "L" | "LF" | "LE";
  accent: string;
  image: string;
  detailImage?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "l01",
    model: "L01",
    family: "L",
    accent: "#FF6B35",
    image: "/images/lilaas/l01.webp",
    detailImage: "/images/lilaas/l01-detail.webp",
  },
  {
    slug: "lf180",
    model: "LF180",
    family: "LF",
    accent: "#FF6B35",
    image: "/images/lilaas/lf180.webp",
  },
  {
    slug: "lf120",
    model: "LF120",
    family: "LF",
    accent: "#C97E4F",
    image: "/images/lilaas/lf120.webp",
    detailImage: "/images/lilaas/lf120-detail.webp",
  },
  {
    slug: "lf90",
    model: "LF90",
    family: "LF",
    accent: "#C97E4F",
    image: "/images/lilaas/lf90.webp",
    detailImage: "/images/lilaas/lf90-detail.webp",
  },
  {
    slug: "le90",
    model: "LE90",
    family: "LE",
    accent: "#2BD4B4",
    image: "/images/lilaas/le90.webp",
    detailImage: "/images/lilaas/le90-detail.webp",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
