"use client";

import { useTranslations } from "next-intl";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { NumberCounter } from "@/components/ui/NumberCounter";
import { Quote } from "lucide-react";

const LEADERSHIP_KEYS: { name: string; titleKey: string; initial: string }[] = [
  { name: "Espen Bergsted Hoff", titleKey: "ceo", initial: "E" },
  { name: "Petter Akerholt Kjær", titleKey: "director", initial: "P" },
  { name: "Øyvind", titleKey: "businessDev", initial: "Ø" },
  { name: "Kirsti", titleKey: "keyAccount", initial: "K" },
  { name: "Lars Erik", titleKey: "kamPrecision", initial: "L" },
  { name: "Dan Gunnar", titleKey: "kamControl", initial: "D" },
];

type TimelineItem = { year: string; title: string; body: string };

export function AboutView() {
  const t = useTranslations("about");
  const timeline = useTranslations("about.timeline");
  const leadership = useTranslations("about.leadership");
  const stats = useTranslations("about.stats");

  const items = timeline.raw("items") as TimelineItem[];

  return (
    <>
      <section className="pt-40 lg:pt-52 pb-16">
        <div className="container-x">
          <Reveal variant="fade">
            <p className="eyebrow mb-6">{t("eyebrow")}</p>
          </Reveal>
          <SplitReveal
            text={t("title")}
            as="h1"
            className="font-display text-display-xl text-fog text-balance max-w-5xl"
            stagger={0.012}
          />
          <Reveal variant="up" delay={300}>
            <p className="text-lg text-mist leading-relaxed max-w-2xl mt-10 text-pretty">
              {t("founded")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x grid sm:grid-cols-4 gap-8 border-y border-white/8 py-10">
          {[
            { label: stats("founded"), value: 1961, format: (n: number) => String(n) },
            { label: stats("years"), value: 64 },
            { label: stats("employees"), value: 55, suffix: "+" },
            { label: stats("continents"), value: 4 },
          ].map((it, i) => (
            <Reveal key={it.label} variant="up" delay={i * 90}>
              <p className="eyebrow mb-3">{it.label}</p>
              <p className="font-display text-4xl text-fog">
                <NumberCounter value={it.value} suffix={it.suffix} format={it.format} />
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="container-x grid lg:grid-cols-[1fr_1.2fr] gap-14 items-start">
          <div className="lg:sticky lg:top-28">
            <Reveal variant="scale">
              <Quote size={32} className="text-signal mb-8" strokeWidth={1.3} />
            </Reveal>
            <SplitReveal
              text={`“${t("ceoQuote")}”`}
              as="p"
              className="font-display text-3xl lg:text-4xl text-fog leading-[1.15] text-balance"
              stagger={0.01}
            />
            <Reveal variant="up" delay={300}>
              <div className="mt-10">
                <p className="font-display text-lg text-fog">{t("ceoName")}</p>
                <p className="eyebrow mt-1">{t("ceoTitle")}</p>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal variant="fade">
              <p className="eyebrow mb-8">{timeline("label")}</p>
            </Reveal>
            <div className="space-y-10">
              {items.map((item, i) => (
                <Reveal key={i} variant="left" delay={i * 80}>
                  <div className="grid grid-cols-[100px_1fr] gap-6 border-b border-white/5 pb-10 last:border-0">
                    <p className="font-mono text-sm text-signal uppercase tracking-widest pt-1">
                      {item.year}
                    </p>
                    <div>
                      <h3 className="font-display text-xl text-fog mb-2">{item.title}</h3>
                      <p className="text-mist leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-y border-white/5 bg-deep/30">
        <div className="container-x">
          <Reveal variant="fade">
            <p className="eyebrow mb-4">{leadership("label")}</p>
          </Reveal>
          <Reveal variant="up" delay={120}>
            <h2 className="font-display text-display-md text-fog mb-14 text-balance max-w-3xl">
              {leadership("heading")}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LEADERSHIP_KEYS.map((p, i) => (
              <Reveal key={p.name} variant="up" delay={i * 80}>
                <div className="flex items-center gap-5 p-5 rounded-xl border border-white/8 bg-deep/40 transition-all duration-500 hover:border-signal/30 hover:bg-deep/60">
                  <div className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center font-display text-xl text-signal bg-signal/5 shrink-0">
                    {p.initial}
                  </div>
                  <div>
                    <p className="font-display text-lg text-fog">{p.name}</p>
                    <p className="text-xs text-mist">{leadership(`titles.${p.titleKey}`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x">
          <Reveal variant="fade">
            <p className="eyebrow mb-4">{t("certs")}</p>
          </Reveal>
          <div className="flex flex-wrap gap-3">
            {t("certsList").split(" · ").map((c, i) => (
              <Reveal key={c} variant="scale" delay={i * 100}>
                <Badge tone="signal">{c}</Badge>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
