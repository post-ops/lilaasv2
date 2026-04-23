"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { ArrowUpRight } from "lucide-react";

export function CaseStudyTeaser() {
  const t = useTranslations("home");

  return (
    <section className="relative py-32 lg:py-44 border-y border-white/5 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 20% 30%, rgba(255,107,53,0.4), transparent 55%), radial-gradient(ellipse at 85% 75%, rgba(43,212,180,0.25), transparent 55%)",
        }}
      />
      <div className="container-x relative">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-16 items-end">
          <div>
            <p className="eyebrow mb-6">{t("caseEyebrow")}</p>
            <SplitReveal
              text={t("caseTitle")}
              as="h2"
              className="font-display text-display-lg text-fog text-balance"
              stagger={0.014}
            />
          </div>
          <div className="space-y-10">
            <div>
              <p className="eyebrow mb-3">Client</p>
              <p className="font-display text-2xl text-fog">CERN · Large Hadron Collider</p>
            </div>
            <div>
              <p className="eyebrow mb-3">Tolerance</p>
              <p className="font-display text-2xl text-fog">0.01 mm</p>
            </div>
            <div>
              <p className="eyebrow mb-3">Location</p>
              <p className="font-display text-2xl text-fog">100 m under Geneva</p>
            </div>
            <Link
              href="/case-studies/cern"
              className="inline-flex items-center gap-2 group text-signal hover:text-white transition-colors"
              data-magnetic
            >
              <span className="font-mono text-sm uppercase tracking-widest">{t("caseCta")}</span>
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-400" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
