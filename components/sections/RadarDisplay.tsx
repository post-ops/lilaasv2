"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";

type Blip = {
  angle: number; // degrees from 12 o'clock, clockwise
  radius: number; // 0..1 of radar radius
  label: string;
  coords: string;
};

const BLIPS: Blip[] = [
  { angle: 22, radius: 0.48, label: "MV OSLOFJORD", coords: "59°12′N 10°42′E" },
  { angle: 78, radius: 0.68, label: "NORTHERN LIGHT", coords: "58°58′N 11°08′E" },
  { angle: 134, radius: 0.34, label: "BERGEN EXPRESS", coords: "60°11′N 05°18′E" },
  { angle: 186, radius: 0.72, label: "TROMSØ STAR", coords: "69°38′N 18°57′E" },
  { angle: 242, radius: 0.52, label: "NORDIC DAWN", coords: "58°44′N 09°21′E" },
  { angle: 298, radius: 0.42, label: "HORTEN PILOT", coords: "59°25′N 10°29′E" },
  { angle: 340, radius: 0.6, label: "ESBJERG IV", coords: "55°28′N 08°27′E" },
];

const SWEEP_DURATION_S = 6;
const SIZE = 1000;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = SIZE / 2 - 12;

export function RadarDisplay() {
  const t = useTranslations("homeExtra.radar");
  const [activeBlip, setActiveBlip] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sweepRef = useRef<SVGGElement>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    // JS-driven rotation: one source of truth. Set the sweep arm's SVG
    // transform attribute each frame to rotate(angle, cx, cy) — works in
    // every browser, no CSS transform-origin / transform-box edge cases.
    let raf = 0;
    const start = performance.now();
    function frame(tNow: number) {
      const elapsed = ((tNow - start) / 1000) % SWEEP_DURATION_S;
      const sweepAngle = (elapsed / SWEEP_DURATION_S) * 360;

      if (sweepRef.current) {
        sweepRef.current.setAttribute(
          "transform",
          `rotate(${sweepAngle} ${CX} ${CY})`
        );
      }

      // Active blip: whichever the arm has just crossed
      let best: number | null = null;
      for (let i = 0; i < BLIPS.length; i++) {
        const b = BLIPS[i];
        const delta = (sweepAngle - b.angle + 360) % 360;
        if (delta < 10) {
          best = i;
          break;
        }
      }
      setActiveBlip((prev) => (prev === best ? prev : best));

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const clock =
    now.getUTCHours().toString().padStart(2, "0") +
    ":" +
    now.getUTCMinutes().toString().padStart(2, "0") +
    ":" +
    now.getUTCSeconds().toString().padStart(2, "0");

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
              <Radar sweepRef={sweepRef} activeBlip={activeBlip} />
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
                [t("range"), "250 NM"],
                [t("pulse"), `${SWEEP_DURATION_S} s`],
                [t("vessels"), String(BLIPS.length)],
                [t("bearing"), "036°"],
              ].map(([k, v], i) => (
                <Reveal key={k} variant="right" delay={80 + i * 80}>
                  <div className="border-l border-signal/40 pl-4">
                    <p className="text-mist/70 uppercase tracking-widest text-[10px] mb-1">
                      {k}
                    </p>
                    <p className="text-fog font-display text-2xl tracking-tight">
                      {v}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal variant="right" delay={320}>
              <div className="border border-white/8 rounded-2xl p-5 bg-deep/40 backdrop-blur-sm">
                <p className="eyebrow mb-3 text-signal">{t("activeContact")}</p>
                {activeBlip !== null ? (
                  <>
                    <p className="font-display text-xl text-fog tracking-tight">
                      {BLIPS[activeBlip].label}
                    </p>
                    <p className="font-mono text-xs text-mist mt-1.5 tabular-nums">
                      {BLIPS[activeBlip].coords}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-xl text-fog/50 tracking-tight">
                      {t("sweeping")}
                    </p>
                    <p className="font-mono text-xs text-mist/40 mt-1.5">
                      {t("waiting")}
                    </p>
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

function Radar({
  sweepRef,
  activeBlip,
}: {
  sweepRef: React.RefObject<SVGGElement | null>;
  activeBlip: number | null;
}) {
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full" aria-hidden>
      <defs>
        <radialGradient id="radarBg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#0F1B2E" stopOpacity="1" />
          <stop offset="75%" stopColor="#0A0E1A" stopOpacity="1" />
          <stop offset="100%" stopColor="#05070D" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="sweepGrad" x1="50%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0" />
          <stop offset="60%" stopColor="#FF6B35" stopOpacity="0.1" />
          <stop offset="92%" stopColor="#FF6B35" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFD0B5" stopOpacity="0.9" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      <circle cx={CX} cy={CY} r={R} fill="url(#radarBg)" />

      {[0.25, 0.5, 0.75, 1].map((s, i) => (
        <circle
          key={i}
          cx={CX}
          cy={CY}
          r={R * s}
          fill="none"
          stroke="#C9D1DE"
          strokeOpacity={0.12 + s * 0.06}
          strokeWidth={1}
        />
      ))}

      <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} stroke="#C9D1DE" strokeOpacity={0.14} />
      <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} stroke="#C9D1DE" strokeOpacity={0.14} />

      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const r1 = R * 0.96;
        const r2 = R;
        return (
          <line
            key={i}
            x1={CX + Math.cos(a) * r1}
            y1={CY + Math.sin(a) * r1}
            x2={CX + Math.cos(a) * r2}
            y2={CY + Math.sin(a) * r2}
            stroke="#C9D1DE"
            strokeOpacity={0.4}
            strokeWidth={1.5}
          />
        );
      })}

      {[
        { label: "N", x: CX, y: CY - R + 22, anchor: "middle" as const },
        { label: "E", x: CX + R - 22, y: CY + 6, anchor: "middle" as const },
        { label: "S", x: CX, y: CY + R - 10, anchor: "middle" as const },
        { label: "W", x: CX - R + 22, y: CY + 6, anchor: "middle" as const },
      ].map((c) => (
        <text
          key={c.label}
          x={c.x}
          y={c.y}
          textAnchor={c.anchor}
          fill="#8A96A8"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize={18}
          letterSpacing="0.18em"
        >
          {c.label}
        </text>
      ))}

      {/* sweep arm — rotation driven by JS via setAttribute on this group */}
      <g ref={sweepRef} transform={`rotate(0 ${CX} ${CY})`}>
        <path
          d={`M ${CX} ${CY} L ${CX + R} ${CY} A ${R} ${R} 0 0 0 ${CX + R * Math.cos(-Math.PI / 3)} ${CY + R * Math.sin(-Math.PI / 3)} Z`}
          fill="url(#sweepGrad)"
          opacity={0.9}
        />
        <line
          x1={CX}
          y1={CY}
          x2={CX + R}
          y2={CY}
          stroke="#FFD0B5"
          strokeOpacity={0.9}
          strokeWidth={1.5}
        />
      </g>

      {BLIPS.map((b, i) => {
        const a = ((b.angle - 90) * Math.PI) / 180;
        const bx = CX + Math.cos(a) * R * b.radius;
        const by = CY + Math.sin(a) * R * b.radius;
        const active = activeBlip === i;
        return (
          <g key={i}>
            <circle
              cx={bx}
              cy={by}
              r={active ? 18 : 6}
              fill="#FF6B35"
              opacity={active ? 0.22 : 0}
              style={{ transition: "all 260ms cubic-bezier(0.22,1,0.36,1)" }}
              filter="url(#soft)"
            />
            <circle
              cx={bx}
              cy={by}
              r={active ? 4.5 : 3}
              fill="#FF6B35"
              opacity={active ? 1 : 0.4}
              style={{ transition: "all 260ms cubic-bezier(0.22,1,0.36,1)" }}
            />
          </g>
        );
      })}

      <circle cx={CX} cy={CY} r={6} fill="#FF6B35" />
      <circle cx={CX} cy={CY} r={14} fill="none" stroke="#FF6B35" strokeOpacity={0.5} strokeWidth={1} />
    </svg>
  );
}
