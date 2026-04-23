"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

export function ContactCTA() {
  const t = useTranslations("home");
  const tExtra = useTranslations("homeExtra.cta");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap } = useGsap();
    const ctx = gsap.context(() => {
      gsap.to("[data-cta-glow]", {
        scale: 1.25,
        opacity: 0.9,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-40 lg:py-52 overflow-hidden">
      <div
        data-cta-glow
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-4xl aspect-square rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,53,0.16), transparent 60%)",
          willChange: "transform, opacity",
        }}
      />
      <div className="container-x text-center relative">
        <p className="section-index mb-6 justify-center inline-flex">
          {tExtra("indexLabel")}
        </p>
        <p className="eyebrow mb-8 text-mist/70">{t("ctaEyebrow")}</p>
        <div className="max-w-4xl mx-auto">
          <SplitReveal
            text={t("ctaTitle")}
            as="h2"
            className="font-display text-display-lg text-fog text-balance"
            stagger={0.012}
          />
        </div>
        <p className="mt-10 text-mist max-w-xl mx-auto font-mono text-sm uppercase tracking-widest">
          {t("ctaSub")}
        </p>
        <div className="mt-12 flex justify-center">
          <Link href="/contact">
            <Button variant="primary" size="lg" arrow>
              {t("ctaButton")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
