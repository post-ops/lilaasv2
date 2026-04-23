"use client";

import { useEffect, useRef } from "react";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";
import { NumberCounter } from "@/components/ui/NumberCounter";

export function StatementBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap } = useGsap();
    const ctx = gsap.context(() => {
      gsap.from("[data-statement-line]", {
        yPercent: 100,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
      });
      gsap.from("[data-statement-meta]", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.3,
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
      });
      gsap.to("[data-statement-figure]", {
        yPercent: -20,
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
      className="relative min-h-[90svh] flex items-center py-32 overflow-hidden border-y border-white/5"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 85% 50%, rgba(255,107,53,0.10), transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(43,212,180,0.06), transparent 60%)",
        }}
      />

      <div
        data-statement-figure
        aria-hidden
        className="pointer-events-none absolute -right-[5vw] top-1/2 -translate-y-1/2 font-display font-semibold leading-none tracking-tightest text-fog/[0.045] text-[clamp(14rem,42vw,44rem)] will-change-transform select-none"
      >
        64
      </div>

      <div className="container-x relative w-full">
        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-end">
          <div className="max-w-5xl">
            <p data-statement-meta className="eyebrow mb-10 inline-flex items-center gap-3">
              <span className="w-10 h-px bg-signal" />
              Lilaas — since 1961
            </p>
            <h2 className="font-display font-medium text-[clamp(3rem,10vw,10rem)] leading-[0.88] tracking-tightest text-fog text-balance">
              <Line>Sixty-four</Line>
              <Line>years of</Line>
              <Line accent>precision.</Line>
            </h2>
          </div>

          <dl data-statement-meta className="grid grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-10 lg:text-right font-mono text-xs uppercase tracking-widest text-mist">
            <div>
              <dt className="text-mist/60 mb-2">Founded</dt>
              <dd className="font-display text-3xl text-fog tracking-tight normal-case tabular-nums">
                <NumberCounter value={1961} format={(n) => String(n)} />
              </dd>
            </div>
            <div>
              <dt className="text-mist/60 mb-2">Parts shipped</dt>
              <dd className="font-display text-3xl text-fog tracking-tight normal-case tabular-nums">
                <NumberCounter value={12} suffix="M+" />
              </dd>
            </div>
            <div>
              <dt className="text-mist/60 mb-2">Continents</dt>
              <dd className="font-display text-3xl text-fog tracking-tight normal-case tabular-nums">
                <NumberCounter value={4} />
              </dd>
            </div>
            <div>
              <dt className="text-mist/60 mb-2">Tolerance</dt>
              <dd className="font-display text-3xl text-fog tracking-tight normal-case">0.01 mm</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function Line({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span className="block overflow-hidden">
      <span
        data-statement-line
        className={
          "block will-change-transform " + (accent ? "text-signal" : "")
        }
      >
        {children}
      </span>
    </span>
  );
}
