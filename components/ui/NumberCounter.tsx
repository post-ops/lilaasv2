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
  const formatRef = useRef(format);
  formatRef.current = format;

  const [display, setDisplay] = useState<string>(() => format(value));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const fmt = formatRef.current;

    let raf = 0;
    let observer: IntersectionObserver | null = null;
    let done = false;

    function animateUp() {
      if (done) return;
      done = true;
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setDisplay(formatRef.current(Math.round(eased * value)));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (alreadyVisible) {
      setDisplay(fmt(0));
      raf = requestAnimationFrame(animateUp);
      return () => cancelAnimationFrame(raf);
    }

    setDisplay(fmt(0));
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animateUp();
            observer?.disconnect();
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(el);

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(raf);
    };
    // Intentionally depend only on value/duration — format is captured via ref
    // so inline-parent-created format functions don't thrash the effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
