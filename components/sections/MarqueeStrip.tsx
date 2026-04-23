"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

export function MarqueeStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations("homeExtra.marquee");

  const words = [
    t("w1"),
    t("w2"),
    t("w3"),
    t("w4"),
    t("w5"),
    t("w6"),
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap } = useGsap();
    const ctx = gsap.context(() => {
      gsap.to("[data-marquee-row-a]", {
        xPercent: -50,
        ease: "none",
        duration: 42,
        repeat: -1,
      });
      gsap.to("[data-marquee-row-b]", {
        xPercent: 0,
        ease: "none",
        duration: 58,
        repeat: -1,
      });
      gsap.to("[data-marquee-row-c]", {
        xPercent: -50,
        ease: "none",
        duration: 34,
        repeat: -1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const lineA = [...words, ...words, ...words, ...words];
  const lineB = [...words, ...words, ...words, ...words].reverse();
  const lineC = [...words, ...words, ...words, ...words];

  return (
    <section
      ref={sectionRef}
      aria-hidden
      className="relative py-6 lg:py-10 overflow-hidden border-y border-white/5 select-none bg-deep/20"
    >
      <div
        data-marquee-row-a
        className="flex whitespace-nowrap will-change-transform"
        style={{ width: "max-content" }}
      >
        {lineA.map((w, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 font-display font-semibold text-[clamp(1.5rem,4vw,3.5rem)] leading-none tracking-tightest text-fog pr-6"
          >
            {w}
            <span
              className="inline-block align-middle w-[0.55em] h-[0.12em] rounded-full"
              style={{ background: i % 2 === 0 ? "#FF6B35" : "#2BD4B4" }}
            />
          </span>
        ))}
      </div>

      <div
        data-marquee-row-b
        className="flex whitespace-nowrap mt-2 will-change-transform"
        style={{ width: "max-content", transform: "translateX(-50%)" }}
      >
        {lineB.map((w, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 font-display italic text-[clamp(1.125rem,3vw,2.5rem)] leading-none tracking-tightest text-fog/[0.06] pr-6"
          >
            {w}
          </span>
        ))}
      </div>

      <div
        data-marquee-row-c
        className="flex whitespace-nowrap mt-2 will-change-transform"
        style={{ width: "max-content" }}
      >
        {lineC.map((w, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 font-mono uppercase text-[clamp(0.9rem,1.4vw,1.2rem)] tracking-[0.3em] text-signal/70 pr-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal" />
            {w}
          </span>
        ))}
      </div>
    </section>
  );
}
