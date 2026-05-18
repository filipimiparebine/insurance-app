"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { leasingCompanies } from "@blaj/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getLeasingCompanies() {
  const db = getDb();
  return db.select().from(leasingCompanies).orderBy(asc(leasingCompanies.name));
}

export async function createLeasingCompany(data: {
  name: string;
  cui?: string;
  active?: boolean;
}) {
  const db = getDb();
  await db.insert(leasingCompanies).values({
    name: data.name,
    cui: data.cui ?? null,
    active: data.active ?? true,
    isUserAdded: true,
  });
  revalidatePath("/leasing-companies");
}

export async function updateLeasingCompany(id: string, data: {
  name?: string;
  cui?: string;
  active?: boolean;
}) {
  const db = getDb();
  await db.update(leasingCompanies).set(data).where(eq(leasingCompanies.id, id));
  revalidatePath("/leasing-companies");
}

export async function deleteLeasingCompany(id: string) {
  const db = getDb();
  await db.delete(leasingCompanies).where(eq(leasingCompanies.id, id));
  revalidatePath("/leasing-companies");
}
