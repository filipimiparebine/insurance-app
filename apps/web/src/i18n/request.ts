import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "ro" | "en")) {
    locale = routing.defaultLocale;
  }

  const { ro, en } = await import("@blaj/shared/i18n");

  return {
    locale,
    messages: locale === "ro" ? ro : en,
  };
});
