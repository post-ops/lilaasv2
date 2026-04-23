"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { ArrowUpRight } from "lucide-react";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

export function CaseStudyTeaser() {
  const t = useTranslations("home");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap } = useGsap();

    const ctx = gsap.context(() => {
      gsap.to("[data-case-bg]", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-44 border-y border-white/5 overflow-hidden"
    >
      <div data-case-bg className="absolute inset-0 -inset-y-20 will-change-transform">
        <Image
          src="/images/hero/industrial.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 30%, rgba(255,107,53,0.32), transparent 55%), radial-gradient(ellipse at 85% 75%, rgba(43,212,180,0.18), transparent 55%)",
          }}
        />
      </div>

      <div className="container-x relative">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-16 items-end">
          <div>
            <p className="section-index mb-6">07 · Case study</p>
            <p className="eyebrow mb-4 text-mist/70">{t("caseEyebrow")}</p>
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
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-400"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
