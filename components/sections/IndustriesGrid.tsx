"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { ArrowUpRight, Anchor, Shield, Activity, Rocket } from "lucide-react";
import { useReveal } from "@/components/ui/useReveal";

const INDUSTRIES = [
  { slug: "maritime", icon: Anchor, tone: "signal", image: "/images/industries/maritime.webp" },
  { slug: "defence", icon: Shield, tone: "fog", image: "/images/industries/defence.webp" },
  { slug: "medical", icon: Activity, tone: "chart", image: "/images/industries/medical.webp" },
  { slug: "space", icon: Rocket, tone: "copper", image: "/images/industries/space.webp" },
] as const;

export function IndustriesGrid() {
  const t = useTranslations("home");
  const ind = useTranslations("industries");
  const tExtra = useTranslations("homeExtra.industries");
  const sectionRef = useReveal<HTMLElement>();
  const gridRef = useRef<HTMLDivElement>(null);

  // Card image parallax: as user scrolls past each card, translate the inner
  // <img> up/down slightly to create depth.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    function loop() {
      const cards = grid!.querySelectorAll<HTMLElement>("[data-industry-card]");
      const vh = window.innerHeight;
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const delta = (center - vh / 2) / vh; // -1..1 roughly
        const img = card.querySelector<HTMLElement>("[data-industry-img]");
        if (img) img.style.transform = `translateY(${delta * -8}%)`;
      });
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Sweep-on-enter — add .card-sweep once per card when it first crosses the
  // viewport. The CSS class runs a single shine keyframe.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = grid.querySelectorAll<HTMLElement>("[data-industry-card]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("card-sweep");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.3 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-44">
      <div className="container-x">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-24 mb-20">
          <div>
            <p className="section-index mb-6">{tExtra("indexLabel")}</p>
            <p className="eyebrow mb-5 text-mist/70">{t("industriesEyebrow")}</p>
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

        <div ref={gridRef} className="grid md:grid-cols-2 gap-5">
          {INDUSTRIES.map(({ slug, icon: Icon, tone, image }, i) => (
            <Link
              key={slug}
              href={`/industries/${slug}`}
              data-industry-card
              data-reveal="out"
              data-magnetic
              className="group relative block overflow-hidden rounded-2xl border border-white/8 bg-deep/60 aspect-[5/4]"
            >
              <div data-industry-img className="absolute inset-0 will-change-transform" style={{ inset: "-8% 0" }}>
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
                />
              </div>
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
                  <p className="eyebrow mb-3 inline-block relative">
                    <span>0{i + 1}</span>
                    <span className="absolute left-0 -bottom-1 h-px bg-signal origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full" />
                  </p>
                  <h3 className="font-display text-3xl text-fog mb-3 group-hover:translate-x-1 transition-transform duration-500 ease-out-expo">
                    {ind(`${slug}.name`)}
                  </h3>
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
