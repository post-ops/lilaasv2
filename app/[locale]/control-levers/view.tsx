"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import type { Product } from "@/lib/products";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";

const SmallJoystick = dynamic(
  () => import("@/components/three/SmallJoystick").then((m) => m.SmallJoystick),
  { ssr: false, loading: () => <div style={{ height: 340 }} /> }
);

export function ControlLeversView({ products }: { products: Product[] }) {
  const t = useTranslations("controlLevers");

  const flagship = products.find((p) => p.slug === "l01")!;
  const rest = products.filter((p) => p.slug !== "l01");

  return (
    <>
      <section className="relative pt-40 lg:pt-52 pb-16">
        <div className="container-x">
          <p className="eyebrow mb-6">{t("eyebrow")}</p>
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-16 items-end">
            <SplitReveal
              text={t("title")}
              as="h1"
              className="font-display text-display-xl text-fog text-balance"
              stagger={0.012}
            />
            <p className="text-lg text-mist leading-relaxed text-pretty">{t("sub")}</p>
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-24">
        <div className="container-x">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
            <div className="relative rounded-2xl border border-white/8 bg-deep/40 overflow-hidden">
              <div aria-hidden className="absolute inset-0 opacity-40 pointer-events-none" style={{
                background: "radial-gradient(ellipse at 30% 20%, rgba(255,107,53,0.2), transparent 60%)",
              }} />
              <SmallJoystick accent={flagship.accent} height={460} rotation={-0.25} />
              <div className="absolute top-5 left-5">
                <Badge tone="signal">Flagship · {flagship.model}</Badge>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-4">Model {flagship.model}</p>
              <h2 className="font-display text-display-md text-fog mb-6 text-balance">
                {flagship.tagline}
              </h2>
              <p className="text-mist leading-relaxed mb-6">{flagship.description}</p>
              <p className="font-mono text-xs uppercase tracking-widest text-signal mb-8">
                {flagship.highlight}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={`/control-levers/${flagship.slug}`}>
                  <Button variant="primary" arrow>
                    {t("viewProduct")}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" arrow>
                    {t("requestDatasheet")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-24">
        <div className="container-x">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display text-display-md text-fog">{t("lineup")}</h2>
            <p className="eyebrow hidden md:block">
              {rest.length + 1} models · DNV GL approved
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((p) => (
              <Link key={p.slug} href={`/control-levers/${p.slug}`} className="group block">
                <Card className="h-full flex flex-col p-8">
                  <div className="flex items-start justify-between mb-8">
                    <Badge tone={p.family === "L" ? "signal" : p.family === "LE" ? "chart" : "copper"}>
                      Series {p.family}
                    </Badge>
                    <ArrowUpRight
                      size={18}
                      className="text-mist group-hover:text-signal group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500"
                    />
                  </div>
                  <p className="font-display text-5xl text-fog tracking-tight mb-5">{p.model}</p>
                  <p className="text-sm text-fog/80 mb-4 min-h-[2.5rem]">{p.tagline}</p>
                  <p className="mt-auto font-mono text-[10px] uppercase tracking-widest text-mist">
                    {p.highlight}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
