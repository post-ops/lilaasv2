"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { NumberCounter } from "@/components/ui/NumberCounter";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { useReveal } from "@/components/ui/useReveal";

const AmbientScene = dynamic(
  () => import("@/components/three/AmbientScene").then((m) => m.AmbientScene),
  { ssr: false, loading: () => null }
);

const rawYearFmt = (n: number) => String(n);

export function StatsStrip() {
  const t = useTranslations("home");
  const tExtra = useTranslations("homeExtra.stats");
  const sectionRef = useReveal<HTMLElement>();

  const items = [
    { label: t("stats.foundedLabel"), value: 1961, format: rawYearFmt },
    { label: t("stats.employeesLabel"), value: 55, suffix: "+" },
    { label: t("stats.revenueLabel"), value: 116, suffix: "M", prefix: "NOK " },
    { label: t("stats.exportLabel"), value: 50, suffix: "%" },
    { label: t("stats.continentsLabel"), value: 4 },
  ];

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
      <AmbientScene intensity="whisper" accent="#2BD4B4" />
      <div className="container-x relative">
        <div className="max-w-3xl mb-20">
          <p className="section-index mb-4">{tExtra("indexLabel")}</p>
          <p className="eyebrow mb-4 text-mist/70">{t("statsSub")}</p>
          <SplitReveal
            text={t("statsTitle")}
            as="h2"
            className="font-display text-display-lg text-fog text-balance"
            stagger={0.018}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10 border-t border-white/8 pt-10">
          {items.map((item, i) => (
            <div key={i} data-reveal="out" className="flex flex-col">
              <p className="eyebrow mb-5">{item.label}</p>
              <div className="font-display text-[clamp(2.25rem,4vw,3.75rem)] font-medium tracking-tightest text-fog">
                <NumberCounter
                  value={item.value}
                  prefix={item.prefix}
                  suffix={item.suffix}
                  format={item.format}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
