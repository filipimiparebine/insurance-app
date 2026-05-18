import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Shield, Zap, Users, ArrowRight } from "lucide-react";

export default function HomePage() {
  const t = useTranslations("landing");
  const security = useTranslations("security");
  const locale = useLocale();

  const features = [
    {
      icon: Zap,
      title: t("feature_speed_title"),
      desc: t("feature_speed_desc"),
    },
    {
      icon: Shield,
      title: security("title"),
      desc: security("encryption"),
    },
    {
      icon: Users,
      title: t("feature_support_title"),
      desc: t("feature_support_desc"),
    },
  ] satisfies Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: string;
  }>;

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-accent-soft to-white px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 font-display sm:text-5xl lg:text-6xl">
            {t("hero")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            {t("subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/${locale}/asigurare`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 text-base font-semibold text-white hover:bg-brand-accent-hover transition-colors shadow-sm"
            >
              {t("cta_primary")}
              <ArrowRight size={18} />
            </Link>
            <Link
              href={`/${locale}/cum-functioneaza`}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 text-base font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              {t("cta_secondary")}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-accent">
              {t("why_us")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200"
              >
                <feature.icon className="mb-4 h-8 w-8 text-brand-accent" />
                <h3 className="font-semibold text-neutral-900 font-display">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-accent">
            {t("trust_title")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
            <span className="text-lg font-medium text-neutral-300">
              {t("trust_badges")}
            </span>
          </div>
          <p className="mt-8 text-sm leading-relaxed text-neutral-400">
            {t("trust_description")}
          </p>
        </div>
      </section>
    </div>
  );
}
