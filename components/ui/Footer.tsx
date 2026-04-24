import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 border-t border-white/5 bg-deep/40">
      <div className="container-x py-20 grid gap-14 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <span className="font-display text-lg font-semibold tracking-tight text-fog" aria-label="Lilaas">
            L
            <span className="relative inline-block" aria-hidden>
              {"ı"}
              <span
                className="absolute left-1/2 -translate-x-1/2 rounded-full bg-signal"
                style={{
                  width: "0.2em",
                  height: "0.2em",
                  top: "-0.08em",
                  boxShadow: "0 0 0.28em rgba(255,107,53,0.6)",
                }}
              />
            </span>
            laas
          </span>
          <p className="mt-6 text-sm text-mist leading-relaxed">{t("tagline")}</p>
          <p className="mt-4 text-xs text-mist/70">{t("built")}</p>
        </div>

        <div>
          <p className="eyebrow mb-4">Products</p>
          <ul className="space-y-3 text-sm text-mist">
            <li><Link href="/control-levers" className="hover:text-fog">{nav("controlLevers")}</Link></li>
            <li><Link href="/precision-mechanics" className="hover:text-fog">{nav("precision")}</Link></li>
            <li><Link href="/support" className="hover:text-fog">{nav("support")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Company</p>
          <ul className="space-y-3 text-sm text-mist">
            <li><Link href="/about" className="hover:text-fog">{nav("about")}</Link></li>
            <li><Link href="/case-studies" className="hover:text-fog">{nav("caseStudies")}</Link></li>
            <li><Link href="/news" className="hover:text-fog">{nav("news")}</Link></li>
            <li><Link href="/careers" className="hover:text-fog">{nav("careers")}</Link></li>
            <li><Link href="/contact" className="hover:text-fog">{nav("contact")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-3 text-sm text-mist">
            <li>Kongeveien 75<br />3188 Horten, Norway</li>
            <li><a href="tel:+4741633000" className="hover:text-fog">+47 416 33 000</a></li>
            <li><a href="mailto:lilaas@lilaas.no" className="hover:text-fog">lilaas@lilaas.no</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-x py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-mist/70">
          <p>{t("copyright", { year })} · {t("rights")}</p>
          <div className="flex gap-6">
            <Link href="/legal/terms" className="hover:text-fog">{t("terms")}</Link>
            <Link href="/legal/transparency" className="hover:text-fog">{t("transparency")}</Link>
            <Link href="/legal/privacy" className="hover:text-fog">{t("privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
