"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;
    let hovering = false;

    function move(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function over(e: MouseEvent) {
      const t = e.target as HTMLElement;
      const mag = t.closest?.("[data-magnetic], a, button, [role=button]");
      hovering = Boolean(mag);
      if (ring) ring.dataset.hover = hovering ? "1" : "0";
    }

    let raf = 0;
    function loop() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      dotX += (mouseX - dotX) * 0.45;
      dotY += (mouseY - dotY) * 0.45;
      if (ring) ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0) scale(${hovering ? 1.6 : 1})`;
      if (dot) dot.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`;
      raf = requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 36,
          height: 36,
          borderRadius: "9999px",
          border: "1px solid rgba(255, 107, 53, 0.9)",
          pointerEvents: "none",
          zIndex: 90,
          transition: "transform 300ms cubic-bezier(0.22,1,0.36,1), border-color 200ms",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 6,
          height: 6,
          borderRadius: "9999px",
          background: "#FF6B35",
          pointerEvents: "none",
          zIndex: 91,
          boxShadow: "0 0 12px rgba(255,107,53,0.8)",
        }}
      />
    </>
  );
}
