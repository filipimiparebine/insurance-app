import type { MetadataRoute } from "next";

const locales = ["ro", "en"];
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blaj.io";

const routes = [
  "", "/cum-functioneaza", "/securitate", "/preturi",
  "/intrebari-frecvente", "/contact", "/accesibilitate",
  "/termeni", "/confidentialitate", "/cookies", "/asigurare",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "weekly" : "monthly" as const,
      priority: route === "" ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${route}`])
        ),
      },
    }))
  );
}
