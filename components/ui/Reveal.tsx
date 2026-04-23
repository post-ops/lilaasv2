"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "up" | "left" | "right" | "scale" | "fade";

function initialStyle(variant: Variant): React.CSSProperties {
  switch (variant) {
    case "up":
      return { opacity: 0, transform: "translateY(36px)" };
    case "left":
      return { opacity: 0, transform: "translateX(-36px)" };
    case "right":
      return { opacity: 0, transform: "translateX(36px)" };
    case "scale":
      return { opacity: 0, transform: "scale(0.94)" };
    case "fade":
    default:
      return { opacity: 0 };
  }
}

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = 900,
  threshold = 0.15,
  className,
  once = true,
}: {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "none";
            if (once) io.disconnect();
          } else if (!once) {
            const s = initialStyle(variant);
            if (s.opacity !== undefined) el.style.opacity = String(s.opacity);
            if (s.transform) el.style.transform = String(s.transform);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [variant, threshold, once]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        ...initialStyle(variant),
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
