"use client";

import { useEffect, useRef, useState } from "react";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

export function NumberCounter({
  value,
  suffix = "",
  prefix = "",
  className,
  duration = 2,
  format = (n: number) => n.toLocaleString("en-US"),
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? format(value) : format(0)));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setDisplay(format(value));
      return;
    }
    const { gsap, ScrollTrigger } = useGsap();
    const obj = { n: 0 };
    const tween = gsap.to(obj, {
      n: value,
      duration,
      ease: "expo.out",
      onUpdate: () => setDisplay(format(Math.round(obj.n))),
      scrollTrigger: { trigger: el, start: "top 80%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
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
