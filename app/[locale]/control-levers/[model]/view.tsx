"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Product } from "@/lib/products";
import { SpecTable } from "@/components/ui/SpecTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLeft } from "lucide-react";

export function ProductDetail({ product }: { product: Product }) {
  const t = useTranslations("controlLevers");
  const common = useTranslations("common");

  return (
    <>
      <section className="pt-36 lg:pt-44 pb-12">
        <div className="container-x">
          <Reveal variant="fade">
            <Link
              href="/control-levers"
              className="inline-flex items-center gap-2 text-mist hover:text-fog text-sm font-mono uppercase tracking-widest mb-10"
            >
              <ArrowLeft size={14} /> {common("back")}
            </Link>
          </Reveal>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
            <Reveal variant="scale">
              <div className="relative aspect-square rounded-2xl border border-white/8 bg-deep/40 overflow-hidden group">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-50 pointer-events-none transition-opacity duration-700 group-hover:opacity-80"
                  style={{
                    background: `radial-gradient(ellipse at 30% 30%, ${product.accent}33, transparent 60%)`,
                  }}
                />
                <Image
                  src={product.image}
                  alt={`${product.model} control lever`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain object-center p-10 lg:p-16 transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
                />
                <div className="absolute top-5 left-5 flex gap-2">
                  <Badge tone={product.family === "L" ? "signal" : product.family === "LE" ? "chart" : "copper"}>
                    Series {product.family}
                  </Badge>
                  <Badge>DNV GL approved</Badge>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal variant="fade">
                <p className="eyebrow mb-4">Control lever</p>
              </Reveal>
              <SplitReveal
                text={product.model}
                as="h1"
                className="font-display text-display-xl text-fog mb-6"
                stagger={0.04}
              />
              <Reveal variant="up" delay={150}>
                <p className="text-xl text-fog leading-relaxed mb-6 text-balance">
                  {product.tagline}
                </p>
              </Reveal>
              <Reveal variant="up" delay={250}>
                <p className="text-mist leading-relaxed mb-8">{product.description}</p>
              </Reveal>
              <Reveal variant="up" delay={350}>
                <div className="flex flex-wrap gap-3 mb-10">
                  <Link href="/contact">
                    <Button variant="primary" arrow>
                      {t("requestDatasheet")}
                    </Button>
                  </Link>
                  <Link href="/support">
                    <Button variant="outline" arrow>
                      Find a distributor
                    </Button>
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {product.detailImage && (
        <section className="py-20">
          <div className="container-x">
            <Reveal variant="up">
              <div className="relative aspect-[16/8] rounded-2xl overflow-hidden border border-white/8 bg-deep/40">
                <Image
                  src={product.detailImage}
                  alt={`${product.model} detail view`}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="py-20 lg:py-28">
        <div className="container-x grid lg:grid-cols-[1fr_1.3fr] gap-16">
          <Reveal variant="left">
            <p className="eyebrow mb-4">Applications</p>
            <ul className="space-y-4">
              {product.applications.map((a, i) => (
                <li key={a} className="flex items-center gap-3 text-fog">
                  <span className="signal-dot" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <SpecTable specs={product.specs} title="Technical specifications" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
