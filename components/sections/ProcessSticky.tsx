"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

const STEPS = [
  {
    eyebrow: "01 · Mechanics",
    title: "3- and 5-axis CNC",
    body: "Fifteen-plus CNC machines, unmanned lights-out production. Tolerances down to 0.01 mm, from sub-millimetre parts up to 200 mm diameters.",
    image: "/images/lilaas/l01-detail.webp",
  },
  {
    eyebrow: "02 · Electronics",
    title: "Firmware & integration",
    body: "PCBs designed in-house, firmware written next door, system integration against every major marine bus — CAN, Modbus, NMEA 2000.",
    image: "/images/lilaas/le90-detail.webp",
  },
  {
    eyebrow: "03 · Assembly & test",
    title: "Built and validated on-site",
    body: "Every lever goes through vibration, humidity and EMI rigs before it leaves Horten. Every CNC batch is measured on the CMM against the original drawing.",
    image: "/images/lilaas/lf120-detail.webp",
  },
];

export function ProcessSticky() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = useGsap();

    const ctx = gsap.context(() => {
      const images = gsap.utils.toArray<HTMLElement>("[data-process-image]");
      const steps = gsap.utils.toArray<HTMLElement>("[data-process-step]");

      gsap.set(images, { opacity: 0 });
      gsap.set(images[0], { opacity: 1 });
      gsap.set(steps, { opacity: 0.28 });
      gsap.set(steps[0], { opacity: 1 });

      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top center",
          end: "bottom center",
          onEnter: () => activate(i),
          onEnterBack: () => activate(i),
        });
      });

      function activate(i: number) {
        images.forEach((img, j) => {
          gsap.to(img, { opacity: j === i ? 1 : 0, duration: 0.6, ease: "expo.out" });
        });
        steps.forEach((s, j) => {
          gsap.to(s, { opacity: j === i ? 1 : 0.28, duration: 0.5, ease: "expo.out" });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="container-x">
        <div className="max-w-2xl mb-16">
          <p className="eyebrow mb-5">Under one roof</p>
          <h2 className="font-display text-display-md text-fog text-balance">
            Mechanics, electronics and software — designed, built and tested in Horten.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div className="space-y-[55vh] lg:space-y-[45vh]">
              {STEPS.map((s, i) => (
                <div key={i} data-process-step className="max-w-md transition-opacity">
                  <p className="eyebrow mb-4 text-signal">{s.eyebrow}</p>
                  <h3 className="font-display text-display-sm text-fog mb-5 text-balance">{s.title}</h3>
                  <p className="text-mist leading-relaxed text-pretty">{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-24 h-[60vh] lg:h-[calc(100vh-8rem)]">
            <div className="relative h-full rounded-2xl overflow-hidden border border-white/8 bg-deep/40">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  data-process-image
                  className="absolute inset-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
