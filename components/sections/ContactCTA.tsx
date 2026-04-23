"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";

export function ContactCTA() {
  const t = useTranslations("home");
  return (
    <section className="relative py-40 lg:py-52">
      <div className="container-x text-center">
        <p className="eyebrow mb-6">{t("ctaEyebrow")}</p>
        <div className="max-w-4xl mx-auto">
          <SplitReveal
            text={t("ctaTitle")}
            as="h2"
            className="font-display text-display-lg text-fog text-balance"
            stagger={0.012}
          />
        </div>
        <p className="mt-10 text-mist max-w-xl mx-auto font-mono text-sm uppercase tracking-widest">
          {t("ctaSub")}
        </p>
        <div className="mt-12 flex justify-center">
          <Link href="/contact">
            <Button variant="primary" size="lg" arrow>
              {t("ctaButton")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
