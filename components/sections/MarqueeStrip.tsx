"use client";

import { useEffect, useRef } from "react";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

const WORDS = [
  "PRECISION",
  "IN-HOUSE",
  "TYPE APPROVED",
  "HORTEN NO",
  "SINCE 1961",
  "TOLERANCE 0.01",
];

export function MarqueeStrip() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap } = useGsap();
    const ctx = gsap.context(() => {
      gsap.to("[data-marquee-row]", {
        xPercent: -50,
        ease: "none",
        duration: 48,
        repeat: -1,
      });
      gsap.to("[data-marquee-row-reverse]", {
        xPercent: 0,
        ease: "none",
        duration: 52,
        repeat: -1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const line = [...WORDS, ...WORDS, ...WORDS, ...WORDS];

  return (
    <section
      ref={sectionRef}
      aria-hidden
      className="relative py-10 lg:py-16 overflow-hidden border-y border-white/5 select-none"
    >
      <div
        data-marquee-row
        className="flex whitespace-nowrap will-change-transform"
        style={{ width: "max-content" }}
      >
        {line.map((w, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-8 font-display font-semibold text-[clamp(3.5rem,10vw,10rem)] leading-none tracking-tightest text-fog/[0.92] pr-10"
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
        data-marquee-row-reverse
        className="flex whitespace-nowrap mt-4 will-change-transform"
        style={{ width: "max-content", transform: "translateX(-50%)" }}
      >
        {line
          .slice()
          .reverse()
          .map((w, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 font-display text-[clamp(3.5rem,10vw,10rem)] leading-none tracking-tightest text-fog/[0.06] pr-10"
            >
              {w}
            </span>
          ))}
      </div>
    </section>
  );
}
