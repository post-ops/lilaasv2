"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

const AmbientScene = dynamic(
  () => import("@/components/three/AmbientScene").then((m) => m.AmbientScene),
  { ssr: false, loading: () => null }
);

export function Hero() {
  const t = useTranslations("home");
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = useGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-line]",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "expo.out",
          duration: 1.1,
          stagger: 0.06,
          delay: 0.15,
        }
      );
      gsap.fromTo(
        "[data-hero-sub]",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, ease: "expo.out", duration: 1, delay: 0.55 }
      );
      gsap.fromTo(
        "[data-hero-cta]",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, ease: "expo.out", duration: 0.9, delay: 0.8, stagger: 0.1 }
      );
      gsap.fromTo(
        "[data-hero-eyebrow]",
        { opacity: 0 },
        { opacity: 1, ease: "expo.out", duration: 1, delay: 0 }
      );

      gsap.to("[data-hero-image]", {
        scale: 1.08,
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });

      gsap.to("[data-hero-copy]", {
        yPercent: -30,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] overflow-hidden"
      aria-label="Lilaas introduction"
    >
      <div ref={imageRef} data-hero-image className="absolute inset-0 will-change-transform">
        <Image
          src="/images/lilaas/hero-main.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
      </div>

      <AmbientScene intensity="hero" accent="#FF6B35" />

      <div className="grain z-20" />

      <div data-hero-copy className="relative z-30 container-x flex flex-col justify-end h-full pb-[14vh] pt-36">
        <div className="flex items-center gap-3 mb-8" data-hero-eyebrow>
          <span className="signal-dot animate-pulse-signal" />
          <p className="eyebrow">{t("eyebrow")}</p>
        </div>

        <div className="max-w-5xl">
          <h1 className="font-display font-medium text-display-xl text-fog leading-[0.92] text-balance">
            <HeroLine>{t("heroH1a")}</HeroLine>{" "}
            <HeroAccent>{t("heroH1b")}</HeroAccent>
            <HeroLine>{t("heroH1c")}</HeroLine>{" "}
            <HeroAccent>{t("heroH1d")}</HeroAccent>{" "}
            <HeroLine>{t("heroH1e")}</HeroLine>{" "}
            <HeroAccent>{t("heroH1f")}</HeroAccent>
            <HeroLine>{t("heroH1g")}</HeroLine>
          </h1>

          <p
            data-hero-sub
            className="mt-10 max-w-2xl text-lg text-mist leading-relaxed text-pretty opacity-0"
          >
            {t("heroSub")}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/control-levers" data-hero-cta className="opacity-0 inline-block">
              <Button variant="primary" size="lg" arrow>
                {t("ctaExplore")}
              </Button>
            </Link>
            <Link href="/contact" data-hero-cta className="opacity-0 inline-block">
              <Button variant="outline" size="lg" arrow>
                {t("ctaContact")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center gap-2 text-mist/70">
          <span className="eyebrow text-[10px]">scroll</span>
          <span className="w-px h-10 bg-gradient-to-b from-fog/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function HeroLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block overflow-hidden align-baseline pr-[0.08em]">
      <span className="inline-block will-change-transform" data-hero-line style={{ transform: "translateY(110%)", opacity: 0 }}>
        {children}
      </span>
    </span>
  );
}

function HeroAccent({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block relative overflow-hidden align-baseline pr-[0.08em]">
      <span
        className="inline-block will-change-transform text-signal"
        data-hero-line
        style={{ transform: "translateY(110%)", opacity: 0 }}
      >
        {children}
      </span>
    </span>
  );
}
