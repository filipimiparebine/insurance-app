import { useLocale } from "next-intl";
import { Check } from "lucide-react";

export default function PricingPage() {
  const locale = useLocale();
  const isRo = locale === "ro";

  const tiers = [
    {
      name: isRo ? "RCA Standard" : "RCA Standard",
      price: isRo ? "de la 650 RON" : "from 650 RON",
      desc: isRo
        ? "Polița RCA obligatorie, exact ce ai nevoie pentru a circula legal."
        : "Mandatory RCA policy, exactly what you need to drive legally.",
      features: isRo
        ? ["Răspundere civilă conform legii", "Valabilitate 1-12 luni", "Asistență juridică inclusă", "Poliță electronică"]
        : ["Civil liability as per law", "1-12 months validity", "Legal assistance included", "Electronic policy"],
    },
    {
      name: isRo ? "RCA + Decontare Directă" : "RCA + Direct Settlement",
      price: isRo ? "de la 780 RON" : "from 780 RON",
      desc: isRo
        ? "Poți repara mașina la service-ul tău, iar asigurătorul tău plătește direct."
        : "Repair your car at your chosen service, your insurer pays directly.",
      popular: true,
      features: isRo
        ? ["Tot ce include RCA Standard", "Decontare directă la service", "Nu mai aștepți după dosar", "Evaluare rapidă"]
        : ["Everything in RCA Standard", "Direct settlement at service", "No waiting for claim file", "Fast assessment"],
    },
    {
      name: isRo ? "RCA + CASCO" : "RCA + CASCO",
      price: isRo ? "curând disponibil" : "coming soon",
      desc: isRo
        ? "Protecție completă pentru mașina ta. RCA + CASCO într-un singur loc."
        : "Full protection for your car. RCA + CASCO in one place.",
      comingSoon: true,
      features: isRo
        ? ["Tot ce include RCA", "Avarii proprii acoperite", "Furt și vandalism", "Dezastre naturale"]
        : ["Everything in RCA", "Own damage covered", "Theft and vandalism", "Natural disasters"],
    },
  ];

  return (
    <div className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display sm:text-4xl">
            {isRo ? "Prețuri transparente" : "Transparent pricing"}
          </h1>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            {isRo
              ? "Plătești exact prețul afișat. Fără comisioane ascunse, fără taxe suplimentare."
              : "You pay exactly the displayed price. No hidden fees, no extra charges."}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 shadow-sm ${
                tier.popular ? "border-brand-accent ring-2 ring-brand-accent" : "border-neutral-200"
              } ${tier.comingSoon ? "opacity-70" : ""}`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-accent px-4 py-1 text-xs font-semibold text-white">
                  {isRo ? "Cel mai ales" : "Most popular"}
                </span>
              )}
              <h3 className="text-xl font-semibold text-neutral-900 font-display">{tier.name}</h3>
              <p className="mt-2 text-sm text-neutral-500">{tier.desc}</p>
              <p className="mt-4 text-2xl font-bold text-neutral-900">{tier.price}</p>

              {!tier.comingSoon && (
                <a
                  href={`/${locale}/asigurare`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-accent-hover transition-colors"
                >
                  {isRo ? "Calculează oferte" : "Get quotes"}
                </a>
              )}

              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-neutral-600">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
