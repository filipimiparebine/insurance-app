import { useLocale } from "next-intl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accesibilitate",
};

export default function AccessibilityPage() {
  const locale = useLocale();
  const isRo = locale === "ro";

  return (
    <div className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display sm:text-4xl">
          {isRo
            ? "Declaratie de accesibilitate"
            : "Accessibility statement"}
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          {isRo
            ? "blaj.io se angajeaza sa ofere o experienta digitala accesibila tuturor utilizatorilor, inclusiv persoanelor cu dizabilitati."
            : "blaj.io is committed to providing a digital experience accessible to all users, including people with disabilities."}
        </p>

        <div className="mt-12 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 font-display">
              {isRo ? "Standardul aplicat" : "Applied standard"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {isRo
                ? "Ne straduim sa respectam standardul WCAG 2.2 nivel AA (Web Content Accessibility Guidelines), standardul international pentru accesibilitatea web."
                : "We strive to meet WCAG 2.2 Level AA (Web Content Accessibility Guidelines), the international standard for web accessibility."}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-900 font-display">
              {isRo ? "Masuri implementate" : "Implemented measures"}
            </h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-neutral-600">
              {(isRo
                ? [
                    "Contrast ridicat intre text si fundal",
                    "Navigare completa prin tastatura",
                    "Etichete ARIA pentru elementele interactive",
                    "Structura semantica a paginilor (heading-uri, landmark-uri)",
                    "Text alternativ pentru imagini",
                    "Suport pentru screen readere",
                    "Design responsive (mobil, tableta, desktop)",
                  ]
                : [
                    "High contrast between text and background",
                    "Full keyboard navigation",
                    "ARIA labels for interactive elements",
                    "Semantic page structure (headings, landmarks)",
                    "Alternative text for images",
                    "Screen reader support",
                    "Responsive design (mobile, tablet, desktop)",
                  ]
              ).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-900 font-display">
              {isRo ? "Limitari cunoscute" : "Known limitations"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {isRo
                ? "Lucram continuu la imbunatatirea accesibilitatii. Daca intampini dificultati, te rugam sa ne contactezi la support@blaj.io."
                : "We are continuously working to improve accessibility. If you encounter difficulties, please contact us at support@blaj.io."}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-900 font-display">
              {isRo ? "Feedback" : "Feedback"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {isRo
                ? "Feedback-ul tau este important. Daca ai sugestii pentru imbunatatirea accesibilitatii, scrie-ne la support@blaj.io."
                : "Your feedback is important. If you have suggestions for improving accessibility, write to us at support@blaj.io."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
