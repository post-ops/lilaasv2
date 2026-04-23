"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LanguageToggle({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  function swap(to: "en" | "no") {
    if (to === current) return;
    router.replace(pathname, { locale: to });
  }

  return (
    <div
      role="group"
      aria-label={t("languageToggleAria")}
      className="hidden sm:flex items-center gap-0 rounded-full border border-white/10 p-0.5 text-[11px] font-mono"
    >
      {(["en", "no"] as const).map((l) => (
        <button
          key={l}
          onClick={() => swap(l)}
          aria-pressed={current === l}
          className={cn(
            "px-3 py-1 rounded-full transition-all duration-300 uppercase tracking-widest",
            current === l ? "bg-signal text-ink" : "text-mist hover:text-fog"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
