import { useLocale } from "next-intl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni si conditii",
};

export default function TermsPage() {
  const locale = useLocale();
  const isRo = locale === "ro";

  return (
    <div className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl prose prose-neutral prose-sm sm:prose-base">
        <h1>
          {isRo
            ? "Termeni si Conditii de Utilizare"
            : "Terms and Conditions of Use"}
        </h1>
        <p className="text-sm text-neutral-500">
          {isRo ? "Versiune 1.0 · 2026-05-17" : "Version 1.0 · 2026-05-17"}
        </p>

        <h2>{isRo ? "1. Definitii" : "1. Definitions"}</h2>
        <p>
          {isRo
            ? "blaj.io (aplicatie.ta) este o platforma digitala de brokeraj in asigurari operata de Laz Romania SRL, broker de asigurari inregistrat la ASF."
            : "blaj.io (aplicatie.ta) is a digital insurance brokerage platform operated by Laz Romania SRL, an ASF-registered insurance broker."}
        </p>

        <h2>{isRo ? "2. Serviciul" : "2. The Service"}</h2>
        <p>
          {isRo
            ? "Platforma compara ofertele RCA de la 9 asiguratori autorizati ASF si permite achizitia online a politei RCA. Laz Romania actioneaza exclusiv ca intermediar intre tine si asigurator. Nu suntem asigurator si nu oferim consultanta personalizata."
            : "The platform compares RCA offers from 9 ASF-authorized insurers and enables online RCA policy purchase. Laz Romania acts exclusively as an intermediary between you and the insurer. We are not an insurer and do not provide personalized consultancy."}
        </p>

        <h2>{isRo ? "3. Contul de utilizator" : "3. User account"}</h2>
        <p>
          {isRo
            ? "Pentru a utiliza serviciul, trebuie sa creezi un cont cu o adresa de email valida. Contul este personal si netransmisibil. Esti responsabil pentru pastrarea confidentialitatii datelor de acces."
            : "To use the service, you must create an account with a valid email address. The account is personal and non-transferable. You are responsible for maintaining the confidentiality of your access credentials."}
        </p>

        <h2>{isRo ? "4. Ofertele si politele" : "4. Offers and policies"}</h2>
        <p>
          {isRo
            ? "Preturile afisate includ comisionul de brokeraj si toate taxele legale. Oferta selectata devine ferma doar dupa confirmarea platii. Unii asiguratori pot refuza emiterea pentru anumite vehicule."
            : "Displayed prices include the brokerage commission and all legal taxes. The selected offer becomes firm only after payment confirmation. Some insurers may refuse issuance for certain vehicles."}
        </p>

        <h2>{isRo ? "5. Plata" : "5. Payment"}</h2>
        <p>
          {isRo
            ? "Acceptam card bancar (Visa, Mastercard, Maestro), Apple Pay si Google Pay. Toate platile sunt procesate de Stripe (PCI DSS Level 1). Laz Romania nu stocheaza datele cardului tau."
            : "We accept bank cards (Visa, Mastercard, Maestro), Apple Pay, and Google Pay. All payments are processed by Stripe (PCI DSS Level 1). Laz Romania does not store your card details."}
        </p>

        <h2>
          {isRo ? "6. Dreptul de retragere" : "6. Right of withdrawal"}
        </h2>
        <p>
          {isRo
            ? "Ai dreptul de a te retrage din contract in termen de 14 zile calendaristice de la incheiere, daca polita nu a intrat inca in vigoare. Rambursarea este integrala."
            : "You have the right to withdraw from the contract within 14 calendar days of conclusion, if the policy has not yet entered into force. The refund is full."}
        </p>

        <h2>
          {isRo ? "7. Obligatiile utilizatorului" : "7. User obligations"}
        </h2>
        <p>
          {isRo
            ? "Te angajezi sa furnizezi date corecte si complete. Datele incorecte pot duce la invalidarea politei. Nu utiliza platforma in scopuri frauduloase."
            : "You commit to providing accurate and complete data. Incorrect data may lead to policy invalidation. Do not use the platform for fraudulent purposes."}
        </p>

        <h2>
          {isRo ? "8. Limitarea raspunderii" : "8. Limitation of liability"}
        </h2>
        <p>
          {isRo
            ? "Nu raspundem pentru refuzul unui asigurator de a emite polita, conditiile specifice ale contractului de asigurare, sau litigiile legate de daune."
            : "We are not liable for an insurer's refusal to issue a policy, the specific terms of the insurance contract, or claims-related disputes."}
        </p>

        <h2>
          {isRo ? "9. Legea aplicabila" : "9. Applicable law"}
        </h2>
        <p>
          {isRo
            ? "Acesti termeni sunt guvernati de legile Romaniei. Orice litigiu va fi solutionat de instantele competente din Romania."
            : "These terms are governed by the laws of Romania. Any dispute will be resolved by the competent courts of Romania."}
        </p>

        <h2>{isRo ? "10. Contact" : "10. Contact"}</h2>
        <p>
          {isRo
            ? "Pentru intrebari: support@blaj.io. DPO: privacy@blaj.io."
            : "For questions: support@blaj.io. DPO: privacy@blaj.io."}
        </p>
      </div>
    </div>
  );
}
