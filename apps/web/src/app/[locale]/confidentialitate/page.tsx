import { useLocale } from "next-intl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de confidentialitate",
};

export default function PrivacyPage() {
  const locale = useLocale();
  const isRo = locale === "ro";

  return (
    <div className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl prose prose-neutral prose-sm sm:prose-base">
        <h1>
          {isRo
            ? "Politica de Confidentialitate"
            : "Privacy Policy"}
        </h1>
        <p className="text-sm text-neutral-500">
          {isRo
            ? "Versiune 1.0 · 2026-05-17 · Conform GDPR, Norma 22/2021 ASF"
            : "Version 1.0 · 2026-05-17 · GDPR, ASF Norm 22/2021 compliant"}
        </p>

        <h2>{isRo ? "1. Cine suntem" : "1. Who we are"}</h2>
        <p>
          {isRo
            ? "Laz Romania SRL este operatorul platformei blaj.io, un broker de asigurari digital care compara oferte RCA si intermediaza emiterea politelor."
            : "Laz Romania SRL is the operator of the blaj.io platform, a digital insurance broker that compares RCA offers and mediates policy issuance."}
        </p>

        <h2>{isRo ? "2. Ce date colectam" : "2. What data we collect"}</h2>
        <p>
          {isRo
            ? "Colectam datele necesare pentru ofertare si emitere RCA: CNP, nume, adresa completa, email, telefon, date vehicul (VIN, marca, model, an, capacitate, etc.). Temeiul legal este obligatia legala conform Normei 22/2021 si Legii 132/2017."
            : "We collect data necessary for RCA quoting and issuance: personal ID, name, full address, email, phone, vehicle data (VIN, brand, model, year, capacity, etc.). The legal basis is the legal obligation under Norm 22/2021 and Law 132/2017."}
        </p>

        <h2>
          {isRo
            ? "3. Cum protejam datele"
            : "3. How we protect your data"}
        </h2>
        <p>
          {isRo
            ? "Datele sensibile (CNP, CI, IBAN) sunt criptate cu envelope encryption folosind Google Cloud KMS. Datele in tranzit sunt protejate prin TLS 1.3. Fiecare utilizator poate accesa doar propriile date (Row-Level Security)."
            : "Sensitive data (personal ID, ID card, IBAN) is encrypted with envelope encryption using Google Cloud KMS. Data in transit is protected by TLS 1.3. Each user can only access their own data (Row-Level Security)."}
        </p>

        <h2>
          {isRo
            ? "4. Cu cine impartasim datele"
            : "4. Who we share data with"}
        </h2>
        <p>
          {isRo
            ? "Datele sunt impartasite doar cu asiguratorii RCA (pentru emitere polita), Stripe (plati), Clerk (autentificare), Resend (email-uri) si Google Document AI (OCR, optional). Nu vindem datele tale."
            : "Data is only shared with RCA insurers (for policy issuance), Stripe (payments), Clerk (authentication), Resend (emails), and Google Document AI (OCR, optional). We do not sell your data."}
        </p>

        <h2>{isRo ? "5. Drepturile tale" : "5. Your rights"}</h2>
        <p>
          {isRo
            ? "Conform GDPR, ai drept de acces, rectificare, stergere, portabilitate, restricționare, opozitie si retragere a consimtamantului. Pentru exercitarea drepturilor: privacy@blaj.io."
            : "Under GDPR, you have the right to access, rectify, delete, port, restrict, object, and withdraw consent. To exercise your rights: privacy@blaj.io."}
        </p>

        <h2>{isRo ? "6. Contact" : "6. Contact"}</h2>
        <p>
          {isRo
            ? "DPO: Filip Blajiu. Email: privacy@blaj.io. Pentru plangeri: ANSPDCP (dataprotection.ro)."
            : "DPO: Filip Blajiu. Email: privacy@blaj.io. For complaints: ANSPDCP (dataprotection.ro)."}
        </p>
      </div>
    </div>
  );
}
