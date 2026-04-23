"use client";

import { useEffect, useRef, useState } from "react";
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
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap } = useGsap();
    const mq = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        "[data-hero-rule]",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: "expo.out" }
      )
        .fromTo(
          "[data-hero-eyebrow-item]",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, ease: "expo.out", duration: 0.8, stagger: 0.08 },
          "-=1.1"
        )
        .fromTo(
          "[data-hero-line]",
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "expo.out",
            duration: 1.1,
            stagger: 0.06,
          },
          "-=0.6"
        )
        .fromTo(
          "[data-hero-ghost]",
          { opacity: 0, letterSpacing: "0.12em" },
          { opacity: 1, letterSpacing: "-0.02em", ease: "expo.out", duration: 2.2 },
          "-=1.4"
        )
        .fromTo(
          "[data-hero-sub]",
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, ease: "expo.out", duration: 1 },
          "-=0.8"
        )
        .fromTo(
          "[data-hero-cta]",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, ease: "expo.out", duration: 0.9, stagger: 0.1 },
          "-=0.6"
        )
        .fromTo(
          "[data-hero-widget]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, ease: "expo.out", duration: 0.9, stagger: 0.1 },
          "-=0.6"
        )
        .fromTo(
          "[data-hero-ticker]",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, ease: "expo.out", duration: 1 },
          "-=0.6"
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

      gsap.to("[data-hero-ghost]", {
        xPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.to("[data-hero-mark]", {
        rotate: 80,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      mq.add("(hover: hover) and (pointer: fine)", () => {
        const onMove = (e: MouseEvent) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to("[data-hero-image]", {
            x: -x * 24,
            y: -y * 16,
            duration: 0.8,
            ease: "expo.out",
          });
          gsap.to("[data-hero-ghost]", {
            x: -x * 50,
            y: -y * 24,
            duration: 1.2,
            ease: "expo.out",
            overwrite: "auto",
          });
          gsap.to("[data-hero-mark]", {
            x: x * 30,
            y: y * 20,
            duration: 1.0,
            ease: "expo.out",
            overwrite: "auto",
          });
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      });
    }, sectionRef);

    return () => {
      mq.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[680px] overflow-hidden"
      aria-label="Lilaas introduction"
    >
      <div data-hero-image className="absolute inset-0 will-change-transform">
        <Image
          src="/images/lilaas/hero-main.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-transparent to-ink/40" />
      </div>

      <AmbientScene intensity="hero" accent="#FF6B35" />

      <div
        data-hero-mark
        aria-hidden
        className="pointer-events-none absolute -right-[18vw] -top-[14vw] w-[70vw] max-w-[1100px] aspect-square opacity-[0.06] will-change-transform"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#FF6B35" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#C9D1DE" strokeWidth="0.15" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#FF6B35" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="18" fill="none" stroke="#C9D1DE" strokeWidth="0.15" />
          <circle cx="50" cy="50" r="8" fill="#FF6B35" opacity="0.4" />
          {Array.from({ length: 48 }).map((_, i) => {
            const a = (i / 48) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * 40}
                y1={50 + Math.sin(a) * 40}
                x2={50 + Math.cos(a) * 48}
                y2={50 + Math.sin(a) * 48}
                stroke="#C9D1DE"
                strokeOpacity="0.5"
                strokeWidth="0.12"
              />
            );
          })}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={`m${i}`}
                x1={50 + Math.cos(a) * 32}
                y1={50 + Math.sin(a) * 32}
                x2={50 + Math.cos(a) * 38}
                y2={50 + Math.sin(a) * 38}
                stroke="#FF6B35"
                strokeOpacity="0.8"
                strokeWidth="0.2"
              />
            );
          })}
        </svg>
      </div>

      <p
        data-hero-ghost
        aria-hidden
        className="pointer-events-none absolute left-[-2vw] bottom-[10vh] lg:bottom-[6vh] font-display font-semibold text-fog/[0.055] leading-none text-[clamp(8rem,22vw,22rem)] tracking-tightest whitespace-nowrap will-change-transform"
      >
        LILAAS
      </p>

      <div aria-hidden className="hero-scan absolute inset-0 pointer-events-none z-10" />

      <div className="grain z-20 absolute inset-0 pointer-events-none" />

      <div
        data-hero-copy
        className="relative z-30 container-x flex flex-col justify-end h-full pb-[16vh] pt-32 will-change-transform"
      >
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <span
            data-hero-eyebrow-item
            className="inline-flex items-center gap-2 opacity-0"
          >
            <span className="signal-dot animate-pulse-signal" />
            <span className="eyebrow">LIVE · HORTEN NO</span>
          </span>
          <span
            data-hero-eyebrow-item
            className="eyebrow text-mist/70 opacity-0"
          >
            59°25′N · 10°29′E
          </span>
          <span
            data-hero-eyebrow-item
            className="eyebrow text-mist/70 opacity-0 font-mono tabular-nums"
          >
            {time} CET
          </span>
          <span
            data-hero-eyebrow-item
            className="eyebrow text-mist/70 opacity-0"
          >
            SINCE 1961
          </span>
        </div>

        <div
          data-hero-rule
          aria-hidden
          className="origin-left h-px w-28 bg-signal mb-10"
          style={{ transform: "scaleX(0)" }}
        />

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
      </div>

      <div className="pointer-events-none absolute right-[clamp(1.25rem,4vw,3rem)] top-[112px] z-30 hidden lg:flex flex-col items-end gap-3">
        <div data-hero-widget className="opacity-0 flex items-center gap-2">
          <span className="eyebrow text-mist/70">DNV GL</span>
          <span className="w-6 h-px bg-mist/40" />
          <span className="eyebrow text-fog">TYPE APPROVED</span>
        </div>
        <div data-hero-widget className="opacity-0 flex items-center gap-2">
          <span className="eyebrow text-mist/70">ISO</span>
          <span className="w-6 h-px bg-mist/40" />
          <span className="eyebrow text-fog">9001:2015</span>
        </div>
        <div data-hero-widget className="opacity-0 font-mono text-[10px] text-mist/60 tracking-widest uppercase">
          rev · 2025.04
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[clamp(92px,10vh,120px)] z-30 flex flex-col items-center gap-2 text-mist/70">
        <span className="eyebrow text-[10px]">scroll</span>
        <span className="w-px h-10 bg-gradient-to-b from-fog/40 to-transparent" />
      </div>

      <div
        data-hero-ticker
        className="absolute inset-x-0 bottom-0 z-30 border-t border-white/5 bg-ink/60 backdrop-blur-md h-14 overflow-hidden opacity-0"
      >
        <div className="flex items-center gap-16 whitespace-nowrap h-full animate-marquee will-change-transform">
          {TICKER.concat(TICKER).map((t, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-mist"
            >
              <span className="w-1 h-1 rounded-full bg-signal" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const TICKER = [
  "Kongsberg Maritime — bridges worldwide",
  "Wärtsilä — propulsion integrations",
  "CERN — Large Hadron Collider",
  "DNV GL type-approved",
  "ISO 9001:2015",
  "55+ engineers · Horten",
  "Tolerance 0.01 mm",
  "Lights-out CNC production",
  "4 continents · 50% direct export",
];

function formatTime(d: Date) {
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  const s = d.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
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
