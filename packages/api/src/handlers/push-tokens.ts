import type { Db } from "@blaj/db";
import { eq, and } from "drizzle-orm";
import { pushTokens } from "@blaj/db/schema";
import type {
  RegisterPushTokenInput,
  UnregisterPushTokenInput,
} from "../contracts/push-tokens";

export async function registerPushTokenHandler(
  db: Db,
  userId: string,
  input: RegisterPushTokenInput,
) {
  const [existing] = await db
    .select()
    .from(pushTokens)
    .where(eq(pushTokens.token, input.token));

  if (existing) {
    await db
      .update(pushTokens)
      .set({
        userId,
        platform: input.platform,
        deviceId: input.deviceId ?? null,
        active: true,
        updatedAt: new Date(),
      })
      .where(eq(pushTokens.id, existing.id));
  } else {
    await db.insert(pushTokens).values({
      userId,
      token: input.token,
      platform: input.platform,
      deviceId: input.deviceId ?? null,
      active: true,
    });
  }

  return { success: true };
}

export async function unregisterPushTokenHandler(
  db: Db,
  userId: string,
  input: UnregisterPushTokenInput,
) {
  await db
    .update(pushTokens)
    .set({ active: false, updatedAt: new Date() })
    .where(
      and(
        eq(pushTokens.userId, userId),
        eq(pushTokens.token, input.token),
      ),
    );

  return { success: true };
}
