"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function PageTransition() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 650);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      style={{ display: visible ? "block" : "none" }}
    >
      <div
        className="absolute inset-0 bg-ink"
        style={{
          transformOrigin: "bottom",
          animation: "pt-wipe 650ms cubic-bezier(0.87,0,0.13,1) both",
        }}
      />
      <style jsx>{`
        @keyframes pt-wipe {
          0% { transform: scaleY(0); transform-origin: bottom; }
          50% { transform: scaleY(1); transform-origin: bottom; }
          51% { transform: scaleY(1); transform-origin: top; }
          100% { transform: scaleY(0); transform-origin: top; }
        }
      `}</style>
    </div>
  );
}
