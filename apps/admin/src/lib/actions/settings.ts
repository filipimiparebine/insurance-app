"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { appConfig } from "@blaj/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getSettings() {
  const db = getDb();
  return db.select().from(appConfig).orderBy(asc(appConfig.key));
}

export async function getSetting(key: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(appConfig)
    .where(eq(appConfig.key, key))
    .limit(1);
  return row ?? null;
}

export async function updateSetting(key: string, value: string) {
  const db = getDb();
  await db
    .insert(appConfig)
    .values({ key, value })
    .onConflictDoUpdate({ target: appConfig.key, set: { value } });
  revalidatePath("/settings");
}
