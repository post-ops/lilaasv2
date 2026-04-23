"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { Scramble } from "@/components/ui/Scramble";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

const CinematicHero = dynamic(
  () => import("@/components/three/CinematicHero").then((m) => m.CinematicHero),
  { ssr: false, loading: () => null }
);

export function Hero() {
  const t = useTranslations("home");
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
    const mq = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.2 });

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

      mq.add("(hover: hover) and (pointer: fine)", () => {
        const onMoveParallax = (e: MouseEvent) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to("[data-hero-copy]", {
            x: -x * 10,
            y: -y * 6,
            duration: 1,
            ease: "expo.out",
            overwrite: "auto",
          });
        };
        window.addEventListener("mousemove", onMoveParallax);
        return () => window.removeEventListener("mousemove", onMoveParallax);
      });
    }, sectionRef);

    return () => {
      el.removeEventListener("mousemove", onMove);
      mq.revert();
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
            "radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(255,107,53,0.20), transparent 60%)",
          transition: "background 200ms linear",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] z-[8]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(5,7,13,0.55) 40%, rgba(5,7,13,0.92) 80%, rgb(5,7,13) 100%)",
        }}
      />

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
            <span className="eyebrow">
              <Scramble text="LIVE · HORTEN NO" duration={700} />
            </span>
          </span>
          <span
            data-hero-eyebrow-item
            className="eyebrow text-mist/70 opacity-0"
          >
            <Scramble text="59°25′N · 10°29′E" duration={700} delay={120} />
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
            <Scramble text="SINCE 1961" duration={700} delay={240} />
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
        <span className="eyebrow text-[10px] animate-pulse-signal">scroll</span>
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
        {typeof children === "string" ? (
          <Scramble text={children} duration={600} delay={1600} />
        ) : (
          children
        )}
      </span>
    </span>
  );
}
