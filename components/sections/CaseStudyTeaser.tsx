"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight } from "lucide-react";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

export function CaseStudyTeaser() {
  const t = useTranslations("home");
  const tExtra = useTranslations("homeExtra.caseTeaser");
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = useGsap();

    const ctx = gsap.context(() => {
      gsap.to("[data-case-bg]", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Animate SVG circuit traces drawing in.
      const paths = svgRef.current?.querySelectorAll<SVGPathElement>("[data-circuit-path]");
      if (paths) {
        paths.forEach((p) => {
          const len = p.getTotalLength?.() ?? 0;
          p.style.strokeDasharray = String(len);
          p.style.strokeDashoffset = String(len);
        });
        gsap.to(paths, {
          strokeDashoffset: 0,
          ease: "expo.out",
          duration: 2.2,
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-44 border-y border-white/5 overflow-hidden"
    >
      <div data-case-bg className="absolute inset-0 -inset-y-20 will-change-transform">
        <Image
          src="/images/hero/industrial.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 30%, rgba(255,107,53,0.32), transparent 55%), radial-gradient(ellipse at 85% 75%, rgba(43,212,180,0.18), transparent 55%)",
          }}
        />
      </div>

      {/* SVG circuit lines drawing in on scroll */}
      <svg
        ref={svgRef}
        aria-hidden
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      >
        <defs>
          <linearGradient id="circuitGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <g stroke="url(#circuitGrad)" strokeWidth="1" fill="none">
          <path data-circuit-path d="M 0 120 L 200 120 L 230 150 L 500 150" />
          <path data-circuit-path d="M 1200 80 L 950 80 L 920 110 L 700 110" />
          <path data-circuit-path d="M 80 540 L 400 540 L 430 510 L 620 510 L 650 530 L 820 530" />
          <path data-circuit-path d="M 1200 480 L 1000 480 L 970 450 L 820 450" />
          <path data-circuit-path d="M 0 300 L 120 300 L 150 270 L 300 270" />
          <path data-circuit-path d="M 1200 330 L 1080 330 L 1050 360 L 900 360" />
        </g>
        <g fill="#FF6B35">
          <circle data-circuit-node cx="500" cy="150" r="3" opacity="0.8" />
          <circle data-circuit-node cx="700" cy="110" r="3" opacity="0.8" />
          <circle data-circuit-node cx="820" cy="530" r="3" opacity="0.8" />
          <circle data-circuit-node cx="820" cy="450" r="3" opacity="0.8" />
          <circle data-circuit-node cx="300" cy="270" r="3" opacity="0.8" />
          <circle data-circuit-node cx="900" cy="360" r="3" opacity="0.8" />
        </g>
      </svg>

      <div className="container-x relative">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-16 items-end">
          <div>
            <p className="section-index mb-6">{tExtra("indexLabel")}</p>
            <p className="eyebrow mb-4 text-mist/70">{t("caseEyebrow")}</p>
            <SplitReveal
              text={t("caseTitle")}
              as="h2"
              className="font-display text-display-lg text-fog text-balance"
              stagger={0.014}
            />
          </div>
          <div className="space-y-10">
            {[
              { label: "Client", value: "CERN · Large Hadron Collider" },
              { label: "Tolerance", value: "0.01 mm" },
              { label: "Location", value: "100 m under Geneva" },
            ].map((s, i) => (
              <Reveal key={s.label} variant="up" delay={i * 140}>
                <div>
                  <p className="eyebrow mb-3">{s.label}</p>
                  <p className="font-display text-2xl text-fog">{s.value}</p>
                </div>
              </Reveal>
            ))}
            <Reveal variant="up" delay={450}>
              <Link
                href="/case-studies/cern"
                className="group inline-flex items-center gap-3 text-signal hover:text-white transition-colors"
                data-magnetic
              >
                <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-signal/40">
                  <span className="absolute inset-0 rounded-full border border-signal scale-0 group-hover:scale-100 transition-transform duration-500" />
                  <ArrowUpRight
                    size={16}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-400"
                  />
                </span>
                <span className="font-mono text-sm uppercase tracking-widest">{t("caseCta")}</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
