import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.transparency" });
  return { title: t("title") };
}

export default async function TransparencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.transparency" });

  return (
    <section className="pt-40 lg:pt-52 pb-32">
      <div className="container-x max-w-3xl">
        <p className="eyebrow mb-6">{t("eyebrow")}</p>
        <h1 className="font-display text-display-lg text-fog mb-10 text-balance">
          {t("title")}
        </h1>
        <div className="space-y-6 text-mist leading-relaxed">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
          <p className="font-mono text-sm text-fog">{t("contact")}</p>
        </div>
      </div>
    </section>
  );
}
