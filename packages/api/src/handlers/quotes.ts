import type { Db } from "@blaj/db";
import { eq as drizzleEq } from "drizzle-orm";
import { quoteSearches, quoteOffers, vehicles, persons, insurers } from "@blaj/db/schema";
import type { CreateQuoteInput } from "../contracts/quotes";
import { getAdapter, hasAdapter } from "../services/insurers";
import type { VehicleData, OwnerData, InsurerQuoteResult } from "../services/insurers";
import { InsurerApiError } from "../services/insurers";

const REGISTRATION_STATUS_MAP: Record<string, string> = {
  inmatriculat: "registered",
  in_vederea_inmatricularii: "pending_registration",
  inregistrat_primarie: "mayor_registered",
};

function generateMockPremium(): number {
  return Math.round((600 + Math.random() * 1400) * 100) / 100;
}

function buildVehicleData(input: CreateQuoteInput): VehicleData {
  return {
    registrationStatus: REGISTRATION_STATUS_MAP[input.vehicle.stare] ?? "registered",
    plateNumber: input.vehicle.numar_inmatriculare ?? null,
    vin: input.vehicle.serie_sasiu,
    make: input.vehicle.marca,
    model: input.vehicle.model,
    vehicleCategory: input.vehicle.categorie,
    vehicleSubcategory: input.vehicle.subcategorie,
    usageType: input.vehicle.mod_utilizare,
    fuelType: input.vehicle.tip_combustibil,
    yearOfManufacture: input.vehicle.an_fabricatie,
    maxMassKg: input.vehicle.masa_maxima,
    engineCapacityCc: input.vehicle.capacitate_cilindrica,
    enginePowerKw: input.vehicle.putere.toString(),
    seatsCount: input.vehicle.numar_locuri,
    civSeries: input.vehicle.serie_civ ?? null,
    firstRegistrationDate: input.vehicle.data_primei_inmatriculari as unknown as string,
    mileage: input.vehicle.kilometraj ?? null,
    itpExpiresAt: (input.vehicle.data_expirare_itp as unknown as string) ?? null,
  };
}

function buildOwnerData(input: CreateQuoteInput): OwnerData {
  const owner = input.owner;
  if (owner.tip_persoana === "pf") {
    return {
      type: "individual",
      firstName: owner.prenume,
      lastName: owner.nume,
      email: owner.email,
      phone: owner.telefon,
      licenseYear: null,
      addressCounty: owner.adresa.judet,
      addressCity: owner.adresa.localitate,
      addressStreet: owner.adresa.strada,
      addressNumber: owner.adresa.numar,
      addressBlock: owner.adresa.bloc ?? null,
      addressApartment: owner.adresa.apartament ?? null,
      addressPostalCode: owner.adresa.cod_postal,
    };
  }
  return {
    type: "company",
    firstName: owner.reprezentant_prenume,
    lastName: owner.reprezentant_nume,
    email: owner.email_companie,
    phone: owner.telefon,
    companyName: owner.nume_companie,
    companyType: owner.tip_societate,
    registrationNumber: owner.numar_inregistrare,
    caenCode: owner.cod_caen,
    addressCounty: owner.adresa_sediu.judet,
    addressCity: owner.adresa_sediu.localitate,
    addressStreet: owner.adresa_sediu.strada,
    addressNumber: owner.adresa_sediu.numar,
    addressPostalCode: owner.adresa_sediu.cod_postal,
  };
}

function generateMockOfferResult(
  insurerCode: string,
  durationMonths: number,
  directSettlementRequested: boolean,
  isAvailable: boolean,
  unavailableReason: string | null,
): InsurerQuoteResult {
  const premium = generateMockPremium();
  const commission = Math.round(premium * 0.10 * 100) / 100;
  return {
    insurerCode,
    durationMonths,
    premiumNet: premium.toString(),
    brokerCommission: commission.toString(),
    totalAmount: (premium + commission).toFixed(2),
    currency: "RON",
    bonusMalusClass: "B6",
    directSettlementDelta: directSettlementRequested ? "50.00" : "0.00",
    excludedCountries: [],
    externalOfferCode: null,
    isAvailable,
    unavailableReason,
    documentsUrl: null,
    rawResponse: { source: "mock" },
  };
}

