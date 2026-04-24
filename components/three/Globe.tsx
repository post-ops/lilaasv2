"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";

// react-globe.gl can't render server-side (uses WebGL + window).
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

  const home = points.find((p) => p.home);
  const partners = points.filter((p) => !p.home);

  // Arcs from Horten to every partner
  const arcs = useMemo(
    () =>
      home
        ? partners.map((p) => ({
            startLat: home.lat,
            startLng: home.lng,
            endLat: p.lat,
            endLng: p.lng,
          }))
        : [],
    [home, partners]
  );

  const globePoints = useMemo(
    () =>
      points.map((p) => ({
        lat: p.lat,
        lng: p.lng,
        name: p.name,
        region: p.region,
        home: !!p.home,
      })),
    [points]
  );

  // Auto-rotate, pick the partner closest to the camera as "active"
  useEffect(() => {
    const g = ref.current;
    if (!g) return;
    const controls = g.controls() as any;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.6;
    // Keep auto-spin running even while the user drags.
    controls.addEventListener?.("start", () => {});
    // All Lilaas partners sit between ~1° and ~60° N. Tilt the camera down
    // to ~35° latitude so the cluster sits in the middle of the globe as it
    // spins, instead of hugging the top edge.
    g.pointOfView({ lat: 35, lng: 10, altitude: 2.2 }, 0);

    let raf = 0;
    let lastReported: number | null = null;
    function loop() {
      if (g) {
        const camPos = (g as any).camera().position as {
          x: number;
          y: number;
          z: number;
        };
        // Find partner whose latitude/longitude projects closest to the
        // camera-facing direction. We use the globe's own coords2ScreenCoords
        // helper to get on-screen positions and pick the centre-most one.
        let bestIndex: number | null = null;
        let bestDistSq = Infinity;
        partners.forEach((p, i) => {
          const screen = (g as any).getCoords(p.lat, p.lng, 0) as {
            x: number;
            y: number;
            z: number;
          };
          // approximate camera-forward dot: a point "in front" of the globe
          // has a positive z component in camera-space; we cheat with world z.
          const camZ = camPos.z;
          if (screen.z * Math.sign(camZ) < 0) return;
          const dx = screen.x;
          const dy = screen.y;
          const d = dx * dx + dy * dy;
          if (d < bestDistSq) {
            bestDistSq = d;
            bestIndex = i;
          }
        });
        if (bestIndex !== lastReported) {
          lastReported = bestIndex;
          onActiveChange(bestIndex);
        }
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [partners, onActiveChange]);

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
          const cos = Math.sin(lat1) * Math.sin(lat2) +
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
