import { z } from "zod";
import { vehicleSchema } from "@blaj/shared/schemas";
import { ownerSchema } from "@blaj/shared/schemas";
import { leasingSchema } from "@blaj/shared/schemas";

export const createQuoteInput = z.object({
  userId: z.string().uuid(),
  vehicle: vehicleSchema,
  owner: ownerSchema,
  driversPersonIds: z.array(z.string().uuid()).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationMonthsPrimary: z.number().min(1).max(12).default(12),
  durationMonthsSecondary: z.number().min(1).max(11),
  directSettlementRequested: z.boolean().default(false),
  leasing: leasingSchema.optional(),
  acknowledgments: z.object({
    gdprAt: z.string(),
    precontractualAt: z.string(),
    noConsultancyAt: z.string(),
  }),
});

export const createQuoteOutput = z.object({
  searchId: z.string().uuid(),
  expiresAt: z.string(),
  offers: z.array(z.record(z.string(), z.any())),
});

export type CreateQuoteInput = z.infer<typeof createQuoteInput>;
export type CreateQuoteOutput = z.infer<typeof createQuoteOutput>;
