"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { CookieSettingsLink } from "@/components/cookie-banner";

export function Footer() {
  const locale = useLocale();
  const isRo = locale === "ro";

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 font-display">
              blaj.io
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500 max-w-xs">
              {isRo
                ? "Platforma de brokeraj in asigurari RCA. Simplu, rapid, transparent."
                : "RCA insurance brokerage platform. Simple, fast, transparent."}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 font-display">
              {isRo ? "Legal" : "Legal"}
            </h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href={
                    isRo ? `/${locale}/termeni` : `/${locale}/terms`
                  }
                  className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {isRo ? "Termeni si conditii" : "Terms and Conditions"}
                </Link>
              </li>
              <li>
                <Link
                  href={
                    isRo
                      ? `/${locale}/confidentialitate`
                      : `/${locale}/privacy`
                  }
                  className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {isRo
                    ? "Politica de confidentialitate"
                    : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link
                  href={
                    isRo ? `/${locale}/cookies` : `/${locale}/cookies`
                  }
                  className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {isRo
                    ? "Politica de cookie-uri"
                    : "Cookie Policy"}
                </Link>
              </li>
              <li>
                <Link
                  href={
                    isRo
                      ? `/${locale}/securitate`
                      : `/${locale}/security`
                  }
                  className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {isRo ? "Securitate" : "Security"}
                </Link>
              </li>
              <li>
                <Link
                  href={
                    isRo
                      ? `/${locale}/accesibilitate`
                      : `/${locale}/accessibility`
                  }
                  className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {isRo
                    ? "Accesibilitate"
                    : "Accessibility"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 font-display">
              {isRo ? "Contact" : "Contact"}
            </h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href="mailto:support@blaj.io"
                  className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  support@blaj.io
                </a>
              </li>
              <li>
                <a
                  href="mailto:privacy@blaj.io"
                  className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  privacy@blaj.io
                </a>
              </li>
              <li className="pt-1">
                <CookieSettingsLink />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-6">
          <p className="text-center text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} Laz Romania SRL.{" "}
            {isRo
              ? "Toate drepturile rezervate."
              : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
