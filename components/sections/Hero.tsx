"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

const CinematicHero = dynamic(
  () => import("@/components/three/CinematicHero").then((m) => m.CinematicHero),
  { ssr: false, loading: () => null }
);

export function Hero() {
  const t = useTranslations("home");
  const tExtra = useTranslations("homeExtra.hero");
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const spot = spotlightRef.current;
    const onMove = (e: MouseEvent) => {
      if (!spot) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      spot.style.setProperty("--mx", `${x}%`);
      spot.style.setProperty("--my", `${y}%`);
    };
    el.addEventListener("mousemove", onMove);

    if (prefersReducedMotion()) {
      return () => el.removeEventListener("mousemove", onMove);
    }

    const { gsap, ScrollTrigger } = useGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        "[data-hero-rule]",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "expo.out" }
      )
        .fromTo(
          "[data-hero-eyebrow]",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, ease: "expo.out", duration: 0.8 },
          "-=0.9"
        )
        .fromTo(
          "[data-hero-hud]",
          { opacity: 0 },
          { opacity: 1, ease: "expo.out", duration: 1.2, stagger: 0.08 },
          "-=0.8"
        )
        .fromTo(
          "[data-hero-ghost]",
          { opacity: 0, letterSpacing: "0.14em" },
          { opacity: 1, letterSpacing: "-0.02em", ease: "expo.out", duration: 2.2 },
          "-=1"
        )
        .fromTo(
          "[data-hero-line]",
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "expo.out",
            duration: 1.0,
            stagger: 0.06,
          },
          "-=1.6"
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
        xPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, sectionRef);

    return () => {
      el.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[720px] overflow-hidden bg-ink"
      aria-label="Lilaas introduction"
    >
      <div className="absolute inset-0">
        <CinematicHero scrollProgress={scrollProgress} />
      </div>

      <div
        ref={spotlightRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] mix-blend-screen"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(255,107,53,0.18), transparent 60%)",
          transition: "background 200ms linear",
        }}
      />

      {/* Ghost backdrop wordmark */}
      <p
        data-hero-ghost
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[52%] -translate-y-1/2 font-display font-semibold text-fog/[0.035] leading-none text-[clamp(10rem,30vw,30rem)] tracking-tightest whitespace-nowrap select-none will-change-transform z-[2]"
      >
        LILAAS
      </p>

      {/* HUD frame corners — cinematic viewer brackets */}
      <div aria-hidden className="pointer-events-none absolute inset-6 lg:inset-10 z-[15]">
        <HudCorner position="tl" />
        <HudCorner position="tr" />
        <HudCorner position="bl" />
        <HudCorner position="br" />
      </div>

      {/* Horizontal light sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-[6] overflow-hidden"
      >
        <div className="hero-light-sweep absolute inset-0" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] z-[8]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(5,7,13,0.55) 40%, rgba(5,7,13,0.92) 80%, rgb(5,7,13) 100%)",
        }}
      />

      <div className="grain z-20 absolute inset-0 pointer-events-none" />

      {/* Top-row HUD strip */}
      <div
        data-hero-hud
        aria-hidden
        className="pointer-events-none absolute left-10 right-10 top-[96px] z-30 hidden lg:flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-mist/60 opacity-0"
      >
        <span>LILAAS/REV · 2025.04</span>
        <span className="flex items-center gap-6">
          <span className="text-signal">● REC</span>
          <span>59°25′N · 10°29′E</span>
          <span>UTC {utc(time)}</span>
        </span>
      </div>

      <div
        data-hero-copy
        className="relative z-30 container-x flex flex-col justify-end h-full pb-[14vh] pt-32 will-change-transform"
      >
        <div
          data-hero-eyebrow
          className="inline-flex items-center gap-3 mb-6 opacity-0"
        >
          <span className="signal-dot animate-pulse-signal" />
          <span className="eyebrow">{tExtra("live")} · {time}</span>
        </div>

        <div
          data-hero-rule
          aria-hidden
          className="origin-left h-px w-28 bg-signal mb-8"
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
              <Button variant="ghost" size="lg" arrow>
                {t("ctaContact")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[clamp(40px,6vh,80px)] z-30 flex flex-col items-center gap-2 text-mist/60">
        <span className="eyebrow text-[10px] animate-pulse-signal">scroll</span>
        <span className="w-px h-10 bg-gradient-to-b from-fog/30 to-transparent" />
      </div>
    </section>
  );
}

function HudCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const cls = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 rotate-90",
    bl: "bottom-0 left-0 -rotate-90",
    br: "bottom-0 right-0 rotate-180",
  }[position];
  return (
    <svg
      viewBox="0 0 48 48"
      width="32"
      height="32"
      className={`absolute ${cls} text-fog/40`}
      aria-hidden
    >
      <path d="M 2 48 L 2 2 L 48 2" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function utc(time: string) {
  return time;
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
