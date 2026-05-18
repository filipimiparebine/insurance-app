import { Expo, type ExpoPushMessage, type ExpoPushTicket } from "expo-server-sdk";

let _expo: Expo | null = null;

export function getExpo(): Expo {
  if (!_expo) {
    _expo = new Expo({
      accessToken: process.env.EXPO_ACCESS_TOKEN,
    });
  }
  return _expo;
}

export interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export async function sendPush(pushMessages: PushMessage[]): Promise<ExpoPushTicket[]> {
  const expo = getExpo();

  const messages: ExpoPushMessage[] = [];

  for (const pushMessage of pushMessages) {
    if (!Expo.isExpoPushToken(pushMessage.to)) {
      continue;
    }

    messages.push({
      to: pushMessage.to,
      sound: "default",
      title: pushMessage.title,
      body: pushMessage.body,
      data: pushMessage.data ?? {},
    });
  }

  if (messages.length === 0) {
    return [];
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets: ExpoPushTicket[] = [];

  for (const chunk of chunks) {
    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    tickets.push(...ticketChunk);
  }

  return tickets;
}
