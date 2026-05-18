import { z } from 'zod';
import { cnpSchema } from '../validators/cnp';
import { cuidSchema } from '../validators/cui';
import { serieCiSchema } from '../validators/ci';

export const addressSchema = z.object({
  judet: z.string().trim().min(1, 'Județul este obligatoriu.'),
  localitate: z.string().trim().min(1, 'Localitatea este obligatorie.'),
  strada: z.string().trim().min(1, 'Strada este obligatorie.'),
  numar: z.string().trim().min(1, 'Numărul este obligatoriu.'),
  bloc: z.string().trim().optional(),
  scara: z.string().trim().optional(),
  etaj: z.string().trim().optional(),
  apartament: z.string().trim().optional(),
  cod_postal: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Codul poștal trebuie să aibă 6 cifre.'),
});
export type Address = z.infer<typeof addressSchema>;

export const personOwnerSchema = z.object({
  tip_persoana: z.literal('pf'),

  nume: z.string().trim().min(1, 'Numele este obligatoriu.'),
  prenume: z.string().trim().min(1, 'Prenumele este obligatoriu.'),
  cnp: cnpSchema,

  serie_ci: serieCiSchema,
  numar_ci: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Numărul CI trebuie să aibă 6 cifre.'),

  email: z.string().email('Adresa de email nu este validă.'),
  telefon: z
    .string()
    .trim()
    .regex(
      /^(\+40|0)\d{9}$/,
      'Numărul de telefon nu este valid. Format: +407xxxxxxxx sau 07xxxxxxxx.',
    ),

  adresa: addressSchema,
});
export type PersonOwner = z.infer<typeof personOwnerSchema>;

export const companyOwnerSchema = z.object({
  tip_persoana: z.literal('pj'),

  cui: cuidSchema,
  nume_companie: z.string().trim().min(1, 'Numele companiei este obligatoriu.'),
  cod_caen: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'Codul CAEN trebuie să aibă 4 cifre.'),
  numar_inregistrare: z
    .string()
    .trim()
    .regex(
      /^J\d{2,4}\/\d{1,4}\/\d{4}$/,
      'Numărul de înregistrare nu este valid (ex: J63/2420/2022).',
    ),
  tip_societate: z.string().trim().min(1, 'Tipul societății este obligatoriu.'),

  email_companie: z.string().email('Adresa de email nu este validă.'),
  telefon: z
    .string()
    .trim()
    .regex(
      /^(\+40|0)\d{9}$/,
      'Numărul de telefon nu este valid. Format: +407xxxxxxxx sau 07xxxxxxxx.',
    ),

  reprezentant_nume: z.string().trim().min(1, 'Numele reprezentantului este obligatoriu.'),
  reprezentant_prenume: z.string().trim().min(1, 'Prenumele reprezentantului este obligatoriu.'),
  reprezentant_calitate: z.string().trim().min(1, 'Calitatea reprezentantului este obligatorie.'),

  adresa_sediu: addressSchema,
});
export type CompanyOwner = z.infer<typeof companyOwnerSchema>;

export const ownerSchema = z.discriminatedUnion('tip_persoana', [
  personOwnerSchema,
  companyOwnerSchema,
]);
export type Owner = z.infer<typeof ownerSchema>;
