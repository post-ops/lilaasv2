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

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
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
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="container-x">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow mb-4">The lineup</p>
            <h2 className="font-display text-display-md text-fog max-w-2xl text-balance">
              One family, from workboat to flagship.
            </h2>
          </div>
          <p className="eyebrow hidden md:block">
            {PRODUCTS.length} models · DNV GL approved
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-5 px-[clamp(1.25rem,4vw,3rem)] will-change-transform"
        style={{ width: "max-content" }}
      >
        {PRODUCTS.map((p) => (
          <Link
            key={p.slug}
            href={`/control-levers/${p.slug}`}
            className="group relative block flex-shrink-0 w-[min(86vw,420px)] aspect-[3/4] rounded-2xl overflow-hidden border border-white/8 bg-deep/60"
          >
            <Image
              src={p.image}
              alt={`${p.model} control lever`}
              fill
              sizes="(max-width: 768px) 86vw, 420px"
              className="object-contain object-center p-10 transition-transform duration-700 ease-out-expo group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(ellipse at 50% 30%, ${p.accent}22, transparent 60%)`,
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="flex items-start justify-between">
                <Badge
                  tone={p.family === "L" ? "signal" : p.family === "LE" ? "chart" : "copper"}
                >
                  Series {p.family}
                </Badge>
                <ArrowUpRight
                  size={18}
                  className="text-mist group-hover:text-signal group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500"
                />
              </div>
              <div>
                <p className="font-display text-5xl text-fog tracking-tight mb-2">{p.model}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-mist">
                  {p.highlight}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
