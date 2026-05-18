import { createDb } from "@blaj/db";

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof createDb> | undefined;
};

export function getDb() {
  if (!globalForDb.db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }
    globalForDb.db = createDb(databaseUrl);
  }
  return globalForDb.db;
}
