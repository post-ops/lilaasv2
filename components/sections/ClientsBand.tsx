"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

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
    <section className="relative py-20 lg:py-28 border-y border-white/5 bg-deep/30 overflow-hidden">
      <div className="container-x">
        <Reveal variant="fade">
          <p className="eyebrow text-center mb-12">{t("clientsEyebrow")}</p>
        </Reveal>
      </div>

      <div className="relative">
        <div className="flex gap-16 lg:gap-24 animate-marquee whitespace-nowrap will-change-transform">
          {CLIENTS.concat(CLIENTS, CLIENTS).map((name, i) => (
            <span
              key={i}
              className="group inline-flex items-center gap-6 font-display text-[clamp(2rem,3.2vw,3rem)] tracking-tight text-mist/55 hover:text-fog transition-colors duration-500 cursor-default"
            >
              {name}
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal/40 group-hover:bg-signal transition-colors" />
            </span>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 lg:w-48 bg-gradient-to-r from-ink to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 lg:w-48 bg-gradient-to-l from-ink to-transparent pointer-events-none" />
      </div>

      <div className="container-x mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10 border-t border-white/8 pt-10 font-mono text-[11px] uppercase tracking-widest">
          {[
            ["Bridges", "thousands"],
            ["Continents", "4"],
            ["Since", "1961"],
            ["Certified", "DNV GL"],
          ].map(([k, v], i) => (
            <Reveal key={k} variant="up" delay={i * 80}>
              <div>
                <p className="text-mist/60 mb-2">{k}</p>
                <p className="font-display text-xl tracking-tight normal-case text-fog">{v}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
