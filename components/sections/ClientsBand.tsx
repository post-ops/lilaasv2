"use client";

import { useTranslations } from "next-intl";

const CLIENTS = [
  "Kongsberg Maritime",
  "Wärtsilä",
  "Siemens",
  "General Electric",
  "CERN",
  "Kongsberg Maritime",
  "Wärtsilä",
  "Siemens",
  "General Electric",
  "CERN",
];

export function ClientsBand() {
  const t = useTranslations("home");
  return (
    <section className="relative py-16 border-y border-white/5 bg-deep/30 overflow-hidden">
      <div className="container-x">
        <p className="eyebrow text-center mb-10">{t("clientsEyebrow")}</p>
      </div>
      <div className="relative">
        <div className="flex gap-20 animate-marquee whitespace-nowrap will-change-transform">
          {CLIENTS.concat(CLIENTS).map((name, i) => (
            <span
              key={i}
              className="font-display text-[clamp(1.5rem,2.5vw,2.25rem)] tracking-tight text-mist/60 hover:text-fog transition-colors duration-500"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ink to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-ink to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
