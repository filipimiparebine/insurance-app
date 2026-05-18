import twilio from "twilio";

let _twilio: twilio.Twilio | null = null;

export function getTwilio(): twilio.Twilio {
  if (!_twilio) {
    _twilio = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!,
    );
  }
  return _twilio;
}

export async function sendSms(params: {
  to: string;
  body: string;
}): Promise<string> {
  const client = getTwilio();
  const message = await client.messages.create({
    to: params.to,
    from: process.env.TWILIO_PHONE_NUMBER!,
    body: params.body,
  });
  return message.sid;
}
