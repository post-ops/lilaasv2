"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/lib/products";
import { ArrowUpRight } from "lucide-react";

export function ControlLeversView({ products }: { products: Product[] }) {
  const t = useTranslations("controlLevers");

  const flagship = products.find((p) => p.slug === "l01")!;
  const rest = products.filter((p) => p.slug !== "l01");

  return (
    <>
      <section className="relative pt-40 lg:pt-52 pb-16">
        <div className="container-x">
          <Reveal variant="fade">
            <p className="eyebrow mb-6">{t("eyebrow")}</p>
          </Reveal>
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-16 items-end">
            <SplitReveal
              text={t("title")}
              as="h1"
              className="font-display text-display-xl text-fog text-balance"
              stagger={0.012}
            />
            <Reveal variant="up" delay={250}>
              <p className="text-lg text-mist leading-relaxed text-pretty">{t("sub")}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-24">
        <div className="container-x">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
            <Reveal variant="left">
              <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl border border-white/8 bg-deep/40 overflow-hidden group">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-60 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 30% 20%, rgba(255,107,53,0.22), transparent 60%)",
                  }}
                />
                <Image
                  src={flagship.image}
                  alt={`${flagship.model} control lever`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain object-center p-10 lg:p-16 transition-transform duration-[1.4s] ease-out-expo group-hover:scale-110"
                />
                <div className="absolute top-5 left-5">
                  <Badge tone="signal">Flagship · {flagship.model}</Badge>
                </div>
              </div>
            </Reveal>
            <Reveal variant="right" delay={120}>
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
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-24">
        <div className="container-x">
          <Reveal variant="up">
            <div className="flex items-end justify-between mb-12">
              <h2 className="font-display text-display-md text-fog">{t("lineup")}</h2>
              <p className="eyebrow hidden md:block">
                {rest.length + 1} models · DNV GL approved
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((p, i) => (
              <Reveal key={p.slug} variant="up" delay={i * 90}>
                <Link href={`/control-levers/${p.slug}`} className="group block h-full">
                  <Card className="h-full flex flex-col p-0 overflow-hidden">
                    <div className="relative aspect-square bg-ink/40">
                      <Image
                        src={p.image}
                        alt={`${p.model} control lever`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain object-center p-8 transition-transform duration-700 ease-out-expo group-hover:scale-110 group-hover:rotate-[-3deg]"
                      />
                      <div className="absolute top-5 left-5">
                        <Badge
                          tone={p.family === "L" ? "signal" : p.family === "LE" ? "chart" : "copper"}
                        >
                          Series {p.family}
                        </Badge>
                      </div>
                      <ArrowUpRight
                        size={18}
                        className="absolute top-5 right-5 text-mist group-hover:text-signal group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500"
                      />
                    </div>
                    <div className="p-7 border-t border-white/5">
                      <p className="font-display text-4xl text-fog tracking-tight mb-3">{p.model}</p>
                      <p className="text-sm text-fog/80 mb-3 min-h-[2.5rem]">{p.tagline}</p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-mist">
                        {p.highlight}
                      </p>
                    </div>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
