"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Anchor, Shield, Activity, Rocket, ArrowUpRight } from "lucide-react";

const AmbientScene = dynamic(
  () => import("@/components/three/AmbientScene").then((m) => m.AmbientScene),
  { ssr: false, loading: () => null }
);

type Tone = "signal" | "fog" | "chart" | "copper";

const META: Record<string, { icon: typeof Anchor; tone: Tone; accent: string; heroImage: string }> = {
  maritime: {
    icon: Anchor,
    tone: "signal",
    accent: "#FF6B35",
    heroImage: "/images/industries/maritime.webp",
  },
  defence: {
    icon: Shield,
    tone: "fog",
    accent: "#C9D1DE",
    heroImage: "/images/industries/defence.webp",
  },
  medical: {
    icon: Activity,
    tone: "chart",
    accent: "#2BD4B4",
    heroImage: "/images/industries/medical.webp",
  },
  space: {
    icon: Rocket,
    tone: "copper",
    accent: "#C97E4F",
    heroImage: "/images/industries/space.webp",
  },
};

const PRODUCTS_PER_INDUSTRY: Record<string, string[]> = {
  maritime: ["L01", "LF180", "LF120", "LF90"],
  defence: ["LE90 (OEM)", "LF120"],
  medical: ["Precision mechanics"],
  space: ["Precision mechanics"],
};

export function IndustryView({ industry }: { industry: string }) {
  const t = useTranslations(`industries.${industry}`);
  const industries = useTranslations("industries");
  const page = useTranslations("industries.page");
  const data = META[industry];
  const Icon = data.icon;

  const applications = t("applications").split("|").map((s) => s.trim());
  const certifications = t("certifications").split("|").map((s) => s.trim());
  const productList = PRODUCTS_PER_INDUSTRY[industry] ?? [];

  const otherIndustries = Object.keys(META).filter((k) => k !== industry);

  return (
    <>
      <section className="relative pt-40 lg:pt-52 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src={data.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink" />
        </div>
        <AmbientScene intensity="section" accent={data.accent} />

        <div className="container-x relative">
          <Reveal variant="up">
            <div className="flex items-center gap-3 mb-8">
              <div
                className={
                  "w-10 h-10 rounded-lg border flex items-center justify-center backdrop-blur-sm " +
                  (data.tone === "signal"
                    ? "border-signal/40 text-signal bg-signal/10"
                    : data.tone === "chart"
                    ? "border-chart/40 text-chart bg-chart/10"
                    : data.tone === "copper"
                    ? "border-copper/40 text-copper bg-copper/10"
                    : "border-fog/20 text-fog bg-fog/10")
                }
              >
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <p className="eyebrow">{page("application")} · {t("name")}</p>
            </div>
          </Reveal>

          <SplitReveal
            text={t("tag")}
            as="h1"
            className="font-display text-display-lg text-fog max-w-4xl text-balance"
            stagger={0.012}
          />
          <Reveal variant="up" delay={300}>
            <p className="text-lg text-mist leading-relaxed max-w-2xl mt-10 text-pretty">
              {t("body")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <Reveal variant="scale">
            <div className="relative aspect-[16/7] rounded-2xl overflow-hidden border border-white/8 group">
              <Image
                src={data.heroImage}
                alt={`${t("name")} ${page("contextAlt")}`}
                fill
                sizes="100vw"
                className="object-cover object-center transition-transform duration-[1.8s] ease-out-expo group-hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x grid lg:grid-cols-3 gap-10">
          <Reveal variant="up">
            <p className="eyebrow mb-6">{page("applications")}</p>
            <ul className="space-y-3">
              {applications.map((a, i) => (
                <li
                  key={a}
                  className="flex items-center gap-3 text-fog transition-all duration-300 hover:gap-4 hover:text-signal"
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <span className="signal-dot" /> {a}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal variant="up" delay={120}>
            <p className="eyebrow mb-6">{page("productsWeSupply")}</p>
            <ul className="space-y-3">
              {productList.map((p) => (
                <li key={p} className="font-mono text-sm text-fog">{p}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal variant="up" delay={240}>
            <p className="eyebrow mb-6">{page("certifications")}</p>
            <div className="flex flex-wrap gap-2">
              {certifications.map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="container-x">
          <Reveal variant="fade">
            <p className="eyebrow mb-6">{page("otherIndustries")}</p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-5">
            {otherIndustries.map((slug, i) => {
              const I = META[slug].icon;
              return (
                <Reveal key={slug} variant="up" delay={i * 90}>
                  <Link href={`/industries/${slug}`} className="group block">
                    <Card className="p-7 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-fog">
                          <I size={16} strokeWidth={1.5} />
                        </div>
                        <span className="font-display text-xl text-fog">{industries(`${slug}.name`)}</span>
                      </div>
                      <ArrowUpRight
                        size={18}
                        className="text-mist group-hover:text-signal group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500"
                      />
                    </Card>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x text-center">
          <Reveal variant="fade">
            <p className="eyebrow mb-6">{page("ctaEyebrow")}</p>
          </Reveal>
          <Reveal variant="up" delay={120}>
            <h2 className="font-display text-display-md text-fog max-w-3xl mx-auto text-balance mb-10">
              {page("ctaTitle")}
            </h2>
          </Reveal>
          <Reveal variant="scale" delay={240}>
            <Link href="/contact">
              <Button variant="primary" size="lg" arrow>{page("ctaButton")}</Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
