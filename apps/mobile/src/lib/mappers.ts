import type { QuoteFormData } from './quote-state'
import {
  vehicleSchema,
  personOwnerSchema,
  companyOwnerSchema,
  policyConfigSchema,
} from '@blaj/shared/schemas'
import type { CreateQuoteInput } from '@blaj/api'
import { z } from 'zod'

const REGISTRATION_MAP: Record<string, string> = {
  registered: 'inmatriculat',
  pending_registration: 'in_vederea_inmatricularii',
  mayor_registered: 'inregistrat_primarie',
}

const USAGE_MAP: Record<string, string> = {
  personal: 'privat',
  taxi: 'taxi',
  curierat: 'curierat',
  'transport persoane': 'transport_national_persoane',
  'transport marfă': 'transport_marfa',
}

const FUEL_MAP: Record<string, string> = {
  Motorină: 'motorina',
  Benzină: 'benzina',
  Electric: 'electric',
  Hibrid: 'hibrid',
  GPL: 'gpl',
  GNC: 'benzina',
}

function mapStringNumeric(val: string): number | undefined {
  const n = parseInt(val, 10)
  return isNaN(n) ? undefined : n
}

function toRomanianPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-]/g, '')
  if (cleaned.startsWith('+40')) return cleaned
  if (cleaned.startsWith('07')) return `+40${cleaned.slice(1)}`
  return cleaned
}

export function mapVehicleData(form: QuoteFormData) {
  const an_fabricatie = mapStringNumeric(form.yearOfManufacture)
  const masa_maxima = mapStringNumeric(form.maxMass) ?? 1500
  const capacitate_cilindrica = mapStringNumeric(form.engineCapacity) ?? 1500
  const putere = mapStringNumeric(form.enginePower) ?? 50
  const numar_locuri = mapStringNumeric(form.seatsCount) ?? 5

  return {
    stare: REGISTRATION_MAP[form.registrationStatus] ?? 'inmatriculat',
    numar_inmatriculare: form.plateNumber || undefined,
    serie_sasiu: form.vin,
    marca: form.make,
    model: form.model,
    categorie: (form.vehicleCategory || 'autoturism') as any,
    subcategorie: form.vehicleSubcategory || 'standard',
    mod_utilizare: (USAGE_MAP[form.usageType] ?? 'privat') as any,
    tip_combustibil: (FUEL_MAP[form.fuelType] ?? 'benzina') as any,
    an_fabricatie: an_fabricatie ?? new Date().getFullYear() - 10,
    masa_maxima,
    capacitate_cilindrica,
    putere,
    numar_locuri,
    data_primei_inmatriculari: form.firstRegistrationDate || '2020-01-01',
  }
}

export function mapOwnerData(form: QuoteFormData) {
  if (form.personType === 'individual') {
    return {
      tip_persoana: 'pf' as const,
      nume: form.lastName,
      prenume: form.firstName,
      cnp: form.cnp,
      serie_ci: form.idDocSeries,
      numar_ci: form.idDocNumber,
      email: form.email,
      telefon: toRomanianPhone(form.phone),
      adresa: {
        judet: form.addressCounty || 'Bucuresti',
        localitate: form.addressCity || 'Bucuresti',
        strada: form.addressStreet || 'Nedefinit',
        numar: form.addressNumber || '1',
        cod_postal: form.addressPostalCode || '000000',
      },
    }
  }

  return {
    tip_persoana: 'pj' as const,
    cui: form.companyCui,
    nume_companie: form.companyName,
    cod_caen: form.companyCaen,
    numar_inregistrare: form.companyRegNumber,
    tip_societate: form.companyEntityType,
    email_companie: form.companyEmail,
    telefon: toRomanianPhone(form.companyPhone),
    reprezentant_nume: form.repLastName,
    reprezentant_prenume: form.repFirstName,
    reprezentant_calitate: form.repCapacity,
    adresa_sediu: {
      judet: form.companyAddressCounty || 'Bucuresti',
      localitate: form.companyAddressCity || 'Bucuresti',
      strada: form.companyAddressStreet || 'Nedefinit',
      numar: form.companyAddressNumber || '1',
      cod_postal: form.companyAddressPostalCode || '000000',
    },
  }
}

