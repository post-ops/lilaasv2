"use client";

import { useTranslations } from "next-intl";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const ROLES = [
  { title: "CNC Operator", discipline: "Production", type: "Full-time" },
  { title: "Mechanical Engineer — Control Levers", discipline: "R&D", type: "Full-time" },
  { title: "Firmware Engineer", discipline: "Electronics", type: "Full-time" },
  { title: "Quality Engineer", discipline: "Operations", type: "Full-time" },
];

export function CareersView() {
  const t = useTranslations("careers");
  return (
    <>
      <section className="pt-40 lg:pt-52 pb-20">
        <div className="container-x">
          <p className="eyebrow mb-6">{t("eyebrow")}</p>
          <SplitReveal
            text={t("title")}
            as="h1"
            className="font-display text-display-xl text-fog max-w-4xl text-balance"
            stagger={0.012}
          />
          <p className="text-lg text-mist leading-relaxed max-w-2xl mt-10">{t("sub")}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <p className="eyebrow mb-8">Open roles</p>
          <div className="divide-y divide-white/5 border-y border-white/5">
            {ROLES.map((r) => (
              <div key={r.title} className="grid md:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center py-8">
                <p className="font-display text-2xl text-fog">{r.title}</p>
                <p className="text-mist text-sm">{r.discipline}</p>
                <Badge>{r.type}</Badge>
                <a href="mailto:hr@lilaas.no">
                  <Button variant="ghost" arrow>Apply</Button>
                </a>
              </div>
            ))}
          </div>

          <Card className="mt-16 p-10 lg:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">Don't see your role?</p>
              <p className="font-display text-2xl text-fog text-balance max-w-xl">{t("cta")}</p>
            </div>
            <a href="mailto:hr@lilaas.no">
              <Button variant="primary" arrow>hr@lilaas.no</Button>
            </a>
          </Card>
        </div>
      </section>
    </>
  );
}
