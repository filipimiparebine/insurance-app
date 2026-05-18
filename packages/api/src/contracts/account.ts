import { z } from "zod";

export const getProfileInput = z.object({
  userId: z.string().uuid(),
});

export const getProfileOutput = z.object({
  user: z.record(z.string(), z.any()),
  persons: z.array(z.record(z.string(), z.any())),
  vehicles: z.array(z.record(z.string(), z.any())),
  policies: z.array(z.record(z.string(), z.any())),
});

export const updatePreferencesInput = z.object({
  userId: z.string().uuid(),
  preferences: z.object({
    emailReminders: z.boolean().optional(),
    smsReminders: z.boolean().optional(),
    pushReminders: z.boolean().optional(),
    cookiesAnalytics: z.boolean().optional(),
    cookiesMarketing: z.boolean().optional(),
  }),
});

export const updatePreferencesOutput = z.object({
  success: z.boolean(),
});

export const deleteAccountInput = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(1).max(500).optional(),
});

export const deleteAccountOutput = z.object({
  success: z.boolean(),
});

export type GetProfileInput = z.infer<typeof getProfileInput>;
export type GetProfileOutput = z.infer<typeof getProfileOutput>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesInput>;
export type UpdatePreferencesOutput = z.infer<typeof updatePreferencesOutput>;
export type DeleteAccountInput = z.infer<typeof deleteAccountInput>;
export type DeleteAccountOutput = z.infer<typeof deleteAccountOutput>;

