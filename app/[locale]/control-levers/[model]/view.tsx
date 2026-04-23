"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import type { Product } from "@/lib/products";
import { SpecTable } from "@/components/ui/SpecTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const SmallJoystick = dynamic(
  () => import("@/components/three/SmallJoystick").then((m) => m.SmallJoystick),
  { ssr: false, loading: () => <div style={{ height: 520 }} /> }
);

export function ProductDetail({ product }: { product: Product }) {
  const t = useTranslations("controlLevers");
  const common = useTranslations("common");

  return (
    <>
      <section className="pt-36 lg:pt-44 pb-12">
        <div className="container-x">
          <Link
            href="/control-levers"
            className="inline-flex items-center gap-2 text-mist hover:text-fog text-sm font-mono uppercase tracking-widest mb-10"
          >
            <ArrowLeft size={14} /> {common("back")}
          </Link>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
            <div className="relative rounded-2xl border border-white/8 bg-deep/40 overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 opacity-50 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 30% 30%, ${product.accent}33, transparent 60%)`,
                }}
              />
              <SmallJoystick accent={product.accent} height={560} rotation={-0.3} />
              <div className="absolute top-5 left-5 flex gap-2">
                <Badge tone={product.family === "L" ? "signal" : product.family === "LE" ? "chart" : "copper"}>
                  Series {product.family}
                </Badge>
                <Badge>DNV GL approved</Badge>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">Control lever</p>
              <SplitReveal
                text={product.model}
                as="h1"
                className="font-display text-display-xl text-fog mb-6"
                stagger={0.04}
              />
              <p className="text-xl text-fog leading-relaxed mb-6 text-balance">
                {product.tagline}
              </p>
              <p className="text-mist leading-relaxed mb-8">{product.description}</p>

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
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x grid lg:grid-cols-[1fr_1.3fr] gap-16">
          <div>
            <p className="eyebrow mb-4">Applications</p>
            <ul className="space-y-4">
              {product.applications.map((a) => (
                <li key={a} className="flex items-center gap-3 text-fog">
                  <span className="signal-dot" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SpecTable specs={product.specs} title="Technical specifications" />
          </div>
        </div>
      </section>
    </>
  );
}
