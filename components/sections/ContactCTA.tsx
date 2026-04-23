"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";

export function ContactCTA() {
  const t = useTranslations("home");
  const tExtra = useTranslations("homeExtra.cta");
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative py-40 lg:py-56 overflow-hidden">
      {/* Animated gradient mesh background — two counter-drifting radials */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,107,53,0.05), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[20%] -left-[10%] w-[80vw] h-[80vh] rounded-full blur-3xl opacity-70 cta-mesh-a"
        style={{ background: "radial-gradient(circle, rgba(255,107,53,0.2), transparent 60%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vh] rounded-full blur-3xl opacity-60 cta-mesh-b"
        style={{ background: "radial-gradient(circle, rgba(43,212,180,0.12), transparent 60%)" }}
      />

      {/* Top hair-line transition */}
      <Reveal variant="fade">
        <div className="container-x mb-20">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-signal/50 to-transparent" />
        </div>
      </Reveal>

      <div className="container-x text-center relative">
        <Reveal variant="fade">
          <p className="section-index mb-8 justify-center inline-flex">{tExtra("indexLabel")}</p>
        </Reveal>
        <Reveal variant="fade">
          <p className="eyebrow mb-10 text-mist/70">{t("ctaEyebrow")}</p>
        </Reveal>

        <div className="max-w-[18ch] sm:max-w-[22ch] lg:max-w-[26ch] mx-auto">
          <SplitReveal
            text={t("ctaTitle")}
            as="h2"
            className="font-display font-medium text-[clamp(2.75rem,9vw,9rem)] leading-[0.9] tracking-tightest text-fog text-balance"
            stagger={0.014}
          />
        </div>

        <Reveal variant="up" delay={200}>
          <p className="mt-10 text-mist max-w-xl mx-auto font-mono text-sm uppercase tracking-widest">
            {t("ctaSub")}
          </p>
        </Reveal>

        <Reveal variant="scale" delay={320}>
          <div className="mt-14 flex justify-center">
            <div className="relative inline-flex">
              <span aria-hidden className="absolute inset-0 rounded-full border border-signal/60 pulse-ring-bare" />
              <Link href="/contact" className="relative">
                <Button variant="primary" size="lg" arrow>
                  {t("ctaButton")}
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 md:gap-8 font-mono text-xs uppercase tracking-widest text-mist/70">
          <Reveal variant="right" delay={420}>
            <a href="mailto:sales@lilaas.no" className="link-underline hover:text-fog transition-colors">sales@lilaas.no</a>
          </Reveal>
          <Reveal variant="up" delay={480}>
            <span aria-hidden className="text-mist/30">·</span>
          </Reveal>
          <Reveal variant="up" delay={520}>
            <a href="tel:+4741633000" className="link-underline hover:text-fog transition-colors">+47 416 33 000</a>
          </Reveal>
          <Reveal variant="left" delay={580}>
            <span aria-hidden className="text-mist/30">·</span>
          </Reveal>
          <Reveal variant="left" delay={640}>
            <span>Kongeveien 75, Horten</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
