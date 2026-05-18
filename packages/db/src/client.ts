import { drizzle } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleLocal } from "drizzle-orm/postgres-js";
import { neonConfig } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema";

const NEON_WS_PATTERN = /\.neon\.tech/i;

function isNeon(url: string): boolean {
  return NEON_WS_PATTERN.test(url);
}

export function createDb(databaseUrl: string) {
  if (isNeon(databaseUrl)) {
    if (process.env.VERCEL_ENV !== "production") {
      neonConfig.wsProxy = (host) => `${host}:5433/v1`;
      neonConfig.useSecureWebSocket = false;
    }
    return drizzle(databaseUrl, { schema });
  }

  const client = postgres(databaseUrl);
  return drizzleLocal(client, { schema });
}

export type Db = ReturnType<typeof createDb>;
