"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight } from "lucide-react";

type Post = { date: string; tag: string; title: string; body: string };

export function NewsView() {
  const t = useTranslations("news");
  const posts = t.raw("posts") as Post[];

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
            className="font-display text-display-xl text-fog text-balance max-w-4xl"
            stagger={0.012}
          />
          <Reveal variant="up" delay={300}>
            <p className="text-lg text-mist leading-relaxed max-w-2xl mt-10">{t("sub")}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-12">
        <div className="container-x">
          <div className="divide-y divide-white/5 border-y border-white/5">
            {posts.map((p, i) => (
              <Reveal key={i} variant="up" delay={i * 90}>
                <article className="py-10 grid md:grid-cols-[130px_1fr_120px] gap-6 items-start group cursor-pointer hover:bg-deep/20 px-4 -mx-4 rounded-xl transition-colors duration-300">
                  <p className="font-mono text-xs text-mist uppercase tracking-widest pt-1">{p.date}</p>
                  <div>
                    <div className="mb-3"><Badge>{p.tag}</Badge></div>
                    <h3 className="font-display text-2xl text-fog mb-3 text-balance">{p.title}</h3>
                    <p className="text-mist text-sm max-w-xl">{p.body}</p>
                  </div>
                  <div className="flex justify-end pt-2">
                    <ArrowUpRight
                      size={20}
                      className="text-mist group-hover:text-signal group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500"
                    />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
