import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ClerkProvider } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieBanner } from "@/components/cookie-banner";
import { PostHogProvider } from "@/lib/posthog";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s — blaj.io",
    default: "blaj.io — Asigurari fara labirint",
  },
  description:
    "Compara 9 asiguratori RCA in 3 minute. Platesti cu Apple Pay sau card. Polita ajunge instant pe email.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ro" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body className="flex min-h-screen flex-col bg-neutral-50 font-body text-neutral-900 antialiased">
          <NextIntlClientProvider messages={messages}>
            <PostHogProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CookieBanner />
            </PostHogProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
