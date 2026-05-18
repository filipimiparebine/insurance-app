import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ro", "en"],
  defaultLocale: "ro",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/cum-functioneaza": {
      ro: "/cum-functioneaza",
      en: "/how-it-works",
    },
    "/securitate": {
      ro: "/securitate",
      en: "/security",
    },
    "/preturi": {
      ro: "/preturi",
      en: "/pricing",
    },
    "/intrebari-frecvente": {
      ro: "/intrebari-frecvente",
      en: "/faq",
    },
    "/contact": {
      ro: "/contact",
      en: "/contact",
    },
    "/accesibilitate": {
      ro: "/accesibilitate",
      en: "/accessibility",
    },
    "/termeni": {
      ro: "/termeni",
      en: "/terms",
    },
    "/confidentialitate": {
      ro: "/confidentialitate",
      en: "/privacy",
    },
    "/cookies": {
      ro: "/cookies",
      en: "/cookies",
    },
    "/asigurare": {
      ro: "/asigurare",
      en: "/insurance",
    },
    "/dashboard": {
      ro: "/dashboard",
      en: "/dashboard",
    },
    "/contul-meu": {
      ro: "/contul-meu",
      en: "/my-account",
    },
  },
});
