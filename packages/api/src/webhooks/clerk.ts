import type { Db } from "@blaj/db";
import { users, webhookEvents } from "@blaj/db/schema";
import { eq } from "drizzle-orm";
import { dispatchNotification } from "../services/notifications";

interface ClerkUserEvent {
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    phone_numbers: Array<{ phone_number: string }>;
    first_name: string;
    last_name: string;
    created_at: number;
    updated_at: number;
  };
  type: string;
}

export async function handleClerkWebhook(
  db: Db,
  payload: string,
  svixId: string,
  svixTimestamp: string,
  svixSignature: string,
): Promise<void> {
  let event: ClerkUserEvent;
  try {
    const { Webhook } = await import("svix");
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch {
    throw new Error("Invalid Clerk webhook signature");
  }

  const [alreadyProcessed] = await db
    .select()
    .from(webhookEvents)
    .where(eq(webhookEvents.eventId, svixId));

  if (alreadyProcessed) return;

  const { data } = event;

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const email = data.email_addresses[0]?.email_address;
      const phone = data.phone_numbers[0]?.phone_number;

      const existing = await db
        .select()
        .from(users)
        .where(eq(users.clerkUserId, data.id));

      if (existing.length > 0) {
        await db
          .update(users)
          .set({
            email: email ?? existing[0].email,
            phone: phone ?? existing[0].phone,
            updatedAt: new Date(),
          })
          .where(eq(users.clerkUserId, data.id));
      } else {
        const [newUser] = await db
          .insert(users)
          .values({
            clerkUserId: data.id,
            email: email ?? "",
            phone: phone ?? null,
            preferences: {
              emailReminders: true,
              smsReminders: true,
              pushReminders: true,
              cookiesAnalytics: false,
              cookiesMarketing: false,
            },
            createdAt: new Date(data.created_at),
            updatedAt: new Date(),
          })
          .returning();

        if (newUser && email) {
          try {
            await dispatchNotification(db, {
              userId: newUser.id,
              channel: "email",
              template: "welcome",
              recipient: email,
              data: {
                name: `${data.first_name} ${data.last_name}`.trim() || "Client",
              },
            });
          } catch {
            // Don't fail webhook for notification error
          }
        }
      }
      break;
    }

    case "user.deleted": {
      await db
        .update(users)
        .set({ email: "deleted@anonymized.local", phone: null })
        .where(eq(users.clerkUserId, data.id));
      break;
    }
  }

  await db.insert(webhookEvents).values({
    source: "clerk",
    eventId: svixId,
    payload: event as unknown as Record<string, unknown>,
    processedAt: new Date(),
  });
}
