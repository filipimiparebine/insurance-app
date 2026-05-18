import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!);
  }
  return _resend;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html?: string;
  from?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

export async function sendEmail(params: SendEmailParams) {
  const resend = getResend();
  const textContent = params.html?.replace(/<[^>]*>/g, "") ?? "";

  const { data, error } = await resend.emails.send({
    from: params.from ?? process.env.EMAIL_FROM ?? "blaj.io <noreply@blaj.io>",
    to: params.to,
    subject: params.subject,
    html: params.html ?? "",
    text: textContent,
    replyTo: params.replyTo,
    tags: params.tags as Array<{ name: string; value: string }>,
  });

  if (error) throw error;
  return data;
}
