import { z } from 'zod';
import { cnpSchema } from '../validators/cnp';

export const driverSchema = z.object({
  nume: z.string().trim().min(1, 'Numele este obligatoriu.'),
  prenume: z.string().trim().min(1, 'Prenumele este obligatoriu.'),
  cnp: cnpSchema,
  data_obtinere_permis: z
    .number()
    .int()
    .min(1950, 'Anul obținerii permisului nu este valid.')
    .max(new Date().getFullYear(), 'Anul obținerii permisului nu poate fi în viitor.'),

  serie_ci: z.string().trim().optional(),
  numar_ci: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Numărul CI trebuie să aibă 6 cifre.')
    .optional(),

  telefon: z
    .string()
    .trim()
    .regex(
      /^(\+40|0)\d{9}$/,
      'Numărul de telefon nu este valid.',
    )
    .optional(),
});
export type Driver = z.infer<typeof driverSchema>;
