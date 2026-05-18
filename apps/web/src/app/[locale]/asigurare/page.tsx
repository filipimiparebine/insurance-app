"use client";

import { Wizard } from "@blaj/ui";
import { useLocale } from "next-intl";

export default function InsurancePage() {
  const locale = useLocale();
  const isRo = locale === "ro";

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <h1 className="text-lg font-semibold text-primary font-display">
            {isRo ? "Ofertare RCA" : "RCA Quoting"}
          </h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <div className="rounded-2xl border border-neutral-200 bg-surface p-6 shadow-sm sm:p-8">
          <Wizard />
        </div>
      </div>
    </div>
  );
}
