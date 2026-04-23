"use client";

import { useEffect, useRef } from "react";

type Drop = {
  x: number;
  y: number;
  vy: number;
  length: number;
  opacity: number;
  width: number;
  scrollKick: number;
  delayLife: number;
};

const DROP_COUNT = 60;

function make(): Drop {
  return {
    x: Math.random() * 100,
    y: -Math.random() * 400,
    vy: 0.6 + Math.random() * 1.8,
    length: 24 + Math.random() * 56,
    opacity: 0.18 + Math.random() * 0.4,
    width: Math.random() < 0.6 ? 1 : 1.5,
    scrollKick: 0.04 + Math.random() * 0.08,
    delayLife: 0,
  };
}

export function WaterDrops() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<Drop[]>([]);
  const scrollVelRef = useRef(0);
  const lastScrollRef = useRef(0);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    dropsRef.current = Array.from({ length: DROP_COUNT }, make);

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastScrollRef.current;
      lastScrollRef.current = y;
      scrollVelRef.current += delta;
      if (scrollVelRef.current > 240) scrollVelRef.current = 240;
      if (scrollVelRef.current < -240) scrollVelRef.current = -240;

      // Fade canvas in once user has scrolled past ~25% of viewport so the
      // hero stays clean.
      if (canvas) {
        const threshold = window.innerHeight * 0.25;
        const fade = Math.min(1, Math.max(0, (y - threshold) / (window.innerHeight * 0.3)));
        canvas.style.opacity = String(fade);
      }
    }
    lastScrollRef.current = window.scrollY;
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    function frame(now: number) {
      if (!canvas || !ctx) return;
      const dt = Math.min(48, now - lastFrameRef.current || 16) / 16;
      lastFrameRef.current = now;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      scrollVelRef.current *= 0.9;
      const scrollBoost = scrollVelRef.current;

      const drops = dropsRef.current;
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        if (d.delayLife > 0) {
          d.delayLife -= dt;
          continue;
        }
        const v = d.vy * dt + scrollBoost * d.scrollKick;
        d.y += v;

        if (d.y > h + 40) {
          d.y = -d.length - Math.random() * 120;
          d.x = Math.random() * 100;
          d.vy = 0.6 + Math.random() * 1.8;
          d.length = 24 + Math.random() * 56;
          d.opacity = 0.18 + Math.random() * 0.4;
          d.delayLife = Math.random() * 18;
          continue;
        }

        const px = (d.x / 100) * w;
        const grad = ctx.createLinearGradient(px, d.y - d.length, px, d.y);
        grad.addColorStop(0, "rgba(180, 205, 225, 0)");
        grad.addColorStop(0.6, `rgba(190, 215, 235, ${d.opacity * 0.55})`);
        grad.addColorStop(1, `rgba(220, 235, 245, ${d.opacity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = d.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(px, d.y - d.length);
        ctx.lineTo(px, d.y);
        ctx.stroke();

        ctx.fillStyle = `rgba(235, 245, 255, ${d.opacity * 0.9})`;
        ctx.beginPath();
        ctx.arc(px, d.y, d.width * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-[4] pointer-events-none"
      style={{
        mixBlendMode: "screen",
        opacity: 0,
        transition: "opacity 400ms linear",
      }}
    />
  );
}
