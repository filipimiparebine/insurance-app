"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { insurers } from "@blaj/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getInsurers() {
  const db = getDb();
  return db.select().from(insurers).orderBy(asc(insurers.name));
}

export async function createInsurer(data: {
  code: string;
  name: string;
  active?: boolean;
  brokerCommissionPct?: string;
  apiEndpoint?: string;
}) {
  const db = getDb();
  await db.insert(insurers).values({
    code: data.code,
    name: data.name,
    active: data.active ?? true,
    brokerCommissionPct: data.brokerCommissionPct ?? null,
    apiEndpoint: data.apiEndpoint ?? null,
  });
  revalidatePath("/insurers");
}

export async function updateInsurer(code: string, data: {
  name?: string;
  active?: boolean;
  brokerCommissionPct?: string;
  apiEndpoint?: string;
  apiCredentialsSecretId?: string;
}) {
  const db = getDb();
  await db.update(insurers).set(data).where(eq(insurers.code, code));
  revalidatePath("/insurers");
}

export async function deleteInsurer(code: string) {
  const db = getDb();
  await db.delete(insurers).where(eq(insurers.code, code));
  revalidatePath("/insurers");
}
