"use client";

import { useEffect, useRef, useState } from "react";
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

export function RadarDisplay() {
  const [activeBlip, setActiveBlip] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    // Mirror the sweep angle in JS so we can flash individual blips as the
    // arm crosses them. We don't use RAF on the blip itself — CSS does the
    // visual pulse — we just pick the currently-active blip.
    let raf = 0;
    const start = performance.now();
    function frame(t: number) {
      const elapsed = ((t - start) / 1000) % SWEEP_DURATION_S;
      const sweepAngle = (elapsed / SWEEP_DURATION_S) * 360; // 0..360
      // find blip whose angle is within 10° behind the sweep
      let best: number | null = null;
      for (let i = 0; i < BLIPS.length; i++) {
        const b = BLIPS[i];
        let delta = (sweepAngle - b.angle + 360) % 360;
        if (delta < 8) {
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
            <p className="section-index mb-5">04 · At sea, right now</p>
          </Reveal>
          <SplitReveal
            text="Bridges worldwide run on Lilaas levers."
            as="h2"
            className="font-display text-display-md text-fog text-balance"
            stagger={0.014}
          />
          <Reveal variant="up" delay={250}>
            <p className="text-mist mt-6 max-w-xl leading-relaxed">
              Every orange blip below is a vessel with our control hardware on
              the bridge — from supply runs in the North Sea to Asia-Pacific
              ferry operations.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          <Reveal variant="scale">
            <div className="relative aspect-square max-w-[640px] mx-auto">
              <Radar activeBlip={activeBlip} />
            </div>
          </Reveal>

          <div className="space-y-10">
            <Reveal variant="right">
              <div className="flex items-center gap-3">
                <span className="signal-dot animate-pulse-signal" />
                <p className="font-mono text-xs uppercase tracking-widest text-mist">
                  LIVE · LILAAS BRIDGE NETWORK · UTC {clock}
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-6 font-mono text-sm">
              {[
                ["Range", "250 NM"],
                ["Pulse", `${SWEEP_DURATION_S} s`],
                ["Vessels", String(BLIPS.length)],
                ["Bearing", "036°"],
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
                <p className="eyebrow mb-3 text-signal">Active contact</p>
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
                      sweeping…
                    </p>
                    <p className="font-mono text-xs text-mist/40 mt-1.5">
                      waiting for return
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

function Radar({ activeBlip }: { activeBlip: number | null }) {
  const size = 1000;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 12;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-full"
      aria-hidden
    >
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

      <circle cx={cx} cy={cy} r={r} fill="url(#radarBg)" />

      {/* concentric rings */}
      {[0.25, 0.5, 0.75, 1].map((s, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r * s}
          fill="none"
          stroke="#C9D1DE"
          strokeOpacity={0.12 + s * 0.06}
          strokeWidth={1}
        />
      ))}

      {/* crosshairs */}
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="#C9D1DE" strokeOpacity={0.14} />
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#C9D1DE" strokeOpacity={0.14} />

      {/* radial ticks every 30° */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const r1 = r * 0.96;
        const r2 = r;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r1}
            y1={cy + Math.sin(a) * r1}
            x2={cx + Math.cos(a) * r2}
            y2={cy + Math.sin(a) * r2}
            stroke="#C9D1DE"
            strokeOpacity={0.4}
            strokeWidth={1.5}
          />
        );
      })}

      {/* cardinal letters */}
      {[
        { label: "N", x: cx, y: cy - r - -22, anchor: "middle" as const },
        { label: "E", x: cx + r + 22, y: cy + 4, anchor: "middle" as const },
        { label: "S", x: cx, y: cy + r + 28, anchor: "middle" as const },
        { label: "W", x: cx - r - 22, y: cy + 4, anchor: "middle" as const },
      ].map((c) => (
        <text
          key={c.label}
          x={c.x}
          y={c.y}
          textAnchor={c.anchor}
          fill="#8A96A8"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize={20}
          letterSpacing="0.18em"
        >
          {c.label}
        </text>
      ))}

      {/* sweep arm */}
      <g
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          animation: `radarSpin ${SWEEP_DURATION_S}s linear infinite`,
        }}
      >
        <path
          d={`M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${cx + r * Math.cos(-Math.PI / 3)} ${cy + r * Math.sin(-Math.PI / 3)} Z`}
          fill="url(#sweepGrad)"
          opacity={0.9}
        />
        <line
          x1={cx}
          y1={cy}
          x2={cx + r}
          y2={cy}
          stroke="#FFD0B5"
          strokeOpacity={0.9}
          strokeWidth={1.5}
        />
      </g>

      {/* blips */}
      {BLIPS.map((b, i) => {
        const a = ((b.angle - 90) * Math.PI) / 180;
        const bx = cx + Math.cos(a) * r * b.radius;
        const by = cy + Math.sin(a) * r * b.radius;
        const active = activeBlip === i;
        return (
          <g key={i}>
            <circle
              cx={bx}
              cy={by}
              r={active ? 18 : 6}
              fill="#FF6B35"
              opacity={active ? 0.22 : 0}
              style={{ transition: "all 220ms cubic-bezier(0.22,1,0.36,1)" }}
              filter="url(#soft)"
            />
            <circle
              cx={bx}
              cy={by}
              r={active ? 4.5 : 3}
              fill="#FF6B35"
              opacity={active ? 1 : 0.35}
              style={{ transition: "all 220ms cubic-bezier(0.22,1,0.36,1)" }}
            />
          </g>
        );
      })}

      {/* center dot */}
      <circle cx={cx} cy={cy} r={6} fill="#FF6B35" />
      <circle cx={cx} cy={cy} r={14} fill="none" stroke="#FF6B35" strokeOpacity={0.5} strokeWidth={1} />

      <style>{`
        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
}
