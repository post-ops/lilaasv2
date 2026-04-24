"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import type { GlobePoint } from "@/components/three/Globe";

const Globe = dynamic(
  () => import("@/components/three/Globe").then((m) => m.Globe),
  { ssr: false, loading: () => null }
);

// Real Lilaas distributors + the workshop in Horten, placed on the globe at
// approximate lat/lng coordinates. Workshop is flagged `home` so it shows up
// differently and isn't surfaced as a "contact".
const POINTS: GlobePoint[] = [
  { name: "Horten", region: "Lilaas workshop", lat: 59.42, lng: 10.48, home: true },
  { name: "IMTRA", region: "USA · Canada", lat: 41.67, lng: -71.27 },
  { name: "Elma BV", region: "Netherlands · Belgium", lat: 52.1, lng: 4.3 },
  { name: "Kinextec", region: "Spain", lat: 40.4, lng: -3.7 },
  { name: "Kiepe Electric", region: "Italy", lat: 45.5, lng: 9.2 },
  { name: "Amaltheia Marine", region: "Greece · Turkey · Egypt", lat: 37.98, lng: 23.73 },
  { name: "Tritek Power & Automation", region: "Middle East", lat: 25.2, lng: 55.27 },
  { name: "Shanghai EJH Group", region: "China · HK · Taiwan", lat: 31.23, lng: 121.47 },
  { name: "Goodwill Technical Services", region: "Asia-Pacific", lat: 22.3, lng: 114.17 },
  { name: "Z-Power Automation", region: "Singapore", lat: 1.35, lng: 103.82 },
];

const ROTATION_DURATION_S = 18; // approx full revolution time for labelling

export function RadarDisplay() {
  const t = useTranslations("homeExtra.radar");
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const clock =
    now.getUTCHours().toString().padStart(2, "0") +
    ":" +
    now.getUTCMinutes().toString().padStart(2, "0") +
    ":" +
    now.getUTCSeconds().toString().padStart(2, "0");

  const partners = POINTS.filter((p) => !p.home);
  const displayed = active !== null ? POINTS[active] : null;

  return (
    <section ref={sectionRef} className="relative py-28 lg:py-40 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255,107,53,0.08), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(43,212,180,0.04), transparent 50%)",
        }}
      />

      <div className="container-x relative">
        <div className="max-w-3xl mb-14">
          <Reveal variant="fade">
            <p className="section-index mb-5">{t("indexLabel")}</p>
          </Reveal>
          <SplitReveal
            text={t("title")}
            as="h2"
            className="font-display text-display-md text-fog text-balance"
            stagger={0.014}
          />
          <Reveal variant="up" delay={250}>
            <p className="text-mist mt-6 max-w-xl leading-relaxed">{t("body")}</p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          <Reveal variant="scale">
            <div className="relative aspect-square max-w-[640px] mx-auto">
              <div
                aria-hidden
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255,107,53,0.06) 0%, transparent 55%)",
                }}
              />
              <Globe points={POINTS} onActiveChange={setActive} />
            </div>
          </Reveal>

          <div className="space-y-10">
            <Reveal variant="right">
              <div className="flex items-center gap-3">
                <span className="signal-dot animate-pulse-signal" />
                <p className="font-mono text-xs uppercase tracking-widest text-mist">
                  {t("live")} {clock}
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-6 font-mono text-sm">
              {[
                [t("reach"), "4"],
                [t("pulse"), `${ROTATION_DURATION_S} s`],
                [t("partners"), String(partners.length)],
                [t("since"), "1961"],
              ].map(([k, v], i) => (
                <Reveal key={k} variant="right" delay={80 + i * 80}>
                  <div className="border-l border-signal/40 pl-4">
                    <p className="text-mist/70 uppercase tracking-widest text-[10px] mb-1">
                      {k}
                    </p>
                    <p className="text-fog font-display text-2xl tracking-tight">{v}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal variant="right" delay={320}>
              <div className="border border-white/8 rounded-2xl p-5 bg-deep/40 backdrop-blur-sm">
                <p className="eyebrow mb-3 text-signal">{t("inRange")}</p>
                {displayed && !displayed.home ? (
                  <>
                    <p className="font-display text-xl text-fog tracking-tight">
                      {displayed.name}
                    </p>
                    <p className="font-mono text-xs text-mist mt-1.5">
                      {displayed.region}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-xl text-fog/50 tracking-tight">
                      {t("sweeping")}
                    </p>
                    <p className="font-mono text-xs text-mist/40 mt-1.5">{t("waiting")}</p>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
