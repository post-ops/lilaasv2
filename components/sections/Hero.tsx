"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

export function Hero() {
  const t = useTranslations("home");
  const tExtra = useTranslations("homeExtra.hero");
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = useGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.25 });

      tl.fromTo(
        "[data-hero-eyebrow]",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, ease: "expo.out", duration: 0.7 }
      )
        .fromTo(
          "[data-hero-brand]",
          { opacity: 0, y: 18, letterSpacing: "0.08em" },
          { opacity: 1, y: 0, letterSpacing: "-0.04em", ease: "expo.out", duration: 1.1 },
          "-=0.4"
        )
        .fromTo(
          "[data-hero-line]",
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "expo.out",
            duration: 1.0,
            stagger: 0.055,
          },
          "-=0.6"
        )
        .fromTo(
          "[data-hero-sub]",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, ease: "expo.out", duration: 0.9 },
          "-=0.5"
        )
        .fromTo(
          "[data-hero-cta]",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, ease: "expo.out", duration: 0.8, stagger: 0.08 },
          "-=0.4"
        )
        .fromTo(
          "[data-hero-scroll]",
          { opacity: 0 },
          { opacity: 1, ease: "expo.out", duration: 1 },
          "-=0.2"
        );

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: 0.4,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      gsap.to("[data-hero-copy]", {
        yPercent: -24,
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
      className="relative h-[100svh] min-h-[720px] overflow-hidden bg-ink"
      aria-label="Lilaas introduction"
    >
      {/* Background marine image — vessel at sea matches Lilaas' market */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/bridge.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(5,7,13,0.55) 0%, rgba(5,7,13,0.82) 55%, rgb(5,7,13) 100%)",
          }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] z-[8]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(5,7,13,0.5) 35%, rgba(5,7,13,0.92) 80%, rgb(5,7,13) 100%)",
        }}
      />

      <div
        data-hero-copy
        className="relative z-30 container-x flex flex-col items-center text-center justify-center h-full pb-[10vh] pt-28 will-change-transform"
      >
        <div
          data-hero-eyebrow
          className="inline-flex items-center gap-3 mb-8 opacity-0"
        >
          <span className="signal-dot animate-pulse-signal" />
          <span className="eyebrow">{tExtra("live")} · {time}</span>
        </div>

        <div data-hero-brand className="flex flex-col items-center mb-10 opacity-0">
          <p className="font-display font-semibold text-fog text-[clamp(3.5rem,9vw,8rem)] leading-none tracking-tightest">
            <span aria-label="Lilaas">
              L
              <span className="relative inline-block" aria-hidden>
                {"ı"}
                <span
                  className="absolute left-1/2 -translate-x-1/2 rounded-full bg-signal"
                  style={{
                    width: "0.2em",
                    height: "0.2em",
                    top: "-0.08em",
                    boxShadow: "0 0 0.35em rgba(255,107,53,0.7)",
                  }}
                />
              </span>
              laas
            </span>
          </p>
          <p className="eyebrow mt-4 text-mist/80">{tExtra("tagline")}</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <h1 className="font-display font-medium text-[clamp(1.75rem,3.4vw,3rem)] text-fog leading-[1.05] text-balance">
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
            className="mt-8 max-w-xl mx-auto text-base lg:text-lg text-mist leading-relaxed text-pretty opacity-0"
          >
            {t("heroSub")}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/control-levers" data-hero-cta className="opacity-0 inline-block">
              <Button variant="primary" size="lg" arrow>
                {t("ctaExplore")}
              </Button>
            </Link>
            <Link href="/contact" data-hero-cta className="opacity-0 inline-block">
              <Button variant="ghost" size="lg" arrow>
                {t("ctaContact")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div
        data-hero-scroll
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[clamp(32px,5vh,64px)] z-30 flex flex-col items-center gap-2 text-mist/50 opacity-0"
      >
        <span className="eyebrow text-[10px]">scroll</span>
        <span className="w-px h-10 bg-gradient-to-b from-fog/30 to-transparent" />
      </div>
    </section>
  );
}

function formatTime(d: Date) {
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
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
