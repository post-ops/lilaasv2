"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  const imageColRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const imgCol = imageColRef.current;
    const imgWrap = imageWrapRef.current;

    // Mouse parallax on the image column
    const onMove = (e: MouseEvent) => {
      if (!imgCol || !imgWrap) return;
      const rect = imgCol.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (e.clientX < rect.left || e.clientX > rect.right) return;
      imgWrap.style.setProperty("--rx", `${-y * 1.5}deg`);
      imgWrap.style.setProperty("--ry", `${x * 1.5}deg`);
      imgWrap.style.setProperty("--tx", `${x * 14}px`);
      imgWrap.style.setProperty("--ty", `${y * 10}px`);
    };
    window.addEventListener("mousemove", onMove);

    if (prefersReducedMotion()) {
      return () => window.removeEventListener("mousemove", onMove);
    }

    const { gsap, ScrollTrigger } = useGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        "[data-hero-img]",
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 1.8, ease: "expo.out" }
      )
        .fromTo(
          "[data-hero-rule]",
          { scaleY: 0 },
          { scaleY: 1, duration: 1.2, ease: "expo.out" },
          "-=1.4"
        )
        .fromTo(
          "[data-hero-eyebrow]",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
          "-=1.1"
        )
        .fromTo(
          "[data-hero-line]",
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.0,
            ease: "expo.out",
            stagger: 0.055,
          },
          "-=0.9"
        )
        .fromTo(
          "[data-hero-sub]",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" },
          "-=0.5"
        )
        .fromTo(
          "[data-hero-cta]",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.08 },
          "-=0.4"
        )
        .fromTo(
          "[data-hero-meta]",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.06 },
          "-=0.5"
        )
        .fromTo(
          "[data-hero-spec]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
          "-=0.4"
        )
        .fromTo(
          "[data-hero-scroll]",
          { opacity: 0 },
          { opacity: 1, duration: 0.9, ease: "expo.out" },
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
        yPercent: -16,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      gsap.to("[data-hero-img]", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-hero-root
      className="relative h-[100svh] min-h-[720px] overflow-hidden bg-ink isolate"
      aria-label="Lilaas introduction"
    >
      {/* Local opaque screen to clip the site-wide water-drops layer out of the hero. */}
      <div aria-hidden className="absolute inset-0 bg-ink z-0" />

      <div className="relative z-10 h-full grid lg:grid-cols-[1.08fr_1fr]">
        {/* LEFT — typography column */}
        <div className="relative h-full flex flex-col">
          <div
            data-hero-copy
            className="relative z-20 px-[clamp(1.25rem,5vw,4rem)] flex-1 flex flex-col justify-center pt-32 pb-[14vh] will-change-transform"
          >
            <div
              data-hero-eyebrow
              className="inline-flex items-center gap-3 mb-8 opacity-0"
            >
              <span className="signal-dot animate-pulse-signal" />
              <span className="eyebrow">{tExtra("live")} · {time}</span>
            </div>

            <h1 className="font-display font-medium text-[clamp(2.75rem,6.4vw,6.5rem)] text-fog leading-[0.94] text-balance tracking-tightest max-w-[18ch]">
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
              className="mt-8 max-w-[38ch] text-base lg:text-lg text-mist leading-relaxed text-pretty opacity-0"
            >
              {t("heroSub")}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
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

            <div className="mt-12 lg:mt-16 grid grid-cols-3 gap-6 max-w-lg">
              {[
                ["DNV GL", "Type approved"],
                ["ISO", "9001:2015"],
                ["NOK", "116M · 2024"],
              ].map(([top, bottom]) => (
                <div
                  key={top}
                  data-hero-meta
                  className="opacity-0 border-l border-white/10 pl-4 font-mono text-[10px] uppercase tracking-widest"
                >
                  <p className="text-mist/60">{top}</p>
                  <p className="text-fog mt-1">{bottom}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — marine image + 3D accent */}
        <div ref={imageColRef} className="relative h-full overflow-hidden">
          <div
            ref={imageWrapRef}
            data-hero-img
            className="absolute inset-0 will-change-transform"
            style={{
              transform:
                "translate3d(var(--tx,0), var(--ty,0), 0) rotateX(var(--rx,0)) rotateY(var(--ry,0))",
              transformStyle: "preserve-3d",
              transition:
                "transform 800ms cubic-bezier(0.22,1,0.36,1), opacity 1.8s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <Image
              src="/images/hero/helm.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center hero-kenburns"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgb(5,7,13) 0%, rgba(5,7,13,0.85) 15%, rgba(5,7,13,0.25) 45%, transparent 80%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[40%]"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(5,7,13,0.7) 60%, rgb(5,7,13) 100%)",
              }}
            />
          </div>

          {/* 3D accent — dot rings only, top-right corner */}
          <div className="absolute top-0 right-0 w-[72%] h-[68%] pointer-events-none z-[2]">
            <CinematicHero scrollProgress={scrollProgress} />
          </div>

          {/* Vertical accent rule between the two columns */}
          <div
            data-hero-rule
            aria-hidden
            className="absolute top-[16vh] bottom-[16vh] left-0 w-px bg-signal origin-top z-[3] hidden lg:block"
            style={{ transform: "scaleY(0)" }}
          />

          {/* Spec mini-card — bottom right of image column */}
          <div
            data-hero-spec
            className="absolute bottom-[clamp(20px,4vh,48px)] right-[clamp(20px,3vw,40px)] z-[4] opacity-0"
          >
            <div className="bg-deep/55 backdrop-blur-md border border-white/10 rounded-xl p-4 w-[220px]">
              <div className="flex items-center gap-2 mb-3">
                <span className="signal-dot animate-pulse-signal" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal">LIVE</span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-mist/70">
                Horten bridge net
              </p>
              <p className="font-display text-xl text-fog mt-1 tabular-nums">
                59°25′N · 10°29′E
              </p>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[10px] tabular-nums uppercase tracking-widest">
                <span className="text-mist/60">UTC</span>
                <span className="text-fog">{time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        data-hero-scroll
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[clamp(28px,4.5vh,56px)] z-30 flex flex-col items-center gap-2 text-mist/50 opacity-0"
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
