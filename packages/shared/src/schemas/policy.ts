import { z } from 'zod';
import { driverSchema } from './driver';

export const durataLuniEnum = z.enum(['1', '3', '6', '12']);
export type DurataLuni = z.infer<typeof durataLuniEnum>;

export const policyConfigSchema = z.object({
  data_inceput: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format dată invalid.')
    .refine((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 60);
      return date >= today && date <= maxDate;
    }, 'Data de început trebuie să fie între azi și maxim 60 de zile în avans.'),

  durata_luni: durataLuniEnum,
  decontare_directa: z.boolean(),
  an_obtinere_permis: z
    .number()
    .int()
    .min(1950, 'Anul obținerii permisului nu este valid.')
    .max(new Date().getFullYear(), 'Anul obținerii permisului nu poate fi în viitor.')
    .optional(),
  sofer_diferit: z.boolean().default(false),
  soferi_adiționali: z.array(driverSchema).max(4, 'Maxim 4 șoferi adiționali.').default([]),
});
export type PolicyConfig = z.infer<typeof policyConfigSchema>;

export const leasingSchema = z.object({
  are_leasing: z.boolean(),
  companie_leasing: z.string().trim().optional().refine(
    (val) => {
      return true; // Will be refined contextually based on are_leasing
    },
    { message: 'Compania de leasing este obligatorie când opțiunea leasing este activă.' },
  ),
});
export type Leasing = z.infer<typeof leasingSchema>;