export async function createQuoteHandler(
  db: Db,
  input: CreateQuoteInput,
) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const [vehicle] = await db
    .insert(vehicles)
    .values({
      userId: input.userId,
      registrationStatus: REGISTRATION_STATUS_MAP[input.vehicle.stare] as typeof vehicles.$inferInsert["registrationStatus"],
      plateNumber: input.vehicle.numar_inmatriculare ?? null,
      vin: input.vehicle.serie_sasiu,
      make: input.vehicle.marca,
      model: input.vehicle.model,
      vehicleCategory: input.vehicle.categorie,
      vehicleSubcategory: input.vehicle.subcategorie,
      usageType: input.vehicle.mod_utilizare,
      fuelType: input.vehicle.tip_combustibil,
      yearOfManufacture: input.vehicle.an_fabricatie,
      maxMassKg: input.vehicle.masa_maxima,
      engineCapacityCc: input.vehicle.capacitate_cilindrica,
      enginePowerKw: input.vehicle.putere.toString(),
      seatsCount: input.vehicle.numar_locuri,
      civSeries: input.vehicle.serie_civ ?? null,
      firstRegistrationDate: input.vehicle.data_primei_inmatriculari as unknown as string,
      mileage: input.vehicle.kilometraj ?? null,
      itpExpiresAt: (input.vehicle.data_expirare_itp as unknown as string) ?? null,
    })
    .returning();
  if (!vehicle) throw new Error("Failed to create vehicle record");

  const owner = input.owner;
  const personValues =
    owner.tip_persoana === "pf"
      ? {
          userId: input.userId,
          type: "individual" as const,
          firstName: owner.prenume,
          lastName: owner.nume,
          email: owner.email,
          phone: owner.telefon,
          licenseYear: null,
          addressCounty: owner.adresa.judet,
          addressCity: owner.adresa.localitate,
          addressStreet: owner.adresa.strada,
          addressNumber: owner.adresa.numar,
          addressBlock: owner.adresa.bloc ?? null,
          addressApartment: owner.adresa.apartament ?? null,
          addressPostalCode: owner.adresa.cod_postal,
        }
      : {
          userId: input.userId,
          type: "company" as const,
          firstName: owner.reprezentant_prenume,
          lastName: owner.reprezentant_nume,
          email: owner.email_companie,
          phone: owner.telefon,
          companyName: owner.nume_companie,
          companyType: owner.tip_societate,
          registrationNumber: owner.numar_inregistrare,
          caenCode: owner.cod_caen,
          addressCounty: owner.adresa_sediu.judet,
          addressCity: owner.adresa_sediu.localitate,
          addressStreet: owner.adresa_sediu.strada,
          addressNumber: owner.adresa_sediu.numar,
          addressPostalCode: owner.adresa_sediu.cod_postal,
        };

  const [person] = await db
    .insert(persons)
    .values(personValues)
    .returning();
  if (!person) throw new Error("Failed to create person record");

  const [search] = await db
    .insert(quoteSearches)
    .values({
      userId: input.userId,
      vehicleId: vehicle.id,
      ownerPersonId: person.id,
      driversPersonIds: input.driversPersonIds ?? [],
      startDate: input.startDate,
      durationMonthsPrimary: input.durationMonthsPrimary,
      durationMonthsSecondary: input.durationMonthsSecondary,
      directSettlementRequested: input.directSettlementRequested,
      acknowledgments: input.acknowledgments,
      status: "completed" as const,
      createdAt: new Date(),
      completedAt: new Date(),
      expiresAt,
    } as typeof quoteSearches.$inferInsert)
    .returning();

  if (!search) throw new Error("Failed to create quote search");

  const vehicleData = buildVehicleData(input);
  const ownerData = buildOwnerData(input);

  const activeInsurers = await db
    .select({
      code: insurers.code,
      name: insurers.name,
      brokerCommissionPct: insurers.brokerCommissionPct,
    })
    .from(insurers)
    .where(drizzleEq(insurers.active, true));

  interface OfferRow {
    quoteSearchId: string;
    insurerCode: string;
    durationMonths: number;
    premiumNet: string;
    brokerCommission: string;
    totalAmount: string;
    currency: string;
    bonusMalusClass: string;
    directSettlementDelta: string;
    isAvailable: boolean;
    unavailableReason: string | null;
    rawResponse: Record<string, unknown>;
    createdAt: Date;
  }

  const offers: OfferRow[] = [];

  const durationOptions = [
    input.durationMonthsPrimary,
    input.durationMonthsSecondary,
  ];

  for (const insurer of activeInsurers) {
    for (const durationMonths of durationOptions) {
      let result: InsurerQuoteResult;

      if (hasAdapter(insurer.code)) {
        try {
          const adapter = getAdapter(insurer.code);
          result = await adapter.getQuote(db, {
            vehicle: vehicleData,
            owner: ownerData,
            insurerCode: insurer.code,
            startDate: input.startDate,
            durationMonths,
            directSettlementRequested: input.directSettlementRequested,
            bonusMalusClass: "B6",
          });
        } catch (err) {
          if (
            err instanceof InsurerApiError &&
            err.message.includes("Missing API credentials")
          ) {
            result = generateMockOfferResult(
              insurer.code,
              durationMonths,
              input.directSettlementRequested,
              true,
              null,
            );
          } else {
            result = generateMockOfferResult(
              insurer.code,
              durationMonths,
              input.directSettlementRequested,
              false,
              err instanceof InsurerApiError
                ? err.message
                : "API unavailable",
            );
          }
        }
      } else {
        result = generateMockOfferResult(
          insurer.code,
          durationMonths,
          input.directSettlementRequested,
          true,
          null,
        );
      }

      offers.push({
        quoteSearchId: search.id,
        insurerCode: result.insurerCode,
        durationMonths: result.durationMonths,
        premiumNet: result.premiumNet,
        brokerCommission: result.brokerCommission,
        totalAmount: result.totalAmount,
        currency: result.currency,
        bonusMalusClass: result.bonusMalusClass,
        directSettlementDelta: result.directSettlementDelta,
        isAvailable: result.isAvailable,
        unavailableReason: result.unavailableReason,
        rawResponse: result.rawResponse,
        createdAt: new Date(),
      });
    }
  }

  await db
    .insert(quoteOffers)
    .values(offers as (typeof quoteOffers.$inferInsert)[]);

  const allOffers = await db
    .select()
    .from(quoteOffers)
    .where(drizzleEq(quoteOffers.quoteSearchId, search.id));

  return {
    searchId: search.id,
    expiresAt: expiresAt.toISOString(),
    offers: allOffers,
  };
}
