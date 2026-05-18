import { z } from 'zod';

export const stareVehiculEnum = z.enum([
  'inmatriculat',
  'in_vederea_inmatricularii',
  'inregistrat_primarie',
]);
export type StareVehicul = z.infer<typeof stareVehiculEnum>;

export const modUtilizareEnum = z.enum([
  'privat',
  'taxi',
  'rent_a_car',
  'scoala_soferi',
  'firma_distributie',
  'firma_securitate',
  'curierat',
  'transport_national_persoane',
  'transport_marfa',
  'transport_international_marfa',
  'transport_international_persoane',
]);
export type ModUtilizare = z.infer<typeof modUtilizareEnum>;

export const tipCombustibilEnum = z.enum([
  'benzina',
  'motorina',
  'gpl',
  'hibrid',
  'electric',
  'hidrogen',
]);
export type TipCombustibil = z.infer<typeof tipCombustibilEnum>;

export const categorieVehiculEnum = z.enum([
  'autoturism',
  'autoutilitara',
  'motocicleta',
  'camion',
  'autobuz',
  'remorca',
  'semiremorca',
  'tractor',
  'masina_agricola',
]);
export type CategorieVehicul = z.infer<typeof categorieVehiculEnum>;

export const vinSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(17, 'VIN-ul trebuie să aibă 17 caractere.')
  .max(17, 'VIN-ul trebuie să aibă 17 caractere.')
  .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'VIN-ul conține caractere invalide.');

export const numarInmatriculareSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^(?:[A-Z]{1,2}\s?\d{2,3}\s?[A-Z]{3}|[A-Z]{1,2}\s?\d{5,6})$/,
    'Numărul de înmatriculare nu are un format valid.',
  );

export const vehicleSchema = z.object({
  stare: stareVehiculEnum,

  numar_inmatriculare: z.string().trim().toUpperCase().optional(),
  serie_sasiu: vinSchema,

  marca: z.string().trim().min(1, 'Marca este obligatorie.'),
  model: z.string().trim().min(1, 'Modelul este obligator.'),
  categorie: categorieVehiculEnum,
  subcategorie: z.string().trim().min(1, 'Subcategoria este obligatorie.'),

  mod_utilizare: modUtilizareEnum,
  tip_combustibil: tipCombustibilEnum,

  an_fabricatie: z
    .number()
    .int()
    .min(1900, 'Anul de fabricație nu este valid.')
    .max(new Date().getFullYear() + 1, 'Anul de fabricație nu poate fi în viitor.'),

  masa_maxima: z.number().int().min(1, 'Masa maximă este obligatorie.'),
  capacitate_cilindrica: z
    .number()
    .int()
    .min(1, 'Capacitatea cilindrică este obligatorie.'),
  putere: z.number().min(1, 'Puterea este obligatorie.'),
  numar_locuri: z.number().int().min(1, 'Numărul de locuri este obligatorie.'),

  serie_civ: z.string().trim().optional(),
  data_primei_inmatriculari: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format dată invalid.'),
  kilometraj: z.number().int().nonnegative().optional(),
  data_expirare_itp: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format dată invalid.').optional(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;
