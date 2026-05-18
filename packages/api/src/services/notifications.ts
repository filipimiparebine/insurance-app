import { sendEmail } from "../lib/resend";
import { sendSms } from "../lib/twilio";
import { sendPush } from "../lib/expo-push";
import type { Db } from "@blaj/db";
import { eq, and } from "drizzle-orm";
import { notificationsLog, pushTokens } from "@blaj/db/schema";

export type NotificationChannel = "email" | "sms" | "push";
export type NotificationTemplate =
  | "welcome"
  | "policy_issued"
  | "policy_cancelled"
  | "refund_processed"
  | "reminder_60d"
  | "reminder_30d"
  | "reminder_7d"
  | "cart_abandoned"
  | "cancellation_requested"
  | "cancellation_approved";

interface PushContent {
  title: string;
  body: string;
}

interface TemplateContent {
  subject: string;
  html: (data: Record<string, string>) => string;
  sms: (data: Record<string, string>) => string;
  push: (data: Record<string, string>) => PushContent;
}

const templates: Record<NotificationTemplate, TemplateContent> = {
  welcome: {
    subject: "Bun venit pe blaj.io!",
    html: (d) => `<p>Salut ${d.name},</p><p>Contul tău a fost creat cu succes. Poți acum să compari oferte RCA și să cumperi direct polița online.</p>`,
    sms: () => `Bun venit pe blaj.io! Acum poti compara oferte RCA de la 9 asiguratori.`,
    push: () => ({ title: "Bun venit pe blaj.io!", body: "Contul tău a fost creat cu succes. Compară oferte RCA și cumpără online." }),
  },
  policy_issued: {
    subject: "Polița RCA a fost emisă",
    html: (d) =>
      `<p>Salut ${d.name},</p><p>Polița RCA <strong>${d.policyNumber}</strong> a fost emisă și este valabilă ${d.startDate} — ${d.endDate}.</p><p>Vezi documentul în contul tău: <a href="${d.dashboardUrl}">${d.dashboardUrl}</a></p>`,
    sms: (d) =>
      `Polița RCA ${d.policyNumber} a fost emisă. Valabilă ${d.startDate} - ${d.endDate}. Vezi documentul în cont.`,
    push: (d) => ({ title: "Polița RCA emisă", body: `Polița ${d.policyNumber} a fost emisă. Valabilă ${d.startDate} — ${d.endDate}.` }),
  },
  policy_cancelled: {
    subject: "Polița RCA a fost anulată",
    html: (d) =>
      `<p>Salut ${d.name},</p><p>Polița <strong>${d.policyNumber}</strong> a fost anulată. Motiv: ${d.reason}.</p>`,
    sms: (d) =>
      `Polița ${d.policyNumber} a fost anulată. Motiv: ${d.reason}.`,
    push: (d) => ({ title: "Poliță anulată", body: `Polița ${d.policyNumber} a fost anulată. Motiv: ${d.reason}.` }),
  },
  refund_processed: {
    subject: "Rambursare procesată",
    html: (d) =>
      `<p>Salut ${d.name},</p><p>Rambursarea de ${d.amount} ${d.currency} pentru polița ${d.policyNumber} a fost procesată.</p>`,
    sms: (d) =>
      `Rambursare ${d.amount} ${d.currency} pentru polița ${d.policyNumber} procesată.`,
    push: (d) => ({ title: "Rambursare procesată", body: `Rambursarea de ${d.amount} ${d.currency} pentru polița ${d.policyNumber} a fost procesată.` }),
  },
  reminder_60d: {
    subject: "Polița RCA expiră în 60 de zile",
    html: (d) =>
      `<p>Salut ${d.name},</p><p>Polița RCA <strong>${d.policyNumber}</strong> expiră pe ${d.endDate}. Reînnoiește acum: <a href="${d.renewUrl}">${d.renewUrl}</a></p>`,
    sms: (d) =>
      `Polița RCA ${d.policyNumber} expiră pe ${d.endDate}. Reînnoiește pe blaj.io.`,
    push: (d) => ({ title: "Polița RCA expiră în 60 de zile", body: `Polița ${d.policyNumber} expiră pe ${d.endDate}. Reînnoiește acum.` }),
  },
  reminder_30d: {
    subject: "Polița RCA expiră în 30 de zile",
    html: (d) =>
      `<p>Salut ${d.name},</p><p>Polița RCA <strong>${d.policyNumber}</strong> expiră peste 30 de zile (${d.endDate}). Reînnoiește: <a href="${d.renewUrl}">${d.renewUrl}</a></p>`,
    sms: (d) =>
      `Polița RCA ${d.policyNumber} expiră în 30 zile (${d.endDate}). Reînnoiește pe blaj.io.`,
    push: (d) => ({ title: "Polița RCA expiră în 30 de zile", body: `Polița ${d.policyNumber} expiră pe ${d.endDate}. Mai ai 30 de zile.` }),
  },
  reminder_7d: {
    subject: "Polița RCA expiră în 7 zile",
    html: (d) =>
      `<p>Salut ${d.name},</p><p>Polița RCA <strong>${d.policyNumber}</strong> expiră peste 7 zile (${d.endDate}). Nu circula fără RCA! Reînnoiește: <a href="${d.renewUrl}">${d.renewUrl}</a></p>`,
    sms: (d) =>
      `⚠️ Polița RCA ${d.policyNumber} expiră în 7 zile (${d.endDate}). Nu circula fara RCA! Reînnoiește pe blaj.io.`,
    push: (d) => ({ title: "⚠️ Polița RCA expiră în 7 zile", body: `Polița ${d.policyNumber} expiră pe ${d.endDate}. Nu circula fără RCA!` }),
  },
  cart_abandoned: {
    subject: "Ai lăsat ofertele în coș",
    html: (d) =>
      `<p>Salut ${d.name},</p><p>Ai început o simulare RCA acum o oră. Ofertele sunt valabile 24h: <a href="${d.resumeUrl}">Continuă</a></p>`,
    sms: () => "",
    push: (d) => ({ title: "Ai oferte nefinalizate", body: "Ai început o simulare RCA. Ofertele sunt valabile 24h." }),
  },
  cancellation_requested: {
    subject: "Cerere de anulare înregistrată",
    html: (d) =>
      `<p>Salut ${d.name},</p><p>Am înregistrat cererea de anulare pentru polița ${d.policyNumber}. Vei primi un răspuns în maxim 48h.</p>`,
    sms: (d) =>
      `Cerere anulare ${d.policyNumber} înregistrată. Răspuns în max 48h.`,
    push: (d) => ({ title: "Cerere anulare înregistrată", body: `Cererea de anulare pentru ${d.policyNumber} a fost înregistrată. Răspuns în max 48h.` }),
  },
  cancellation_approved: {
    subject: "Cerere de anulare aprobată",
    html: (d) =>
      `<p>Salut ${d.name},</p><p>Anularea poliței ${d.policyNumber} a fost aprobată. Rambursare: ${d.amount} ${d.currency}.</p>`,
    sms: (d) =>
      `Anulare ${d.policyNumber} aprobată. Rambursare ${d.amount} ${d.currency}.`,
    push: (d) => ({ title: "Anulare aprobată", body: `Anularea poliței ${d.policyNumber} a fost aprobată. Rambursare: ${d.amount} ${d.currency}.` }),
  },
};

