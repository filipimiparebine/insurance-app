"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const localeNames: Record<string, string> = {
  ro: "RO",
  en: "EN",
};

export function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const otherLocale = locale === "ro" ? "en" : "ro";
  const otherPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const navLinks = [
    { href: `/${locale}/cum-functioneaza`, label: locale === "ro" ? "Cum functioneaza" : "How it works" },
    { href: `/${locale}/preturi`, label: locale === "ro" ? "Preturi" : "Pricing" },
    { href: `/${locale}/intrebari-frecvente`, label: locale === "ro" ? "FAQ" : "FAQ" },
    { href: `/${locale}/contact`, label: locale === "ro" ? "Contact" : "Contact" },
    { href: `/${locale}/securitate`, label: locale === "ro" ? "Securitate" : "Security" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href={`/${locale}`}
          className="text-xl font-bold tracking-tight text-neutral-900 font-display"
        >
          blaj.io
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={otherPath}
            className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            {localeNames[otherLocale]}
          </Link>
          <Link
            href={`/${locale}/asigurare`}
            className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-accent-hover transition-colors"
          >
            {locale === "ro" ? "Obține oferte" : "Get quotes"}
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-neutral-600"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={otherPath}
              onClick={() => setMobileOpen(false)}
              className="self-start rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              {localeNames[otherLocale]}
            </Link>
            <Link
              href={`/${locale}/asigurare`}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-accent-hover transition-colors text-center"
            >
              {locale === "ro" ? "Obține oferte" : "Get quotes"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
