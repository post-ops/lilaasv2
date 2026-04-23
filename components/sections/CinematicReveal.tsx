"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";
import { useReveal } from "@/components/ui/useReveal";

export function CinematicReveal() {
  const t = useTranslations("homeExtra.cinematic");
  const sectionRef = useReveal<HTMLElement>();
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Robust cover wipe using IntersectionObserver — runs once when section
    // enters the viewport. Falls back to "no cover" if JS fails (we don't
    // want a permanent black rectangle covering the image).
    const cover = coverRef.current;
    if (cover) {
      if (reduce) {
        cover.style.transform = "translateX(101%)";
      } else {
        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                cover.style.transition =
                  "transform 1.6s cubic-bezier(0.87, 0, 0.13, 1)";
                cover.style.transform = "translateX(101%)";
                io.disconnect();
              }
            }
          },
          { threshold: 0.15 }
        );
        io.observe(el);
      }
    }

    if (prefersReducedMotion()) return;

    const { gsap } = useGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-cinematic-image]",
        { scale: 1.15 },
        {
          scale: 1,
          ease: "expo.out",
          duration: 2,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        }
      );

      gsap.to("[data-cinematic-image]", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [sectionRef]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[110svh] min-h-[720px] overflow-hidden"
    >
      <div data-cinematic-image className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero/industrial.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink" />
      </div>

      <div
        ref={coverRef}
        aria-hidden
        className="absolute inset-0 bg-ink z-20 will-change-transform origin-left"
      />

      <div className="relative z-30 h-full container-x flex flex-col justify-end pb-20 lg:pb-28">
        <p data-reveal="out" className="section-index mb-6">
          {t("indexLabel")}
        </p>
        <h2
          data-reveal="out"
          className="font-display font-medium text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-tightest text-fog max-w-5xl text-balance"
        >
          {t("titlePart1")}{" "}
          <span className="text-signal">{t("titleAccent")}</span>
        </h2>
        <p
          data-reveal="out"
          className="mt-8 max-w-2xl text-mist text-lg leading-relaxed"
        >
          {t("body")}
        </p>
      </div>
    </section>
  );
}
