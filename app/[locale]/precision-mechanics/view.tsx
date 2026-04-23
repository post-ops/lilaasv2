"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { NumberCounter } from "@/components/ui/NumberCounter";
import { Cog, Wrench, Cpu, Microscope, Factory, TestTube, ArrowUpRight } from "lucide-react";

const AmbientScene = dynamic(
  () => import("@/components/three/AmbientScene").then((m) => m.AmbientScene),
  { ssr: false, loading: () => null }
);

const CAPABILITIES = [
  { icon: Cog, title: "3- and 5-axis CNC", body: "15+ machines covering short-run prototypes to high-volume production." },
  { icon: Wrench, title: "Automated lathes", body: "Unmanned 'lights-out' production — how we stay competitive in Norway." },
  { icon: Cpu, title: "In-house electronics", body: "PCB design, firmware, and system integration under one roof." },
  { icon: Microscope, title: "Quality control", body: "CMM metrology; every product tested before leaving the factory." },
  { icon: Factory, title: "Assembly lines", body: "Mechanics, electronics and software assembled and calibrated on-site." },
  { icon: TestTube, title: "Type-test fixtures", body: "Vibration, humidity, EMI rigs for defence and marine approvals." },
];

const CNC_IMAGE = "/images/factory/cnc.webp";
const MACHINING_IMAGE = "/images/factory/machining.webp";

export function PrecisionView() {
  const t = useTranslations("precision");

  return (
    <>
      <section className="relative pt-40 lg:pt-52 pb-24 overflow-hidden">
        <AmbientScene intensity="section" accent="#2BD4B4" />
        <div className="container-x relative">
          <p className="eyebrow mb-6">{t("eyebrow")}</p>
          <SplitReveal
            text={t("title")}
            as="h1"
            className="font-display text-display-xl text-fog max-w-5xl text-balance"
            stagger={0.012}
          />
          <p className="text-lg text-mist leading-relaxed max-w-2xl mt-10 text-pretty">{t("sub")}</p>

          <div className="grid sm:grid-cols-3 gap-8 lg:gap-10 mt-20 border-t border-white/8 pt-10 max-w-3xl">
            <div>
              <p className="eyebrow mb-4">CNC machines</p>
              <div className="font-display text-4xl lg:text-5xl text-fog">
                <NumberCounter value={15} suffix="+" />
              </div>
            </div>
            <div>
              <p className="eyebrow mb-4">Min tolerance</p>
              <div className="font-display text-4xl lg:text-5xl text-fog">
                0.01 <span className="text-signal text-2xl">mm</span>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-4">Part size range</p>
              <div className="font-display text-4xl lg:text-5xl text-fog">
                &lt;1 – 200 <span className="text-mist text-2xl">mm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden">
        <div className="container-x">
          <div className="relative aspect-[16/8] rounded-2xl overflow-hidden border border-white/8">
            <Image
              src={CNC_IMAGE}
              alt="CNC production floor"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <Badge tone="chart">Horten, Norway</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="container-x">
          <div className="flex items-end justify-between mb-14">
            <h2 className="font-display text-display-md text-fog">{t("capabilities")}</h2>
            <p className="eyebrow hidden md:block">full-stack manufacturing</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map(({ icon: Icon, title, body }, i) => (
              <Card key={title} className="p-8 min-h-[220px] flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-11 h-11 rounded-lg border border-white/10 flex items-center justify-center text-signal bg-signal/5">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <p className="eyebrow">0{i + 1}</p>
                </div>
                <h3 className="font-display text-xl text-fog mb-2">{title}</h3>
                <p className="text-sm text-mist leading-relaxed">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <Image
            src={MACHINING_IMAGE}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink" />
        </div>
        <div className="container-x relative grid lg:grid-cols-[1fr_1.3fr] gap-14">
          <div>
            <p className="eyebrow mb-4">{t("materials")}</p>
            <h2 className="font-display text-display-sm text-fog text-balance mb-6">
              From stainless steel and titanium to Inconel and engineering plastics.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 self-center">
            {t("materialsList").split(" · ").map((m) => (
              <Badge key={m}>{m}</Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 lg:py-40">
        <div className="container-x">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-14 items-center">
            <div>
              <Badge tone="signal" className="mb-6">Featured case · CERN</Badge>
              <SplitReveal
                text="Accuracy to hundredths of a millimetre — underground, at Geneva."
                as="h2"
                className="font-display text-display-md text-fog text-balance mb-6"
                stagger={0.014}
              />
              <p className="text-mist leading-relaxed mb-8 max-w-lg">
                The Large Hadron Collider required components machined to tolerances most facilities can't reliably hit. We were on the shortlist — and we delivered.
              </p>
              <Link
                href="/case-studies/cern"
                className="inline-flex items-center gap-2 text-signal hover:text-white transition-colors font-mono text-sm uppercase tracking-widest"
                data-magnetic
              >
                Read the CERN story
                <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl border border-white/8 bg-deep/40 overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 60% 40%, rgba(43,212,180,0.2), transparent 55%), radial-gradient(circle at 30% 80%, rgba(255,107,53,0.15), transparent 50%)",
                }}
              >
                <svg viewBox="0 0 400 300" className="w-full max-w-md opacity-70">
                  <defs>
                    <radialGradient id="g1" cx="50%" cy="50%">
                      <stop offset="0%" stopColor="#2BD4B4" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#2BD4B4" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="200" cy="150" r="120" fill="url(#g1)" />
                  <circle cx="200" cy="150" r="100" fill="none" stroke="#2BD4B4" strokeOpacity="0.4" strokeWidth="0.5" />
                  <circle cx="200" cy="150" r="80" fill="none" stroke="#C9D1DE" strokeOpacity="0.2" strokeWidth="0.5" />
                  <circle cx="200" cy="150" r="60" fill="none" stroke="#FF6B35" strokeOpacity="0.6" strokeWidth="0.5" />
                  <circle cx="200" cy="150" r="40" fill="none" stroke="#FF6B35" strokeOpacity="0.3" strokeWidth="0.5" />
                  {Array.from({ length: 36 }).map((_, i) => {
                    const a = (i / 36) * Math.PI * 2;
                    return (
                      <line
                        key={i}
                        x1={200 + Math.cos(a) * 100}
                        y1={150 + Math.sin(a) * 100}
                        x2={200 + Math.cos(a) * 120}
                        y2={150 + Math.sin(a) * 120}
                        stroke="#C9D1DE"
                        strokeOpacity="0.3"
                        strokeWidth="0.5"
                      />
                    );
                  })}
                  <text x="200" y="155" textAnchor="middle" fill="#C9D1DE" fontFamily="monospace" fontSize="9" opacity="0.7">
                    TOLERANCE 0.01 mm
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
