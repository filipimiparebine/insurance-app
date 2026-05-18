import { z } from 'zod';
import { vehicleSchema } from './vehicle';
import { ownerSchema } from './owner';
import { policyConfigSchema, leasingSchema } from './policy';

export const quoteRequestSchema = z.object({
  vehicle: vehicleSchema,
  owner: ownerSchema,
  policy_config: policyConfigSchema,
  leasing: leasingSchema.optional(),
});
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

export const wizardStepSchema = z.enum([
  'landing',
  'vehicle',
  'owner',
  'config',
  'offers',
  'checkout',
  'thank_you',
]);
export type WizardStep = z.infer<typeof wizardStepSchema>;

export const wizardStateSchema = z.object({
  current_step: wizardStepSchema,
  vehicle: vehicleSchema.partial().optional(),
  owner: ownerSchema.optional(),
  policy_config: policyConfigSchema.partial().optional(),
  leasing: leasingSchema.optional(),
  offers: z.array(z.any()).optional(),
  selected_offer_id: z.string().optional(),
  payment_completed: z.boolean().default(false),
});
export type WizardState = z.infer<typeof wizardStateSchema>;
