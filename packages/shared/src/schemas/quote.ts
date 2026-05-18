import { z } from 'zod';

export const quoteSchema = z.object({
  id: z.string(),
  insurer: z.string(),
  insurer_logo_url: z.string().optional(),
  price_standard: z.number().positive(),
  price_direct_settlement: z.number().positive().optional(),
  bonus_malus_class: z.string(),
  offer_code: z.string(),
  unavailable: z.boolean().default(false),
  unavailable_reason: z.string().optional(),
});
export type Quote = z.infer<typeof quoteSchema>;
