"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/cn";

const MAIN = [
  { href: "/control-levers", key: "controlLevers" },
  { href: "/precision-mechanics", key: "precision" },
  { href: "/industries/maritime", key: "industries" },
  { href: "/case-studies", key: "caseStudies" },
  { href: "/about", key: "about" },
  { href: "/support", key: "support" },
  { href: "/contact", key: "contact" },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo",
          scrolled
            ? "bg-ink/75 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="container-x flex items-center justify-between h-[72px]">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="Lilaas home"
          >
            <LilaasMark />
            <span className="font-display text-[17px] font-semibold tracking-tight text-fog group-hover:text-white transition-colors">
              LILAAS
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {MAIN.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-magnetic
                  className={cn(
                    "relative text-[13px] tracking-wide transition-colors hover:text-white",
                    active ? "text-fog" : "text-mist"
                  )}
                >
                  {t(item.key)}
                  {active && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-signal" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageToggle current={locale} />
            <button
              className="lg:hidden p-2 -mr-2 text-fog"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("close") : t("menu")}
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden bg-ink/95 backdrop-blur-xl pt-[72px]">
          <nav className="container-x py-10 flex flex-col">
            {MAIN.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-4 text-3xl font-display text-fog border-b border-white/5 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

function LilaasMark() {
  return (
    <svg
      viewBox="0 0 40 40"
      width="28"
      height="28"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.2" className="text-fog opacity-70" />
      <circle cx="20" cy="20" r="9" stroke="currentColor" strokeWidth="1.2" className="text-fog opacity-70" />
      <circle cx="20" cy="20" r="3" fill="#FF6B35" />
      <path d="M20 2 V10 M20 30 V38 M2 20 H10 M30 20 H38" stroke="currentColor" strokeWidth="1" className="text-fog opacity-40" />
    </svg>
  );
}
