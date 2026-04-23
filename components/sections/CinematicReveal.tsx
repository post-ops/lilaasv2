"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

export function CinematicReveal() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap } = useGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-cinematic-cover]",
        { xPercent: 0 },
        {
          xPercent: 101,
          ease: "expo.inOut",
          duration: 1.6,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        }
      );
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
      gsap.from("[data-cinematic-caption]", {
        y: 28,
        opacity: 0,
        ease: "expo.out",
        duration: 1,
        stagger: 0.1,
        delay: 0.8,
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });

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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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
        data-cinematic-cover
        aria-hidden
        className="absolute inset-0 bg-ink z-20 will-change-transform origin-left"
      />

      <div className="relative z-30 h-full container-x flex flex-col justify-end pb-20 lg:pb-28">
        <div className="flex items-center gap-3 mb-6" data-cinematic-caption>
          <span className="w-10 h-px bg-signal" />
          <span className="eyebrow">The shop floor · Horten</span>
        </div>
        <h2
          data-cinematic-caption
          className="font-display font-medium text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-tightest text-fog max-w-5xl text-balance"
        >
          Mechanics, electronics and software —{" "}
          <span className="text-signal">all in one building.</span>
        </h2>
        <p
          data-cinematic-caption
          className="mt-8 max-w-2xl text-mist text-lg leading-relaxed"
        >
          Fifteen CNC machines. Unmanned lights-out production. PCBs designed,
          firmware written and assembly lines calibrated inside the same walls
          as the drawing office. Short loops, complete traceability, zero
          hand-offs to third parties.
        </p>
      </div>
    </section>
  );
}
