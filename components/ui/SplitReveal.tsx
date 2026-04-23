"use client";

import { createElement, useEffect, useMemo, useRef } from "react";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type SplitRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  /** trigger immediately on mount rather than on scroll. */
  immediate?: boolean;
};

export function SplitReveal({
  text,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.02,
  immediate = false,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  const words = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.querySelectorAll<HTMLElement>("[data-char]").forEach((c) => {
        c.style.transform = "translateY(0)";
        c.style.opacity = "1";
      });
      return;
    }

    const { gsap, ScrollTrigger } = useGsap();
    const chars = el.querySelectorAll<HTMLElement>("[data-char]");

    const tween = gsap.fromTo(
      chars,
      { y: "105%", opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: immediate
          ? undefined
          : { trigger: el, start: "top 85%", once: true },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, stagger, immediate]);

  return createElement(
    as,
    {
      ref,
      className: cn(className),
      "aria-label": text,
    },
    words.map((word, wi) => (
      <span
        key={wi}
        className="inline-block overflow-hidden align-baseline pr-[0.28em] last:pr-0"
        aria-hidden
      >
        <span className="inline-block">
          {Array.from(word).map((ch, ci) => (
            <span
              key={ci}
              data-char
              className="inline-block will-change-transform"
              style={{ transform: "translateY(105%)", opacity: 0 }}
            >
              {ch}
            </span>
          ))}
        </span>
      </span>
    ))
  );
}
