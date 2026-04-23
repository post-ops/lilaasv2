"use client";

import { useEffect, useState } from "react";

export function IntroLoader() {
  const [mounted, setMounted] = useState(false);
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    try {
      if (sessionStorage.getItem("lilaas-intro-seen") === "1") {
        setHide(true);
        setGone(true);
        return;
      }
    } catch {}

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHide(true);
      setTimeout(() => setGone(true), 50);
      try {
        sessionStorage.setItem("lilaas-intro-seen", "1");
      } catch {}
      return;
    }

    const t1 = setTimeout(() => setHide(true), 1600);
    const t2 = setTimeout(() => {
      setGone(true);
      try {
        sessionStorage.setItem("lilaas-intro-seen", "1");
      } catch {}
    }, 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] bg-ink flex items-center justify-center overflow-hidden"
      style={{
        opacity: !mounted ? 1 : hide ? 0 : 1,
        pointerEvents: hide ? "none" : "auto",
        transition: "opacity 900ms cubic-bezier(0.87, 0, 0.13, 1)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.14), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        <div
          className="flex items-center gap-2 overflow-hidden"
          style={{ transform: hide ? "translateY(-12px)" : "translateY(0)", transition: "transform 900ms cubic-bezier(0.87,0,0.13,1)" }}
        >
          {"LILAAS".split("").map((c, i) => (
            <span
              key={i}
              className="font-display font-semibold text-fog text-[clamp(3rem,9vw,8rem)] leading-none tracking-tightest inline-block will-change-transform"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(100%)",
                transition: `opacity 800ms cubic-bezier(0.22,1,0.36,1) ${i * 60}ms, transform 800ms cubic-bezier(0.22,1,0.36,1) ${i * 60}ms`,
              }}
            >
              {c}
            </span>
          ))}
        </div>

        <div
          className="relative h-px w-48 overflow-hidden bg-white/8"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 600ms 300ms" }}
        >
          <div
            className="absolute inset-y-0 left-0 bg-signal"
            style={{
              width: "100%",
              transform: mounted ? "translateX(0)" : "translateX(-101%)",
              transition: "transform 1200ms cubic-bezier(0.22,1,0.36,1) 200ms",
            }}
          />
        </div>

        <p
          className="font-mono text-[11px] uppercase tracking-widest text-mist"
          style={{
            opacity: mounted ? 0.8 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 800ms 600ms, transform 800ms 600ms",
          }}
        >
          Horten · Since 1961
        </p>
      </div>
    </div>
  );
}
