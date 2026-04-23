"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01/·".split("");

export function Scramble({
  text,
  delay = 0,
  duration = 900,
  className,
}: {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setOut(text);
      return;
    }

    let raf = 0;
    let started = false;
    let startTime = 0;

    function run(now: number) {
      if (!startTime) startTime = now;
      const t = Math.min(1, (now - startTime) / duration);
      const locked = Math.floor(t * text.length);

      let s = "";
      for (let i = 0; i < text.length; i++) {
        if (i < locked || text[i] === " " || text[i] === ",") {
          s += text[i];
        } else {
          s += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setOut(s);
      if (t < 1) raf = requestAnimationFrame(run);
      else setOut(text);
    }

    function kickoff() {
      if (started) return;
      started = true;
      const t = setTimeout(() => {
        raf = requestAnimationFrame(run);
      }, delay);
      return () => clearTimeout(t);
    }

    const rect = el.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (visible) {
      kickoff();
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              kickoff();
              io.disconnect();
            }
          }
        },
        { threshold: 0.1 }
      );
      io.observe(el);
      return () => {
        io.disconnect();
        cancelAnimationFrame(raf);
      };
    }

    return () => cancelAnimationFrame(raf);
  }, [text, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {out}
    </span>
  );
}
