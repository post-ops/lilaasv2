"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/gsap";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  strength?: number;
};

export function MagneticLink({ children, className, strength = 0.35, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el!.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    }
    function onLeave() {
      el!.style.transform = "translate3d(0,0,0)";
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      data-magnetic
      className={cn("inline-block transition-transform duration-300 ease-out-expo", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
