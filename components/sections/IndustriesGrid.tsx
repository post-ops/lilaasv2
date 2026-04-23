"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { ArrowUpRight, Anchor, Shield, Activity, Rocket } from "lucide-react";

const INDUSTRIES = [
  { slug: "maritime", icon: Anchor, tone: "signal" },
  { slug: "defence", icon: Shield, tone: "fog" },
  { slug: "medical", icon: Activity, tone: "chart" },
  { slug: "space", icon: Rocket, tone: "copper" },
] as const;

export function IndustriesGrid() {
  const t = useTranslations("home");
  const ind = useTranslations("industries");

  return (
    <section className="relative py-32 lg:py-44">
      <div className="container-x">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-24 mb-20">
          <div>
            <p className="eyebrow mb-5">{t("industriesEyebrow")}</p>
            <SplitReveal
              text={t("industriesTitle")}
              as="h2"
              className="font-display text-display-md text-fog text-balance"
              stagger={0.014}
            />
          </div>
          <p className="text-lg text-mist leading-relaxed pt-4 text-pretty max-w-xl">
            {t("industriesSub")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {INDUSTRIES.map(({ slug, icon: Icon, tone }, i) => (
            <Link key={slug} href={`/industries/${slug}`} className="group block">
              <Card className="h-full p-8 lg:p-10 min-h-[280px] flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div
                    className={
                      "w-12 h-12 rounded-xl border flex items-center justify-center " +
                      (tone === "signal"
                        ? "border-signal/40 text-signal bg-signal/5"
                        : tone === "chart"
                        ? "border-chart/40 text-chart bg-chart/5"
                        : tone === "copper"
                        ? "border-copper/40 text-copper bg-copper/5"
                        : "border-fog/20 text-fog bg-fog/5")
                    }
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="text-mist group-hover:text-signal group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <p className="eyebrow mb-3">0{i + 1}</p>
                  <h3 className="font-display text-3xl text-fog mb-3">{ind(`${slug}.name`)}</h3>
                  <p className="text-mist text-sm leading-relaxed mb-4">{ind(`${slug}.tag`)}</p>
                  <p className="text-fog/80 text-sm leading-relaxed max-w-md">{ind(`${slug}.body`)}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
