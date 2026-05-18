"use client";

import { useEffect, useState, useCallback } from "react";
import {
  hasConsent,
  CONSENT_CATEGORIES,
  type ConsentCategory,
} from "@/lib/cookie-consent";

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const CATEGORY_LABELS: Record<
  ConsentCategory,
  { ro: string; en: string; descriptionRo: string; descriptionEn: string }
> = {
  necessary: {
    ro: "Necesare",
    en: "Necessary",
    descriptionRo:
      "Cookie-uri esentiale pentru functionarea platformei. Nu pot fi dezactivate.",
    descriptionEn:
      "Essential cookies for the platform to function. Cannot be disabled.",
  },
  functional: {
    ro: "Functionale",
    en: "Functional",
    descriptionRo:
      "Cookie-uri care permit functionalitati imbunatatite si personalizare.",
    descriptionEn:
      "Cookies that enable enhanced functionality and personalization.",
  },
  analytics: {
    ro: "Analiza",
    en: "Analytics",
    descriptionRo:
      "Cookie-uri care ne ajuta sa intelegem cum utilizati platforma.",
    descriptionEn: "Cookies that help us understand how you use the platform.",
  },
  marketing: {
    ro: "Marketing",
    en: "Marketing",
    descriptionRo:
      "Cookie-uri utilizate pentru a va afisa reclame relevante.",
    descriptionEn: "Cookies used to show you relevant ads.",
  },
};

function dispatchConsentChange() {
  window.dispatchEvent(new CustomEvent("blaj:consent-change"));
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [locale, setLocale] = useState<"ro" | "en">("ro");
  const [selected, setSelected] = useState<
    Record<ConsentCategory, boolean>
  >({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    if (!hasConsent()) {
      setShow(true);
    }
    const htmlLang = document.documentElement.lang;
    if (htmlLang === "en") setLocale("en");
  }, []);

  useEffect(() => {
    const handleReopen = () => {
      setPreferences(true);
      setShow(true);
    };
    window.addEventListener("blaj:open-cookie-preferences", handleReopen);
    return () => {
      window.removeEventListener(
        "blaj:open-cookie-preferences",
        handleReopen
      );
    };
  }, []);

  const handleAcceptAll = useCallback(async () => {
    const { acceptAll } = await import("@/lib/cookie-consent");
    acceptAll();
    setShow(false);
    dispatchConsentChange();
  }, []);

  const handleAcceptNecessary = useCallback(async () => {
    const { acceptNecessary } = await import("@/lib/cookie-consent");
    acceptNecessary();
    setShow(false);
    dispatchConsentChange();
  }, []);

  const handleAcceptCustom = useCallback(async () => {
    const { acceptCustom } = await import("@/lib/cookie-consent");
    acceptCustom(selected);
    setShow(false);
    setPreferences(false);
    dispatchConsentChange();
  }, [selected]);

  const toggleCategory = (cat: ConsentCategory) => {
    if (cat === "necessary") return;
    setSelected((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const isRo = locale === "ro";

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
        {!preferences ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 font-display">
                {isRo
                  ? "Acest site utilizeaza cookie-uri"
                  : "This site uses cookies"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {isRo
                  ? "Folosim cookie-uri pentru a asigura functionarea platformei, pentru analiza si marketing. Puteti alege ce categorii acceptati. Detalii in "
                  : "We use cookies to ensure the platform functions, for analytics and marketing. You can choose which categories to accept. Details in our "}
                <a
                  href={isRo ? "/ro/confidentialitate" : "/en/privacy"}
                  className="text-electric underline hover:text-electric-hover"
                >
                  {isRo
                    ? "Politica de confidentialitate"
                    : "Privacy Policy"}
                </a>
                .
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleAcceptAll}
                className="flex-1 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-accent-hover transition-colors"
              >
                {isRo ? "Accepta toate" : "Accept all"}
              </button>
              <button
                onClick={handleAcceptNecessary}
                className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                {isRo ? "Doar necesare" : "Only necessary"}
              </button>
              <button
                onClick={() => setPreferences(true)}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                {isRo ? "Personalizeaza" : "Customize"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 font-display">
                {isRo ? "Preferinte cookie" : "Cookie preferences"}
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                {isRo
                  ? "Selectati categoriile de cookie-uri pe care le acceptati."
                  : "Select the cookie categories you accept."}
              </p>
            </div>

            <div className="space-y-3">
              {CONSENT_CATEGORIES.map((cat) => (
                <div key={cat} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`cookie-${cat}`}
                    checked={selected[cat]}
                    disabled={cat === "necessary"}
                    onChange={() => toggleCategory(cat)}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-brand-accent accent-brand-accent"
                  />
                  <div>
                    <label
                      htmlFor={`cookie-${cat}`}
                      className={cn(
                        "text-sm font-medium",
                        cat === "necessary"
                          ? "text-neutral-500"
                          : "text-neutral-900"
                      )}
                    >
                      {isRo
                        ? CATEGORY_LABELS[cat].ro
                        : CATEGORY_LABELS[cat].en}
                    </label>
                    <p className="text-xs text-neutral-500">
                      {isRo
                        ? CATEGORY_LABELS[cat].descriptionRo
                        : CATEGORY_LABELS[cat].descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAcceptCustom}
                className="flex-1 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-accent-hover transition-colors"
              >
                {isRo ? "Salveaza preferintele" : "Save preferences"}
              </button>
              <button
                onClick={() => setPreferences(false)}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                {isRo ? "Inapoi" : "Back"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CookieSettingsLink() {
  const [label, setLabel] = useState("Setari cookie");

  useEffect(() => {
    const htmlLang = document.documentElement.lang;
    setLabel(htmlLang === "en" ? "Cookie settings" : "Setari cookie");
  }, []);

  const handleOpen = useCallback(() => {
    window.dispatchEvent(new CustomEvent("blaj:open-cookie-preferences"));
  }, []);

  return (
    <button
      onClick={handleOpen}
      className="text-sm text-neutral-500 underline hover:text-neutral-700 transition-colors"
    >
      {label}
    </button>
  );
}
