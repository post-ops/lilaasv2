"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { NumberCounter } from "@/components/ui/NumberCounter";

const CLIENTS = [
  "Kongsberg Maritime",
  "Wärtsilä",
  "Siemens",
  "General Electric",
  "CERN",
];

export function ClientsBand() {
  const t = useTranslations("home");
  return (
    <section className="relative py-24 lg:py-32 border-y border-white/5 bg-deep/30 overflow-hidden">
      <div className="container-x">
        <Reveal variant="fade">
          <p className="eyebrow text-center mb-10">{t("clientsEyebrow")}</p>
        </Reveal>

        <div className="grid grid-cols-3 gap-4 lg:gap-10 mb-14 max-w-4xl mx-auto">
          {[
            { value: 12, suffix: "M+", label: "Parts shipped" },
            { value: 4, label: "Continents" },
            { value: 5, label: "Flagship clients" },
          ].map((s, i) => (
            <Reveal key={s.label} variant="up" delay={i * 120}>
              <div className="text-center">
                <div className="font-display text-[clamp(2rem,4.5vw,4rem)] tracking-tightest text-fog">
                  <NumberCounter value={s.value} suffix={s.suffix} />
                </div>
                <p className="eyebrow mt-3 text-mist/70">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-16 lg:gap-24 animate-marquee whitespace-nowrap will-change-transform">
          {CLIENTS.concat(CLIENTS, CLIENTS).map((name, i) => (
            <span
              key={i}
              className="group inline-flex items-center gap-6 font-display text-[clamp(2rem,3.2vw,3rem)] tracking-tight text-mist/55 hover:text-fog hover:-translate-y-1 transition-all duration-500 cursor-default"
              data-magnetic
            >
              {name}
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal/40 group-hover:bg-signal transition-colors" />
            </span>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 lg:w-48 bg-gradient-to-r from-ink to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 lg:w-48 bg-gradient-to-l from-ink to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
