import type { Metadata } from "next";

type SEOInput = {
  title: string;
  description?: string;
  path?: string;
};

const DEFAULT_DESCRIPTION =
  "Experts on joysticks, control levers and precision mechanics. Norwegian engineering, in-house since 1961.";

export function buildMetadata({ title, description, path = "/" }: SEOInput): Metadata {
  const fullTitle = `${title} · Lilaas`;
  return {
    title: fullTitle,
    description: description ?? DEFAULT_DESCRIPTION,
    openGraph: {
      title: fullTitle,
      description: description ?? DEFAULT_DESCRIPTION,
      url: path,
      siteName: "Lilaas",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description ?? DEFAULT_DESCRIPTION,
    },
  };
}
