import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod";
import { appRouter } from "./router";

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

export async function generateOpenApiSpec() {
  return generator.generate(appRouter, {
    info: {
      title: "blaj.io API",
      version: "1.0.0",
      description:
        "Public API for blaj.io insurance platform. Create quotes, compare offers, and issue RCA policies programmatically.",
      contact: {
        name: "blaj.io API Support",
        email: "api@blaj.io",
      },
    },
    servers: [
      {
        url: "https://api.blaj.io",
        description: "Production",
      },
    ],
    tags: [
      { name: "quotes", description: "Quote search and retrieval" },
      { name: "policies", description: "Policy management" },
      { name: "payments", description: "Payment processing" },
      { name: "account", description: "User account management" },
      { name: "admin", description: "Admin-only operations" },
    ],
    security: [{ apiKey: [] }],
    components: {
      securitySchemes: {
        apiKey: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API key for authenticating requests. Obtain from the admin dashboard.",
        },
      },
    },
  });
}
