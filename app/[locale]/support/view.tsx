"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Globe2, Ship, Flag } from "lucide-react";

const DISTRIBUTORS: { name: string; region: string; typeKey: "distributor" | "service" }[] = [
  { name: "IMTRA", region: "USA · Canada", typeKey: "distributor" },
  { name: "Goodwill Technical Services", region: "Asia-Pacific", typeKey: "distributor" },
  { name: "Tritek Power & Automation", region: "Middle East", typeKey: "distributor" },
  { name: "Shanghai EJH Group", region: "China · Hong Kong · Taiwan", typeKey: "distributor" },
  { name: "Amaltheia Marine", region: "Greece · Turkey · Egypt", typeKey: "distributor" },
  { name: "Elma BV", region: "Netherlands · Belgium", typeKey: "distributor" },
  { name: "Kiepe Electric", region: "Italy", typeKey: "distributor" },
  { name: "Kinextec", region: "Spain", typeKey: "distributor" },
  { name: "Z-Power Automation", region: "Singapore", typeKey: "service" },
];

export function SupportView() {
  const t = useTranslations("support");
  const types = useTranslations("support.types");
  const direct = useTranslations("support.direct");
  const datasheets = useTranslations("support.datasheets");

  return (
    <>
      <section className="pt-40 lg:pt-52 pb-20">
        <div className="container-x">
          <Reveal variant="fade">
            <p className="eyebrow mb-6">{t("eyebrow")}</p>
          </Reveal>
          <SplitReveal
            text={t("title")}
            as="h1"
            className="font-display text-display-xl text-fog max-w-4xl text-balance"
            stagger={0.012}
          />
          <Reveal variant="up" delay={300}>
            <p className="text-lg text-mist leading-relaxed max-w-2xl mt-10">{t("sub")}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <Reveal variant="up">
            <div className="flex items-center gap-3 mb-10">
              <Globe2 size={20} className="text-signal" strokeWidth={1.5} />
              <h2 className="font-display text-display-sm text-fog">{t("distributorsTitle")}</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DISTRIBUTORS.map((d, i) => (
              <Reveal key={d.name} variant="up" delay={i * 70}>
                <Card className="p-7 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <Flag size={16} className="text-signal" strokeWidth={1.5} />
                    <Badge>{types(d.typeKey)}</Badge>
                  </div>
                  <p className="font-display text-xl text-fog mb-2">{d.name}</p>
                  <p className="text-sm text-mist">{d.region}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 bg-deep/30">
        <div className="container-x grid lg:grid-cols-2 gap-10">
          <Reveal variant="left">
            <Ship size={28} className="text-signal mb-6" strokeWidth={1.3} />
            <h2 className="font-display text-display-sm text-fog mb-4">{direct("title")}</h2>
            <p className="text-mist leading-relaxed mb-6">{direct("body")}</p>
            <p className="font-mono text-sm text-fog">{direct("contact")}</p>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <p className="eyebrow mb-4">{datasheets("label")}</p>
            <p className="text-mist leading-relaxed mb-4">{datasheets("body")}</p>
            <p className="text-mist leading-relaxed">
              {datasheets("emailPrefix")} <a href="mailto:sales@lilaas.no" className="text-signal hover:text-white">sales@lilaas.no</a>{datasheets("emailSuffix")}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