export function mapPolicyConfig(form: QuoteFormData) {
  const durata = mapStringNumeric(form.durationMonthsSecondary)
  return {
    data_inceput: form.startDate,
    durata_luni: ((durata && durata >= 1 && durata <= 12 ? durata : 12).toString() as '1' | '3' | '6' | '12'),
    decontare_directa: form.directSettlementRequested,
    an_obtinere_permis: mapStringNumeric(form.licenseYear),
    sofer_diferit: !form.driverIsOwner,
    soferi_adiționali: form.drivers.map((d) => ({
      nume: d.lastName,
      prenume: d.firstName,
      cnp: d.cnp,
      data_obtinere_permis: mapStringNumeric(d.licenseYear) ?? new Date().getFullYear(),
    })),
  }
}

export function toCreateQuoteInput(
  form: QuoteFormData,
  userId: string,
  acknowledgments?: { gdprAt?: string; precontractualAt?: string; noConsultancyAt?: string },
): CreateQuoteInput {
  const now = new Date().toISOString()
  const primaryDuration = 12
  const secondaryDuration = mapStringNumeric(form.durationMonthsSecondary) ?? 6

  return {
    userId,
    vehicle: mapVehicleData(form) as any,
    owner: mapOwnerData(form) as any,
    driversPersonIds: undefined,
    startDate: form.startDate,
    durationMonthsPrimary: primaryDuration,
    durationMonthsSecondary: secondaryDuration,
    directSettlementRequested: form.directSettlementRequested,
    leasing: form.isLeasing ? { are_leasing: true, companie_leasing: form.leasingCompany } : { are_leasing: false, companie_leasing: '' },
    acknowledgments: {
      gdprAt: acknowledgments?.gdprAt ?? now,
      precontractualAt: acknowledgments?.precontractualAt ?? now,
      noConsultancyAt: acknowledgments?.noConsultancyAt ?? now,
    },
  }
}

const partialVehicleSchema = vehicleSchema.partial()
const partialOwnerPfSchema = personOwnerSchema.partial()
const partialOwnerPjSchema = companyOwnerSchema.partial()
const partialPolicySchema = policyConfigSchema.partial()

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateStep1(form: QuoteFormData): ValidationResult {
  const data = mapVehicleData(form)
  const result = partialVehicleSchema.safeParse(data)
  if (result.success) return { valid: true, errors: [] }

  return {
    valid: false,
    errors: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
  }
}

export function validateStep2(form: QuoteFormData): ValidationResult {
  const data = mapOwnerData(form)
  const schema = form.personType === 'individual' ? partialOwnerPfSchema : partialOwnerPjSchema
  const result = schema.safeParse(data)
  if (result.success) return { valid: true, errors: [] }

  return {
    valid: false,
    errors: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
  }
}

export function validateStep3(form: QuoteFormData): ValidationResult {
  const data = mapPolicyConfig(form)
  const result = partialPolicySchema.safeParse(data)
  if (result.success) return { valid: true, errors: [] }

  return {
    valid: false,
    errors: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
  }
}

export function mapOffersFromApi(offers: any[]) {
  return offers.map((o: any) => ({
    id: o.id,
    quoteSearchId: o.quoteSearchId,
    insurerCode: o.insurerCode,
    insurerName: o.insurerCode,
    durationMonths: o.durationMonths,
    premiumNet: parseFloat(o.premiumNet ?? '0'),
    brokerCommission: parseFloat(o.brokerCommission ?? '0'),
    totalAmount: parseFloat(o.totalAmount ?? '0'),
    currency: o.currency ?? 'RON',
    bonusMalusClass: o.bonusMalusClass ?? 'B0',
    isAvailable: o.isAvailable ?? true,
    unavailableReason: o.unavailableReason ?? null,
  }))
}
