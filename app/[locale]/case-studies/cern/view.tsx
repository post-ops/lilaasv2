"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

const CERN_HERO = "/images/hero/industrial.webp";

export function CernStory() {
  const t = useTranslations("cases.cern");
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap } = useGsap();
    const ctx = gsap.context(() => {
      gsap.to("[data-cern-bg]", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const sideStats = [
    { label: t("stats.tolerance"), value: t("stats.toleranceValue") },
    { label: t("stats.location"), value: t("stats.locationValue") },
    { label: t("stats.materials"), value: t("stats.materialsValue") },
    { label: t("stats.delivery"), value: t("stats.deliveryValue") },
  ];

  return (
    <>
      <section ref={heroRef} className="relative h-[85svh] min-h-[560px] overflow-hidden">
        <div data-cern-bg className="absolute inset-0 -inset-y-10 will-change-transform">
          <Image
            src={CERN_HERO}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/50 to-ink" />
        </div>
        <div className="relative z-10 container-x pt-32 lg:pt-44 pb-16">
          <Reveal variant="fade">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-mist hover:text-fog font-mono text-xs uppercase tracking-widest mb-10"
            >
              <ArrowLeft size={14} /> {t("back")}
            </Link>
          </Reveal>
          <Reveal variant="up">
            <div className="flex gap-2 mb-8">
              <Badge tone="chart">{t("badges.physics")}</Badge>
              <Badge>{t("badges.switzerland")}</Badge>
              <Badge tone="signal">{t("badges.precision")}</Badge>
            </div>
          </Reveal>
          <SplitReveal
            text={t("title")}
            as="h1"
            className="font-display text-display-xl text-fog max-w-5xl text-balance"
            stagger={0.01}
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container-x grid lg:grid-cols-[1fr_2fr] gap-14">
          <div className="lg:sticky lg:top-28 self-start space-y-10">
            {sideStats.map((s, i) => (
              <Reveal key={s.label} variant="left" delay={i * 120}>
                <div>
                  <p className="eyebrow mb-2">{s.label}</p>
                  <p className="font-display text-2xl text-fog">{s.value}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <article className="prose-lilaas max-w-2xl">
            <Reveal variant="up">
              <p className="text-xl text-fog leading-relaxed mb-8 text-balance">
                {t("lead")}
              </p>
            </Reveal>
            <Reveal variant="up" delay={100}>
              <p className="text-mist leading-relaxed mb-6">
                {t("p1")}
              </p>
            </Reveal>
            <Reveal variant="up" delay={180}>
              <p className="text-mist leading-relaxed mb-6">
                {t("p2")}
              </p>
            </Reveal>

            <Reveal variant="scale" delay={220}>
              <blockquote className="my-12 pl-6 border-l-2 border-signal">
                <p className="font-display text-2xl text-fog leading-tight text-balance">
                  &ldquo;{t("quote")}&rdquo;
                </p>
                <p className="eyebrow mt-4">{t("quoteAttrib")}</p>
              </blockquote>
            </Reveal>

            <Reveal variant="up">
              <h2 className="font-display text-2xl text-fog mt-14 mb-5">{t("whyHortenTitle")}</h2>
            </Reveal>
            <Reveal variant="up" delay={80}>
              <p className="text-mist leading-relaxed mb-6">{t("whyHorten")}</p>
            </Reveal>

            <Reveal variant="up">
              <h2 className="font-display text-2xl text-fog mt-14 mb-5">{t("beyondTitle")}</h2>
            </Reveal>
            <Reveal variant="up" delay={80}>
              <p className="text-mist leading-relaxed mb-10">{t("beyond")}</p>
            </Reveal>

            <Reveal variant="up" delay={200}>
              <div className="flex flex-wrap gap-3 mt-12 pt-10 border-t border-white/10">
                <Link href="/contact">
                  <Button variant="primary" arrow>{t("ctaPrimary")}</Button>
                </Link>
                <Link href="/precision-mechanics">
                  <Button variant="outline" arrow>{t("ctaSecondary")}</Button>
                </Link>
              </div>
            </Reveal>
          </article>
        </div>
      </section>
    </>
  );
}
