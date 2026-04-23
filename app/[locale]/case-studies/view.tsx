"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { ArrowUpRight } from "lucide-react";

const CASES = [
  {
    slug: "cern",
    eyebrow: "Physics · Switzerland",
    title: "The Large Hadron Collider needed accuracy down to hundredths of a millimetre.",
    tone: "signal" as const,
  },
  {
    slug: "kongsberg-wartsila",
    eyebrow: "Maritime · Worldwide",
    title: "Bridges on Kongsberg and Wärtsilä vessels run on Lilaas levers.",
    tone: "chart" as const,
  },
];

export function CaseIndex() {
  const t = useTranslations("cases");
  return (
    <>
      <section className="pt-40 lg:pt-52 pb-20">
        <div className="container-x">
          <p className="eyebrow mb-6">{t("eyebrow")}</p>
          <SplitReveal
            text={t("title")}
            as="h1"
            className="font-display text-display-xl text-fog text-balance max-w-4xl"
            stagger={0.012}
          />
          <p className="text-lg text-mist leading-relaxed max-w-2xl mt-10">{t("sub")}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x grid md:grid-cols-2 gap-5">
          {CASES.map((c) => (
            <Link key={c.slug} href={c.slug === "cern" ? "/case-studies/cern" : "/contact"} className="block group">
              <Card className="p-10 min-h-[320px] flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <Badge tone={c.tone}>{c.eyebrow}</Badge>
                  <ArrowUpRight size={18} className="text-mist group-hover:text-signal group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500" />
                </div>
                <h3 className="font-display text-display-sm text-fog text-balance mt-12">{c.title}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
