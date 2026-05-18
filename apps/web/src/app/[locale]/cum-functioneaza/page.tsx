import { useLocale } from "next-intl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cum functioneaza",
};

export default function HowItWorksPage() {
  const locale = useLocale();
  const isRo = locale === "ro";

  const steps = [
    {
      number: "1",
      title: isRo ? "Introduci datele vehiculului" : "Enter vehicle details",
      desc: isRo
        ? "Incarca o poza a talonului sau completeaza manual seria de sasiu (VIN). Iti vom completa automat datele masinii."
        : "Upload a photo of your registration certificate or enter the VIN manually. We'll auto-fill your vehicle data.",
    },
    {
      number: "2",
      title: isRo ? "Completezi datele proprietarului" : "Fill in owner details",
      desc: isRo
        ? "CNP, nume, adresa si datele de contact. Totul este criptat si protejat conform GDPR."
        : "Personal ID, name, address, and contact details. Everything is encrypted and GDPR-protected.",
    },
    {
      number: "3",
      title: isRo ? "Configurezi polita" : "Configure your policy",
      desc: isRo
        ? "Alege data de inceput si perioada de valabilitate (1-12 luni). Poti opta pentru decontare directa."
        : "Choose the start date and validity period (1-12 months). You can opt for direct settlement.",
    },
    {
      number: "4",
      title: isRo ? "Compari ofertele" : "Compare offers",
      desc: isRo
        ? "Vezi oferte de la 9 asiguratori RCA simultan. Alege cea mai buna oferta pentru tine."
        : "See offers from 9 RCA insurers simultaneously. Choose the best offer for you.",
    },
    {
      number: "5",
      title: isRo ? "Platesti online" : "Pay online",
      desc: isRo
        ? "Platesti cu Apple Pay, Google Pay sau card bancar prin Stripe. Procesare securizata PCI DSS Level 1."
        : "Pay with Apple Pay, Google Pay, or bank card via Stripe. PCI DSS Level 1 secure processing.",
    },
    {
      number: "6",
      title: isRo ? "Primesti polita" : "Receive your policy",
      desc: isRo
        ? "Polița RCA ajunge instant pe email. O gasesti si in contul tau, oricand."
        : "Your RCA policy arrives instantly via email. You can also find it in your account anytime.",
    },
  ];

  return (
    <div className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display sm:text-4xl">
          {isRo ? "Cum functioneaza" : "How it works"}
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          {isRo
            ? "De la incarcarea talonului pana la polita in inbox — totul dureaza maxim 3 minute."
            : "From uploading your registration to having the policy in your inbox — it takes at most 3 minutes."}
        </p>

        <div className="mt-12 space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent-soft text-sm font-bold text-brand-accent">
                {step.number}
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 font-display">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
