"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";

const ReactGlobe = dynamic(() => import("react-globe.gl"), { ssr: false });

export type GlobePoint = {
  name: string;
  region: string;
  lat: number;
  lng: number;
  home?: boolean;
};

export function Globe({
  points,
  onActiveChange,
}: {
  points: GlobePoint[];
  onActiveChange: (i: number | null) => void;
}) {
  const ref = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 440, h: 440 });
  const readyRef = useRef(false);
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Stable references so Scene props don't churn every parent render.
  const { home, partners, globePoints, arcs } = useMemo(() => {
    const h = points.find((p) => p.home);
    const rest = points.filter((p) => !p.home);
    return {
      home: h,
      partners: rest,
      globePoints: points.map((p) => ({
        lat: p.lat,
        lng: p.lng,
        name: p.name,
        region: p.region,
        home: !!p.home,
      })),
      arcs: h
        ? rest.map((p) => ({
            startLat: h.lat,
            startLng: h.lng,
            endLat: p.lat,
            endLng: p.lng,
          }))
        : [],
    };
  }, [points]);

  // Set up controls + initial tilt exactly once, when the globe signals ready.
  const handleReady = useCallback(() => {
    const g = ref.current;
    if (!g || readyRef.current) return;
    readyRef.current = true;

    const controls = g.controls() as any;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.6;

    g.pointOfView({ lat: 35, lng: 10, altitude: 2.2 }, 0);
  }, []);

  // Active-partner detection via RAF. Doesn't touch controls or POV, so it
  // can keep running without ever snapping the camera back.
  useEffect(() => {
    let raf = 0;
    let lastReported: number | null = null;
    function loop() {
      const g = ref.current;
      if (g && readyRef.current) {
        let bestIndex: number | null = null;
        let bestDistSq = Infinity;
        partners.forEach((p, i) => {
          const screen = (g as any).getScreenCoords?.(p.lat, p.lng, 0) ?? null;
          if (!screen) return;
          // behind the globe gets flagged by react-globe.gl with z missing
          const dx = screen.x - size.w / 2;
          const dy = screen.y - size.h / 2;
          const d = dx * dx + dy * dy;
          if (d < bestDistSq) {
            bestDistSq = d;
            bestIndex = i;
          }
        });
        if (bestIndex !== lastReported) {
          lastReported = bestIndex;
          onActiveChangeRef.current(bestIndex);
        }
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [partners, size.w, size.h]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <ReactGlobe
        ref={ref}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="/images/earth/earth-blue-marble.jpg"
        bumpImageUrl="/images/earth/earth-topology.png"
        showAtmosphere
        atmosphereColor="#FF6B35"
        atmosphereAltitude={0.16}
        onGlobeReady={handleReady}
        pointsData={globePoints}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d: any) => (d.home ? "#FFFFFF" : "#FF6B35")}
        pointAltitude={0.015}
        pointRadius={(d: any) => (d.home ? 0.55 : 0.45)}
        pointsMerge={false}
        pointLabel={(d: any) =>
          `<div style="font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#fff;background:rgba(5,7,13,0.88);border:1px solid rgba(255,107,53,0.4);padding:6px 10px;border-radius:4px;backdrop-filter:blur(8px);white-space:nowrap;">
            <div style="color:#FF6B35">${d.name}</div>
            <div style="color:rgba(201,209,222,0.8);font-size:10px;margin-top:4px">${d.region}</div>
          </div>`
        }
        arcsData={arcs}
        arcColor={() => "#FF6B35"}
        arcAltitude={(d: any) => {
          const lat1 = (d.startLat * Math.PI) / 180;
          const lat2 = (d.endLat * Math.PI) / 180;
          const dLng = ((d.endLng - d.startLng) * Math.PI) / 180;
          const cos =
            Math.sin(lat1) * Math.sin(lat2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLng);
          const angle = Math.acos(Math.max(-1, Math.min(1, cos)));
          return 0.04 + angle * 0.08;
        }}
        arcStroke={0.35}
        arcDashLength={0.4}
        arcDashGap={0.25}
        arcDashAnimateTime={2200}
        arcsTransitionDuration={0}
      />
    </div>
  );
}
