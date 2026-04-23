"use client";

import { useTranslations } from "next-intl";
import { NumberCounter } from "@/components/ui/NumberCounter";
import { SplitReveal } from "@/components/ui/SplitReveal";

export function StatsStrip() {
  const t = useTranslations("home");

  const items = [
    { label: t("stats.foundedLabel"), value: 1961, format: (n: number) => String(n) },
    { label: t("stats.employeesLabel"), value: 55, suffix: "+" },
    { label: t("stats.revenueLabel"), value: 116, suffix: "M", prefix: "NOK " },
    { label: t("stats.exportLabel"), value: 50, suffix: "%" },
    { label: t("stats.continentsLabel"), value: 4 },
  ];

  return (
    <section className="relative py-32 lg:py-40">
      <div className="container-x">
        <div className="max-w-3xl mb-20">
          <p className="eyebrow mb-4">
            <span className="signal-dot mr-3 align-middle" />
            {t("statsSub")}
          </p>
          <SplitReveal
            text={t("statsTitle")}
            as="h2"
            className="font-display text-display-lg text-fog text-balance"
            stagger={0.018}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10 border-t border-white/8 pt-10">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col">
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
