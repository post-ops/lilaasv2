"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
  format?: (n: number) => string;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function NumberCounter({
  value,
  suffix = "",
  prefix = "",
  className,
  duration = 1600,
  format = (n: number) => n.toLocaleString("en-US"),
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  // SSR renders the final value so the number is visible without JS. On mount
  // we decide whether to flip back to 0 and animate (element below the fold)
  // or leave the value as-is (already on screen).
  const [display, setDisplay] = useState<string>(() => format(value));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const rect = el.getBoundingClientRect();
    const alreadyVisible =
      rect.top < window.innerHeight && rect.bottom > 0;

    let raf = 0;
    let observer: IntersectionObserver | null = null;

    function animateUp() {
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setDisplay(format(Math.round(eased * value)));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    if (alreadyVisible) {
      // Element is already on screen at mount. Animate from 0 up to value for
      // a bit of flourish, but kick it off immediately so the static "0"
      // frame never gets rendered.
      setDisplay(format(0));
      raf = requestAnimationFrame(animateUp);
      return () => cancelAnimationFrame(raf);
    }

    setDisplay(format(0));
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animateUp();
            observer?.disconnect();
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration, format]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
