import { useLocale } from "next-intl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de cookie-uri",
};

export default function CookiePolicyPage() {
  const locale = useLocale();
  const isRo = locale === "ro";

  return (
    <div className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl prose prose-neutral prose-sm sm:prose-base">
        <h1>
          {isRo ? "Politica de Cookie-uri" : "Cookie Policy"}
        </h1>
        <p className="text-sm text-neutral-500">
          {isRo
            ? "Versiune 1.0 · 2026-05-17 · Conform GDPR si ePrivacy Directive"
            : "Version 1.0 · 2026-05-17 · GDPR and ePrivacy Directive compliant"}
        </p>

        <h2>{isRo ? "1. Ce sunt cookie-urile" : "1. What are cookies"}</h2>
        <p>
          {isRo
            ? "Un cookie este un fisier text de mici dimensiuni pe care un site web il salveaza pe dispozitivul tau atunci cand il vizitezi."
            : "A cookie is a small text file that a website saves on your device when you visit it."}
        </p>

        <h2>
          {isRo
            ? "2. Cookie-uri necesare (esentiale)"
            : "2. Necessary (essential) cookies"}
        </h2>
        <p>
          {isRo
            ? "Strict necesare pentru functionarea platformei. Nu pot fi dezactivate. Acestea includ cookie-uri de sesiune Clerk (__session, __clerk_db_jwt), cookie-ul de consimtamant (cookie_consent) si token-ul CSRF."
            : "Strictly necessary for the platform to function. Cannot be disabled. These include Clerk session cookies (__session, __clerk_db_jwt), the consent cookie (cookie_consent), and the CSRF token."}
        </p>

        <h2>
          {isRo
            ? "3. Cookie-uri functionale"
            : "3. Functional cookies"}
        </h2>
        <p>
          {isRo
            ? "Permit platformei sa-si aminteasca alegerile tale (preferinta de limba NEXT_LOCALE, progres in formulare). Opționale, necesita consimtamant."
            : "Allow the platform to remember your choices (NEXT_LOCALE language preference, form progress). Optional, require consent."}
        </p>

        <h2>
          {isRo
            ? "4. Cookie-uri de analytics"
            : "4. Analytics cookies"}
        </h2>
        <p>
          {isRo
            ? "Folosim PostHog (EU cloud, IP anonimizat) pentru a intelege cum e utilizata platforma. Cookie-urile PostHog (ph_*) sunt activate doar cu consimtamantul tau."
            : "We use PostHog (EU cloud, anonymized IP) to understand how the platform is used. PostHog cookies (ph_*) are only activated with your consent."}
        </p>

        <h2>
          {isRo
            ? "5. Cookie-uri de marketing"
            : "5. Marketing cookies"}
        </h2>
        <p>
          {isRo
            ? "Setate de partenerii de publicitate (Google Ads _gcl_*, Meta Pixel _fbp) pentru a masura eficienta campaniilor. Activate doar cu consimtamant."
            : "Set by advertising partners (Google Ads _gcl_*, Meta Pixel _fbp) to measure campaign effectiveness. Only activated with consent."}
        </p>

        <h2>
          {isRo
            ? "6. Gestionarea preferintelor"
            : "6. Managing preferences"}
        </h2>
        <p>
          {isRo
            ? "Poti schimba preferintele oricand din link-ul Setari cookie din subsolul paginii sau din setarile browser-ului tau."
            : "You can change your preferences at any time from the Cookie settings link in the page footer or from your browser settings."}
        </p>

        <h2>{isRo ? "7. Contact" : "7. Contact"}</h2>
        <p>
          privacy@blaj.io · DPO: Filip Blajiu
        </p>
      </div>
    </div>
  );
}
