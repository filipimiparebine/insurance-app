import Link from "next/link";
import { useLocale } from "next-intl";

export default function NotFound() {
  const locale = useLocale();
  const isRo = locale === "ro";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-900 font-display">
          404
        </h1>
        <p className="mt-4 text-neutral-600">
          {isRo
            ? "Pagina pe care o cauti nu exista."
            : "The page you're looking for doesn't exist."}
        </p>
        <Link
          href={`/${locale}`}
          className="mt-6 inline-block rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-accent-hover transition-colors"
        >
          {isRo ? "Inapoi acasa" : "Back home"}
        </Link>
      </div>
    </div>
  );
}
