import { useLocale } from "next-intl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const locale = useLocale();
  const isRo = locale === "ro";

  return (
    <div className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display sm:text-4xl">
          {isRo ? "Contact" : "Contact"}
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          {isRo
            ? "Suntem aici sa te ajutam. Alege metoda care iti este cea mai convenabila."
            : "We're here to help. Choose the method that's most convenient for you."}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <h3 className="font-semibold text-neutral-900 font-display">
              {isRo ? "Suport clienti" : "Customer support"}
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              <a
                href="mailto:support@blaj.io"
                className="text-electric hover:underline"
              >
                support@blaj.io
              </a>
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              {isRo
                ? "Raspundem in maxim 24 de ore in zilele lucratoare."
                : "We respond within 24 hours on business days."}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <h3 className="font-semibold text-neutral-900 font-display">
              {isRo ? "Confidentialitate / DPO" : "Privacy / DPO"}
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              <a
                href="mailto:privacy@blaj.io"
                className="text-electric hover:underline"
              >
                privacy@blaj.io
              </a>
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              {isRo
                ? "DPO: Filip Blajiu. Pentru orice solicitare legata de datele personale."
                : "DPO: Filip Blajiu. For any request regarding your personal data."}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <h3 className="font-semibold text-neutral-900 font-display">
              ASF
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              {isRo
                ? "Autoritatea de Supraveghere Financiara"
                : "Financial Supervisory Authority"}
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              <a
                href="https://asfromania.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-electric hover:underline"
              >
                asfromania.ro
              </a>
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <h3 className="font-semibold text-neutral-900 font-display">
              ANSPDCP
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              {isRo
                ? "Autoritatea pentru protectia datelor"
                : "Data Protection Authority"}
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              <a
                href="https://dataprotection.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-electric hover:underline"
              >
                dataprotection.ro
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
