import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/providers/Cursor";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { PageTransition } from "@/components/ui/PageTransition";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "no")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SmoothScroll>
        <Cursor />
        <PageTransition />
        <Nav />
        <main id="content">{children}</main>
        <Footer />
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}
