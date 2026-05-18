import { ApiReference } from "@scalar/nextjs-api-reference";

const config = {
  url: "/api/spec",
  theme: "bluePlanet" as const,
  metaData: {
    title: "API Reference — blaj.io",
    description:
      "blaj.io public API. Create quotes, compare RCA offers, and issue policies programmatically.",
    ogTitle: "blaj.io API Reference",
    ogDescription:
      "Interactive API reference for the blaj.io insurance platform.",
    ogImage: "",
  },
};

export const GET = ApiReference(config);
