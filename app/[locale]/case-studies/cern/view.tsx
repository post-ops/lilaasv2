"use client";

import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export function CernStory() {
  return (
    <>
      <section className="pt-40 lg:pt-52 pb-16">
        <div className="container-x">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-mist hover:text-fog font-mono text-xs uppercase tracking-widest mb-10">
            <ArrowLeft size={14} /> All case studies
          </Link>
          <div className="flex gap-2 mb-8">
            <Badge tone="chart">Physics</Badge>
            <Badge>Switzerland</Badge>
            <Badge tone="signal">Precision mechanics</Badge>
          </div>
          <SplitReveal
            text="We machined components for the Large Hadron Collider at CERN."
            as="h1"
            className="font-display text-display-xl text-fog max-w-5xl text-balance"
            stagger={0.01}
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container-x grid lg:grid-cols-[1fr_2fr] gap-14">
          <div className="lg:sticky lg:top-28 self-start space-y-10">
            <Stat label="Required tolerance" value="0.01 mm" />
            <Stat label="Location" value="100 m below Geneva" />
            <Stat label="Materials" value="Stainless steel, copper, Inconel" />
            <Stat label="Delivery" value="Qualified & documented" />
          </div>

          <article className="prose-lilaas max-w-2xl">
            <p className="text-xl text-fog leading-relaxed mb-8 text-balance">
              The Large Hadron Collider is one of the most demanding engineering projects humanity has undertaken. Twenty-seven kilometres of ring, 100 metres below ground, running at fractions of a degree above absolute zero.
            </p>
            <p className="text-mist leading-relaxed mb-6">
              When CERN's procurement office needed sub-millimetre precision components for the collider's instrumentation, they short-listed vendors who could combine documented process control with the ability to machine exotic alloys to tolerances most shops can't reliably hit.
            </p>
            <p className="text-mist leading-relaxed mb-6">
              Lilaas was one of them.
            </p>

            <blockquote className="my-12 pl-6 border-l-2 border-signal">
              <p className="font-display text-2xl text-fog leading-tight text-balance">
                "That project required accuracy down to hundredths of a millimetre. We measure every production batch against the original drawing on a CMM before release."
              </p>
              <p className="eyebrow mt-4">— Espen Bergsted Hoff, CEO</p>
            </blockquote>

            <h2 className="font-display text-2xl text-fog mt-14 mb-5">Why Horten</h2>
            <p className="text-mist leading-relaxed mb-6">
              Full-stack, in-house production means fewer hand-offs, shorter iteration loops, and complete traceability. Mechanics, electronics and software are designed, built and tested under one roof in Horten — which is why customers like CERN, Kongsberg Maritime and Wärtsilä can treat us like an extension of their own engineering teams.
            </p>

            <h2 className="font-display text-2xl text-fog mt-14 mb-5">Beyond the LHC</h2>
            <p className="text-mist leading-relaxed mb-10">
              Space, defence, medical, offshore — any industry where tolerance failure means catastrophic cost — ends up on our production floor. We're proud of where our parts end up.
            </p>

            <div className="flex flex-wrap gap-3 mt-12 pt-10 border-t border-white/10">
              <Link href="/contact">
                <Button variant="primary" arrow>Talk to engineering</Button>
              </Link>
              <Link href="/precision-mechanics">
                <Button variant="outline" arrow>See precision mechanics</Button>
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <p className="font-display text-2xl text-fog">{value}</p>
    </div>
  );
}
