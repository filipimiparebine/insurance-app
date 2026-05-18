import { z } from "zod";

export const registerPushTokenInput = z.object({
  token: z.string().min(1),
  platform: z.enum(["ios", "android"]),
  deviceId: z.string().optional(),
});
export const registerPushTokenOutput = z.object({ success: z.boolean() });

export const unregisterPushTokenInput = z.object({
  token: z.string().min(1),
});
export const unregisterPushTokenOutput = z.object({ success: z.boolean() });

export type RegisterPushTokenInput = z.infer<typeof registerPushTokenInput>;
export type RegisterPushTokenOutput = z.infer<typeof registerPushTokenOutput>;
export type UnregisterPushTokenInput = z.infer<typeof unregisterPushTokenInput>;
export type UnregisterPushTokenOutput = z.infer<typeof unregisterPushTokenOutput>;
