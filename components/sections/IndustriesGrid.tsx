"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { ArrowUpRight, Anchor, Shield, Activity, Rocket } from "lucide-react";
import { useGsap, prefersReducedMotion } from "@/lib/gsap";

const INDUSTRIES = [
  { slug: "maritime", icon: Anchor, tone: "signal", image: "/images/lilaas/maritime.webp" },
  { slug: "defence", icon: Shield, tone: "fog", image: "/images/lilaas/defence.webp" },
  { slug: "medical", icon: Activity, tone: "chart", image: "/images/lilaas/medicine.webp" },
  {
    slug: "space",
    icon: Rocket,
    tone: "copper",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=75",
  },
] as const;

export function IndustriesGrid() {
  const t = useTranslations("home");
  const ind = useTranslations("industries");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = useGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-industry-card]",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-44">
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
          {INDUSTRIES.map(({ slug, icon: Icon, tone, image }, i) => (
            <Link
              key={slug}
              href={`/industries/${slug}`}
              data-industry-card
              data-magnetic
              className="group relative block overflow-hidden rounded-2xl border border-white/8 bg-deep/60 aspect-[5/4]"
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
              <div className="relative h-full p-8 lg:p-10 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div
                    className={
                      "w-12 h-12 rounded-xl border flex items-center justify-center backdrop-blur-sm " +
                      (tone === "signal"
                        ? "border-signal/40 text-signal bg-signal/10"
                        : tone === "chart"
                        ? "border-chart/40 text-chart bg-chart/10"
                        : tone === "copper"
                        ? "border-copper/40 text-copper bg-copper/10"
                        : "border-fog/20 text-fog bg-fog/10")
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
