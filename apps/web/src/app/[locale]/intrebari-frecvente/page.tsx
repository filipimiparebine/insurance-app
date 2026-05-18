"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { ChevronDown } from "lucide-react";

const faqsRo = [
  { q: "Ce este RCA și de ce am nevoie?", a: "RCA (Răspunderea Civilă Auto) este asigurarea obligatorie pentru orice vehicul care circulă pe drumurile publice din România. Fără RCA nu poți circula legal." },
  { q: "Cât durează tot procesul?", a: "Maxim 3 minute. Introduci datele, compari ofertele, alegi și plătești. Polița ajunge instant pe email." },
  { q: "Ce documente am nevoie?", a: "Talonul (certificatul de înmatriculare) și cartea de identitate. Le poți fotografia și încărca direct în aplicație." },
  { q: "Cum se face plata?", a: "Acceptăm Apple Pay, Google Pay și card bancar (Visa, Mastercard). Procesarea este securizată prin Stripe, PCI DSS Level 1." },
  { q: "Când intră în vigoare polița?", a: "Poți alege data de început — de la 1 până la 60 de zile de la data curentă." },
  { q: "Pot anula polița?", a: "Ai dreptul de retragere în termen de 14 zile de la încheiere, cu rambursare integrală." },
  { q: "Ce se întâmplă dacă am un accident?", a: "Deschizi un dosar de daună direct la asigurătorul ales. Noi te ghidăm prin proces pas cu pas." },
  { q: "Datele mele sunt în siguranță?", a: "Da. Folosim criptare AES-256, suntem conformi GDPR și autorizați ASF." },
];

const faqsEn = [
  { q: "What is RCA insurance?", a: "RCA (Civil Auto Liability) is the mandatory insurance for any vehicle on Romanian public roads. You cannot drive legally without it." },
  { q: "How long does the process take?", a: "Maximum 3 minutes. Enter your details, compare offers, choose, and pay. The policy arrives instantly via email." },
  { q: "What documents do I need?", a: "Your vehicle registration certificate and ID card. You can photograph and upload them directly in the app." },
  { q: "How do I pay?", a: "We accept Apple Pay, Google Pay, and bank cards (Visa, Mastercard). Processing is secured via Stripe, PCI DSS Level 1." },
  { q: "When does the policy take effect?", a: "You choose the start date — from 1 to 60 days from the current date." },
  { q: "Can I cancel the policy?", a: "You have a 14-day withdrawal right from the policy conclusion, with full refund." },
  { q: "What if I have an accident?", a: "You file a claim directly with your chosen insurer. We guide you through the process step by step." },
  { q: "Is my data safe?", a: "Yes. We use AES-256 encryption, are GDPR compliant, and ASF authorized." },
];

export default function FAQPage() {
  const locale = useLocale();
  const isRo = locale === "ro";
  const faqs = isRo ? faqsRo : faqsEn;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display sm:text-4xl">
          {isRo ? "Întrebări frecvente" : "Frequently Asked Questions"}
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          {isRo ? "Răspunsuri la cele mai comune întrebări." : "Answers to the most common questions."}
        </p>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                {faq.q}
                <ChevronDown
                  className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-sm leading-relaxed text-neutral-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