export async function dispatchNotification(
  db: Db,
  params: {
    userId: string;
    policyId?: string;
    channel: NotificationChannel;
    template: NotificationTemplate;
    recipient: string;
    data: Record<string, string>;
  },
) {
  const tpl = templates[params.template];
  if (!tpl) throw new Error(`Template "${params.template}" not found`);

  let status: string = "pending";
  try {
    if (params.channel === "email") {
      const html = tpl.html(params.data);
      await sendEmail({
        to: params.recipient,
        subject: tpl.subject,
        html,
        tags: [{ name: "template", value: params.template }],
      });
    } else if (params.channel === "sms") {
      const body = tpl.sms(params.data);
      if (body) {
        await sendSms({ to: params.recipient, body });
      }
    } else if (params.channel === "push") {
      const pushContent = tpl.push(params.data);
      const tokens = await db
        .select()
        .from(pushTokens)
        .where(
          and(
            eq(pushTokens.userId, params.userId),
            eq(pushTokens.active, true),
          ),
        );

      if (tokens.length > 0) {
        const tickets = await sendPush(
          tokens.map((t) => ({
            to: t.token,
            title: pushContent.title,
            body: pushContent.body,
            data: { policyId: params.policyId ?? "", type: params.template },
          })),
        );

        for (let i = 0; i < tickets.length; i++) {
          const ticket = tickets[i];
          if (
            ticket.status === "error" &&
            ticket.details?.error === "DeviceNotRegistered"
          ) {
            await db
              .update(pushTokens)
              .set({ active: false, updatedAt: new Date() })
              .where(eq(pushTokens.token, tokens[i].token));
          }
        }
      }
    }
    status = "sent";
  } catch (e) {
    status = "failed";
    throw e;
  } finally {
    await db.insert(notificationsLog).values({
      userId: params.userId,
      policyId: params.policyId ?? null,
      channel: params.channel,
      templateKey: params.template,
      recipient: params.recipient,
      status,
      sentAt: status === "sent" ? new Date() : undefined,
    });
  }
}
