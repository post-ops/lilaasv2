"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * IntersectionObserver-based reveal. Attaches the ref to a container; when it
 * enters the viewport, flips every descendant `data-reveal="out"` element to
 * `data-reveal="in"` with staggered transition-delay. CSS handles the actual
 * animation, so if JS never runs the elements fall back to their natural
 * (visible) state rather than being stuck invisible.
 */
export function useReveal<T extends HTMLElement = HTMLElement>({
  threshold = 0.12,
  rootMargin = "0px 0px -6% 0px",
  once = true,
}: { threshold?: number; rootMargin?: string; once?: boolean } = {}): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      el.querySelectorAll('[data-reveal="out"]').forEach((n) =>
        n.setAttribute("data-reveal", "in")
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.querySelectorAll<HTMLElement>('[data-reveal="out"]').forEach((n, i) => {
              n.style.transitionDelay = `${i * 70}ms`;
              n.setAttribute("data-reveal", "in");
            });
            if (once) observer.disconnect();
          } else if (!once) {
            el.querySelectorAll('[data-reveal="in"]').forEach((n) =>
              n.setAttribute("data-reveal", "out")
            );
          }
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}
