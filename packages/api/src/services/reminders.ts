import type { Db } from "@blaj/db";
import { eq, and, gte, lte } from "drizzle-orm";
import { policies, users, notificationsLog } from "@blaj/db/schema";
import { dispatchNotification } from "./notifications";

interface ReminderWindow {
  daysBeforeExpiry: number;
  template: "reminder_60d" | "reminder_30d" | "reminder_7d";
  channel: "email" | "sms" | "push";
}

const REMINDER_SCHEDULE: ReminderWindow[] = [
  { daysBeforeExpiry: 60, template: "reminder_60d", channel: "email" },
  { daysBeforeExpiry: 60, template: "reminder_60d", channel: "push" },
  { daysBeforeExpiry: 30, template: "reminder_30d", channel: "email" },
  { daysBeforeExpiry: 30, template: "reminder_30d", channel: "push" },
  { daysBeforeExpiry: 7, template: "reminder_7d", channel: "sms" },
  { daysBeforeExpiry: 7, template: "reminder_7d", channel: "push" },
];

export async function processReminders(db: Db): Promise<{
  sent: number;
  skipped: number;
}> {
  let sent = 0;
  let skipped = 0;

  for (const window of REMINDER_SCHEDULE) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + window.daysBeforeExpiry);
    const targetDateStr = targetDate.toISOString().slice(0, 10);

    const activePolicies = await db
      .select({
        policy: policies,
        user: users,
      })
      .from(policies)
      .innerJoin(users, eq(users.id, policies.userId))
      .where(
        and(
          eq(policies.status, "active"),
          eq(policies.endDate, targetDateStr as unknown as string),
        ),
      );

    for (const { policy, user } of activePolicies) {
      const [alreadySent] = await db
        .select()
        .from(notificationsLog)
        .where(
          and(
            eq(notificationsLog.policyId, policy.id),
            eq(notificationsLog.templateKey, window.template),
          ),
        );

      if (alreadySent) {
        skipped++;
        continue;
      }

      const recipient =
        window.channel === "email" ? user.email : user.phone ?? "";
      if (!recipient && window.channel !== "push") {
        skipped++;
        continue;
      }

      const prefs = user.preferences as Record<string, boolean> | null;
      if (
        (window.channel === "email" && prefs?.emailReminders === false) ||
        (window.channel === "sms" && prefs?.smsReminders === false) ||
        (window.channel === "push" && prefs?.pushReminders === false)
      ) {
        skipped++;
        continue;
      }

      try {
        await dispatchNotification(db, {
          userId: user.id,
          policyId: policy.id,
          channel: window.channel,
          template: window.template,
          recipient,
          data: {
            name: user.email.split("@")[0]?.replace(/[._-]/g, " ") || "Client",
            policyNumber: policy.policyNumber ?? "",
            endDate: policy.endDate as unknown as string,
            renewUrl: "https://blaj.io/reinnoire",
          },
        });
        sent++;
      } catch {
        skipped++;
      }
    }
  }

  return { sent, skipped };
}
