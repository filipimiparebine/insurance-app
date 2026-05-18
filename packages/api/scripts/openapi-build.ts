import { generateOpenApiSpec } from "../src/openapi";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../openapi.json");

generateOpenApiSpec()
  .then((spec) => {
    writeFileSync(outPath, JSON.stringify(spec, null, 2), "utf-8");
    console.log(`OpenAPI spec written to ${outPath}`);
  })
  .catch((err) => {
    console.error("Failed to generate OpenAPI spec:", err);
    process.exit(1);
  });
