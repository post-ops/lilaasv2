"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Badge } from "@/components/ui/Badge";
import { Anchor, Shield, Activity, Rocket, ArrowUpRight } from "lucide-react";

const OceanScene = dynamic(
  () => import("@/components/three/OceanScene").then((m) => m.OceanScene),
  { ssr: false, loading: () => <div style={{ height: 520 }} /> }
);

const DATA = {
  maritime: {
    icon: Anchor,
    tone: "signal",
    heroImage: "ocean",
    applications: [
      "Supply vessels",
      "Ferries",
      "Tankers",
      "Cruise ships",
      "Yachts",
      "Offshore platforms",
    ],
    products: ["L01", "LF200", "LF180", "LF120", "LF50"],
    certifications: ["DNV GL type-approved", "EMC (marine)", "Vibration tested", "IP65 rated"],
  },
  defence: {
    icon: Shield,
    tone: "fog",
    heroImage: "field",
    applications: [
      "Vehicle control systems",
      "Naval auxiliaries",
      "Ground station consoles",
      "Type-approved subassemblies",
    ],
    products: ["LE90 (OEM)", "LF120 (custom)"],
    certifications: ["Type-tested", "Environmental sealing", "EMI / EMC approved"],
  },
  medical: {
    icon: Activity,
    tone: "chart",
    heroImage: "sterile",
    applications: [
      "Surgical instrumentation housings",
      "Diagnostic equipment parts",
      "Precision sub-millimetre components",
    ],
    products: ["Precision mechanics"],
    certifications: ["NS-EN ISO 9001:2015", "Traceability by batch"],
  },
  space: {
    icon: Rocket,
    tone: "copper",
    heroImage: "stars",
    applications: [
      "Large Hadron Collider components (CERN)",
      "Satellite hardware",
      "Test and measurement rigs",
    ],
    products: ["Precision mechanics"],
    certifications: ["Tolerance to 0.01 mm", "Documented process control"],
  },
} as const;

export function IndustryView({ industry }: { industry: keyof typeof DATA }) {
  const t = useTranslations(`industries.${industry}`);
  const industries = useTranslations("industries");
  const data = DATA[industry];
  const Icon = data.icon;

  const otherIndustries = (Object.keys(DATA) as (keyof typeof DATA)[]).filter((k) => k !== industry);

  return (
    <>
      <section className="relative pt-40 lg:pt-52 pb-20 overflow-hidden">
        {industry === "maritime" && (
          <div className="absolute inset-x-0 bottom-0 h-[60vh] opacity-80 pointer-events-none">
            <OceanScene height={600} />
          </div>
        )}

        <div className="container-x relative">
          <div className="flex items-center gap-3 mb-8">
            <div className={
              "w-10 h-10 rounded-lg border flex items-center justify-center " +
              (data.tone === "signal" ? "border-signal/40 text-signal bg-signal/5" :
               data.tone === "chart" ? "border-chart/40 text-chart bg-chart/5" :
               data.tone === "copper" ? "border-copper/40 text-copper bg-copper/5" :
               "border-fog/20 text-fog bg-fog/5")
            }>
              <Icon size={18} strokeWidth={1.5} />
            </div>
            <p className="eyebrow">Application · {t("name")}</p>
          </div>

          <SplitReveal
            text={t("tag")}
            as="h1"
            className="font-display text-display-lg text-fog max-w-4xl text-balance"
            stagger={0.012}
          />
          <p className="text-lg text-mist leading-relaxed max-w-2xl mt-10 text-pretty">
            {t("body")}
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x grid lg:grid-cols-3 gap-10">
          <div>
            <p className="eyebrow mb-6">Applications</p>
            <ul className="space-y-3">
              {data.applications.map((a) => (
                <li key={a} className="flex items-center gap-3 text-fog">
                  <span className="signal-dot" /> {a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-6">Products we supply</p>
            <ul className="space-y-3">
              {data.products.map((p) => (
                <li key={p} className="font-mono text-sm text-fog">{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-6">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {data.certifications.map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="container-x">
          <p className="eyebrow mb-6">Other industries we serve</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {otherIndustries.map((slug) => {
              const I = DATA[slug].icon;
              return (
                <Link key={slug} href={`/industries/${slug}`} className="group block">
                  <Card className="p-7 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-fog">
                        <I size={16} strokeWidth={1.5} />
                      </div>
                      <span className="font-display text-xl text-fog">{industries(`${slug}.name`)}</span>
                    </div>
                    <ArrowUpRight size={18} className="text-mist group-hover:text-signal group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500" />
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x text-center">
          <p className="eyebrow mb-6">Let's build it together</p>
          <h2 className="font-display text-display-md text-fog max-w-3xl mx-auto text-balance mb-10">
            Our engineers are ready to spec your next project.
          </h2>
          <Link href="/contact">
            <Button variant="primary" size="lg" arrow>Talk to engineering</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
