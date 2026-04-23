"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const HeroScene = dynamic(() => import("@/components/three/HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => null,
});

export function Hero() {
  const t = useTranslations("home");
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneWrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const copyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = useGsap();

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "+=180%",
      pin: sceneWrapRef.current,
      scrub: 0.6,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    const copyCtx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-line]",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "expo.out",
          duration: 1.1,
          stagger: 0.08,
          delay: 0.2,
        }
      );
      gsap.fromTo(
        "[data-hero-sub]",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, ease: "expo.out", duration: 1, delay: 0.65 }
      );
      gsap.fromTo(
        "[data-hero-cta]",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, ease: "expo.out", duration: 0.9, delay: 0.9, stagger: 0.1 }
      );
      gsap.fromTo(
        "[data-hero-eyebrow]",
        { opacity: 0, letterSpacing: "0.05em" },
        { opacity: 1, letterSpacing: "0.2em", ease: "expo.out", duration: 1.2, delay: 0 }
      );
    }, sectionRef);

    return () => {
      trigger.kill();
      copyCtx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ minHeight: "180vh" }}
      aria-label="Lilaas introduction"
    >
      <div
        ref={sceneWrapRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink z-10 pointer-events-none" />

        <div className="absolute inset-0 z-0">
          <HeroScene scrollProgress={progressRef} />
        </div>

        <div className="grain z-20" />

        <div className="relative z-30 container-x flex flex-col justify-end h-full pb-[14vh] pt-36">
          <div className="flex items-center gap-3 mb-8" data-hero-eyebrow>
            <span className="signal-dot animate-pulse-signal" />
            <p className="eyebrow">{t("eyebrow")}</p>
          </div>

          <div ref={copyRef} className="max-w-5xl">
            <h1 className="font-display font-medium text-display-xl text-fog leading-[0.92] text-balance">
              <HeroLine>{t("heroH1a")}</HeroLine>{" "}
              <HeroAccent>{t("heroH1b")}</HeroAccent>
              <HeroLine>{t("heroH1c")}</HeroLine>{" "}
              <HeroAccent delay={0.12}>{t("heroH1d")}</HeroAccent>{" "}
              <HeroLine>{t("heroH1e")}</HeroLine>{" "}
              <HeroAccent delay={0.24}>{t("heroH1f")}</HeroAccent>
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

function HeroAccent({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="inline-block relative overflow-hidden align-baseline pr-[0.08em]">
      <span
        className="inline-block will-change-transform text-signal"
        data-hero-line
        style={{ transform: "translateY(110%)", opacity: 0, animationDelay: `${delay}s` }}
      >
        {children}
      </span>
    </span>
  );
}
