"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { NumberCounter } from "@/components/ui/NumberCounter";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

const AmbientScene = dynamic(
  () => import("@/components/three/AmbientScene").then((m) => m.AmbientScene),
  { ssr: false, loading: () => null }
);

export function StatsStrip() {
  const t = useTranslations("home");
  const sectionRef = useRef<HTMLElement>(null);

  const items = [
    { label: t("stats.foundedLabel"), value: 1961, format: (n: number) => String(n) },
    { label: t("stats.employeesLabel"), value: 55, suffix: "+" },
    { label: t("stats.revenueLabel"), value: 116, suffix: "M", prefix: "NOK " },
    { label: t("stats.exportLabel"), value: 50, suffix: "%" },
    { label: t("stats.continentsLabel"), value: 4 },
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap } = useGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-stat]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
      <AmbientScene intensity="whisper" accent="#2BD4B4" />
      <div className="container-x relative">
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
            <div key={i} data-stat className="flex flex-col">
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
