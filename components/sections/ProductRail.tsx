"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { PRODUCTS } from "@/lib/products";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight } from "lucide-react";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

export function ProductRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !track) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const { gsap, ScrollTrigger } = useGsap();

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - window.innerWidth + 96;
      if (distance <= 0) return;

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress) {
              progress.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // Stagger fade-in for cards as they come into horizontal view
      const cards = gsap.utils.toArray<HTMLElement>("[data-product-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0.4, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "expo.out",
            delay: i * 0.05,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="container-x">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-index mb-5">06 · The lineup</p>
            <h2 className="font-display text-display-md text-fog max-w-2xl text-balance">
              One family, from workboat to flagship.
            </h2>
          </div>
          <p className="eyebrow hidden md:block">
            {PRODUCTS.length} models · DNV GL approved · drag →
          </p>
        </div>
      </div>

      <div className="container-x mb-10">
        <div className="flex items-center gap-4">
          <span className="eyebrow text-mist/70">01</span>
          <div className="relative flex-1 h-px bg-white/10 overflow-hidden">
            <div
              ref={progressRef}
              className="absolute inset-y-0 left-0 h-full w-full origin-left bg-signal"
              style={{ transform: "scaleX(0)", willChange: "transform" }}
            />
          </div>
          <span className="eyebrow text-mist/70">
            {String(PRODUCTS.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-5 px-[clamp(1.25rem,4vw,3rem)] will-change-transform"
        style={{ width: "max-content" }}
      >
        {PRODUCTS.map((p, i) => (
          <Link
            key={p.slug}
            href={`/control-levers/${p.slug}`}
            data-product-card
            className="group relative block flex-shrink-0 w-[min(86vw,420px)] aspect-[3/4] rounded-2xl overflow-hidden border border-white/8 bg-deep/60"
          >
            <Image
              src={p.image}
              alt={`${p.model} control lever`}
              fill
              sizes="(max-width: 768px) 86vw, 420px"
              className="object-contain object-center p-10 transition-transform duration-700 ease-out-expo group-hover:scale-110 group-hover:rotate-[-3deg]"
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(ellipse at 50% 30%, ${p.accent}26, transparent 60%)`,
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: `linear-gradient(135deg, transparent 30%, ${p.accent}18 50%, transparent 70%)`,
                backgroundSize: "200% 200%",
                animation: "shimmer 2.4s linear infinite",
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="flex items-start justify-between">
                <Badge
                  tone={p.family === "L" ? "signal" : p.family === "LE" ? "chart" : "copper"}
                >
                  Series {p.family}
                </Badge>
                <span className="font-mono text-[10px] uppercase tracking-widest text-mist/60">
                  {String(i + 1).padStart(2, "0")} / {String(PRODUCTS.length).padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-display text-5xl text-fog tracking-tight mb-2">{p.model}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-mist">
                    {p.highlight}
                  </p>
                </div>
                <ArrowUpRight
                  size={24}
                  className="text-mist group-hover:text-signal group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
