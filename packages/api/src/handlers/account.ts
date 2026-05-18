import type { Db } from "@blaj/db";
import { eq } from "drizzle-orm";
import { users, persons, vehicles, policies as policiesTable } from "@blaj/db/schema";
import type {
  GetProfileInput,
  UpdatePreferencesInput,
  DeleteAccountInput,
} from "../contracts/account";

export async function getProfileHandler(
  db: Db,
  input: GetProfileInput,
) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, input.userId));

  if (!user) throw new Error("User not found");

  const savedPersons = await db
    .select()
    .from(persons)
    .where(eq(persons.userId, input.userId));

  const savedVehicles = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.userId, input.userId));

  const userPolicies = await db
    .select()
    .from(policiesTable)
    .where(eq(policiesTable.userId, input.userId));

  return {
    user,
    persons: savedPersons,
    vehicles: savedVehicles,
    policies: userPolicies,
  };
}

export async function updatePreferencesHandler(
  db: Db,
  input: UpdatePreferencesInput,
) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, input.userId));

  if (!user) throw new Error("User not found");

  const currentPrefs = (user.preferences as Record<string, boolean>) ?? {};

  await db
    .update(users)
    .set({
      preferences: {
        emailReminders: input.preferences.emailReminders ?? currentPrefs.emailReminders ?? true,
        smsReminders: input.preferences.smsReminders ?? currentPrefs.smsReminders ?? true,
        pushReminders: input.preferences.pushReminders ?? currentPrefs.pushReminders ?? true,
        cookiesAnalytics: input.preferences.cookiesAnalytics ?? currentPrefs.cookiesAnalytics ?? false,
        cookiesMarketing: input.preferences.cookiesMarketing ?? currentPrefs.cookiesMarketing ?? false,
      },
      updatedAt: new Date(),
    })
    .where(eq(users.id, input.userId));

  return { success: true };
}

export async function deleteAccountHandler(
  db: Db,
  input: DeleteAccountInput,
) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, input.userId));

  if (!user) throw new Error("User not found");

  // Anonymize PII (GDPR-compliant soft delete)
  await db
    .update(persons)
    .set({ deletedAt: new Date() })
    .where(eq(persons.userId, input.userId));

  await db
    .update(vehicles)
    .set({ deletedAt: new Date() })
    .where(eq(vehicles.userId, input.userId));

  await db
    .update(users)
    .set({
      email: `anonymized-${input.userId}@deleted.local`,
      phone: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, input.userId));

  return { success: true };
}
