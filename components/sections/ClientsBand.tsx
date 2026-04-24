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
  const meta = useTranslations("home.clientsMeta");

  const items = [
    { k: meta("bridges"), v: meta("bridgesValue") },
    { k: meta("continents"), v: meta("continentsValue") },
    { k: meta("since"), v: meta("sinceValue") },
    { k: meta("certified"), v: meta("certifiedValue") },
  ];

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
          {items.map((it, i) => (
            <Reveal key={i} variant="up" delay={i * 80}>
              <div>
                <p className="text-mist/60 mb-2">{it.k}</p>
                <p className="font-display text-xl tracking-tight normal-case text-fog">{it.v}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
