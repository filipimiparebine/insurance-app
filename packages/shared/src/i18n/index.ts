import { ro } from './translations/ro';
import { en } from './translations/en';

export { ro, en };

export type Locale = 'ro' | 'en';

function resolvePath(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

let currentLocale: Locale = 'ro';
const locales = { ro, en };

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(path: string, params?: Record<string, string | number>): string {
  const translations = locales[currentLocale];
  const template = resolvePath(translations as unknown as Record<string, unknown>, path);
  if (!template) {
    console.warn(`[i18n] Missing translation: ${path} (${currentLocale})`);
    return path;
  }
  return interpolate(template, params);
}

/**
 * Pluralization for Romanian (3 forms: one, few, many)
 * and English (2 forms: singular, plural).
 *
 * Ro rule for months ("luni"):
 *   n=1 → "1 lună"
 *   n=2-19* → "3 luni" (few)
 *   n≥20 → "12 luni" (many)
 *
 * For simplicity, the "luni" translation is already invariant and
 * we just interpolate the number.
 */
export function pluralize(
  n: number,
  locale: Locale,
  forms: { ro_one?: string; ro_few?: string; ro_many?: string; en_one?: string; en_other?: string },
): string {
  if (locale === 'ro') {
    if (n === 1) return forms.ro_one ?? forms.ro_few ?? String(n);
    if (n > 1 && n < 20) return forms.ro_few ?? forms.ro_many ?? String(n);
    return forms.ro_many ?? forms.ro_few ?? String(n);
  }
  // English
  return n === 1 ? (forms.en_one ?? forms.en_other ?? String(n)) : (forms.en_other ?? String(n));
}

/**
 * Format a price in RON (Romanian locale): 1383.79 → "1.383,79 RON"
 */
export function formatPrice(amount: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(locale === 'ro' ? 'ro-RO' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} RON`;
}

/**
 * Format a date for display.
 * RO: "28 aprilie 2026"
 * EN: "April 28, 2026"
 */
export function formatDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  if (locale === 'ro') {
    const months = [
      'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
      'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie',
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
