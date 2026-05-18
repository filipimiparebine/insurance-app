import type { Db } from "@blaj/db";
import { eq } from "drizzle-orm";
import {
  payments,
  persons,
  policies,
  rcaPolicyDetails,
  quoteOffers,
  quoteSearches,
  vehicles,
  webhookEvents,
  users,
} from "@blaj/db/schema";
import { generatePolicyPdf } from "../lib/pdf";
import { dispatchNotification } from "./notifications";
import { getAdapter } from "./insurers";
import type {
  IssuePolicyParams,
  VehicleData,
  IndividualOwnerData,
  CompanyOwnerData,
} from "./insurers/types";

type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";
type PolicyStatus = "active" | "cancelled" | "expired" | "pending" | "pending_cancellation";

export async function handlePaymentSuccess(
  db: Db,
  paymentIntentId: string,
): Promise<{ policyId: string } | null> {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.stripePaymentIntentId, paymentIntentId));

  if (!payment) return null;

  await db
    .update(payments)
    .set({ status: "succeeded" as PaymentStatus, completedAt: new Date() })
    .where(eq(payments.id, payment.id));

  const [offer] = await db
    .select()
    .from(quoteOffers)
    .where(eq(quoteOffers.id, payment.quoteOfferId!));

  if (!offer) return null;

  // Resolve vehicleId and ownerPersonId from the quote search chain
  const [search] = await db
    .select({
      vehicleId: quoteSearches.vehicleId,
      ownerPersonId: quoteSearches.ownerPersonId,
    })
    .from(quoteSearches)
    .where(eq(quoteSearches.id, offer.quoteSearchId));
  const vehicleId = search?.vehicleId ?? "00000000-0000-0000-0000-000000000000";

  let vehiclePlate = "N/A";
  let ownerName = "Client";
  let vehicleSnapshot: Record<string, unknown> | null = null;
  let ownerSnapshot: Record<string, unknown> | null = null;
  let vehicleData: VehicleData | null = null;
  let ownerData: IndividualOwnerData | CompanyOwnerData | null = null;

  // Fetch full vehicle data if available
  if (search?.vehicleId) {
    const [vehicle] = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, search.vehicleId));
    if (vehicle) {
      vehiclePlate = vehicle.plateNumber ?? vehicle.vin ?? "N/A";
      vehicleSnapshot = {
        plateNumber: vehicle.plateNumber,
        make: vehicle.make,
        model: vehicle.model,
        vin: vehicle.vin,
      };
      vehicleData = {
        registrationStatus: vehicle.registrationStatus,
        plateNumber: vehicle.plateNumber,
        vin: vehicle.vin,
        make: vehicle.make ?? "N/A",
        model: vehicle.model ?? "N/A",
        vehicleCategory: vehicle.vehicleCategory ?? "M1",
        vehicleSubcategory: vehicle.vehicleSubcategory ?? "",
        usageType: vehicle.usageType ?? "personal",
        fuelType: vehicle.fuelType ?? "benzina",
        yearOfManufacture: vehicle.yearOfManufacture ?? new Date().getFullYear(),
        maxMassKg: vehicle.maxMassKg ?? 1500,
        engineCapacityCc: vehicle.engineCapacityCc ?? 1400,
        enginePowerKw: vehicle.enginePowerKw ?? "55",
        seatsCount: vehicle.seatsCount ?? 5,
        civSeries: vehicle.civSeries ?? null,
        firstRegistrationDate: vehicle.firstRegistrationDate ?? "",
        mileage: vehicle.mileage ?? null,
        itpExpiresAt: vehicle.itpExpiresAt ?? null,
      };
    }
  }

  // Fetch full owner data if available
  if (search?.ownerPersonId) {
    const [person] = await db
      .select()
      .from(persons)
      .where(eq(persons.id, search.ownerPersonId));
    if (person?.firstName || person?.lastName) {
      ownerName = [person.firstName, person.lastName].filter(Boolean).join(" ");
    }
    if (person) {
      ownerSnapshot = { firstName: person.firstName, lastName: person.lastName };
      if (person.type === "company") {
        ownerData = {
          type: "company",
          firstName: person.firstName ?? "",
          lastName: person.lastName ?? "",
          email: person.email ?? "",
          phone: person.phone ?? "",
          companyName: person.companyName ?? "",
          companyType: person.companyType ?? "",
          registrationNumber: person.registrationNumber ?? "",
          caenCode: person.caenCode ?? "",
          addressCounty: person.addressCounty ?? "",
          addressCity: person.addressCity ?? "",
          addressStreet: person.addressStreet ?? "",
          addressNumber: person.addressNumber ?? "",
          addressPostalCode: person.addressPostalCode ?? "",
        };
      } else {
        ownerData = {
          type: "individual",
          firstName: person.firstName ?? "",
          lastName: person.lastName ?? "",
          email: person.email ?? "",
          phone: person.phone ?? "",
          licenseYear: person.licenseYear ?? null,
          addressCounty: person.addressCounty ?? "",
          addressCity: person.addressCity ?? "",
          addressStreet: person.addressStreet ?? "",
          addressNumber: person.addressNumber ?? "",
          addressBlock: person.addressBlock ?? null,
          addressApartment: person.addressApartment ?? null,
          addressPostalCode: person.addressPostalCode ?? "",
        };
      }
    }
  }

  const now = new Date();
  const policyNumber = `RCA-${Date.now().toString(36).toUpperCase()}`;
  const startDate = now.toISOString().slice(0, 10);
  const endDate = new Date(now);
  endDate.setFullYear(endDate.getFullYear() + 1);
  const endDateStr = endDate.toISOString().slice(0, 10);
  const withdrawalUntil = new Date(now);
  withdrawalUntil.setDate(withdrawalUntil.getDate() + 14);

  const [policy] = await db
    .insert(policies)
    .values({
      userId: payment.userId,
      policyType: "rca",
      policyNumber,
      insurerCode: offer.insurerCode,
      startDate: startDate as unknown as string,
      endDate: endDateStr as unknown as string,
      durationMonths: offer.durationMonths,
      premiumNet: offer.premiumNet?.toString(),
      brokerCommission: offer.brokerCommission?.toString(),
      totalAmount: offer.totalAmount?.toString(),
      currency: offer.currency,
      status: "active" as PolicyStatus,
      paymentId: payment.id,
      issuedAt: now,
      withdrawalUntil: withdrawalUntil.toISOString().slice(0, 10) as unknown as string,
      subjectSnapshot: vehicleSnapshot,
      ownerSnapshot,
    })
    .returning();

  if (!policy) throw new Error("Failed to create policy");

  await db.insert(rcaPolicyDetails).values({
    policyId: policy.id,
    vehicleId,
    bonusMalusClass: offer.bonusMalusClass ?? undefined,
    directSettlement: false,
  });

  // Issue policy with insurer to get external policy number
  let externalPolicyNumber: string | null = null;
  if (vehicleData && ownerData) {
    try {
      const adapter = getAdapter(offer.insurerCode);
      const issueParams: IssuePolicyParams = {
        policyId: policy.id,
        offerSnapshot: {
          insurerCode: offer.insurerCode,
          externalOfferCode: offer.externalOfferCode,
          durationMonths: offer.durationMonths,
          premiumNet: offer.premiumNet?.toString() ?? "0",
          brokerCommission: offer.brokerCommission?.toString() ?? "0",
          totalAmount: offer.totalAmount?.toString() ?? "0",
          currency: offer.currency ?? "RON",
        },
        vehicle: vehicleData,
        owner: ownerData,
        startDate,
        endDate: endDateStr,
      };
      const issueResult = await adapter.issuePolicy(db, issueParams);
      externalPolicyNumber = issueResult.externalPolicyNumber;
    } catch {
      // Non-blocking — proceed without external policy number
    }
  }

  const pdf = await generatePolicyPdf({
    policyNumber: policy.policyNumber!,
    insurerName: offer.insurerCode,
    ownerName,
    vehiclePlate,
    startDate,
    endDate: endDateStr,
    premiumTotal: Number(offer.totalAmount ?? 0),
    currency: offer.currency ?? "RON",
    externalPolicyNumber: externalPolicyNumber ?? undefined,
  });

  await db
    .update(policies)
    .set({ pdfUrl: pdf.pdfUrl, pdfHash: pdf.pdfHash, externalPolicyNumber })
    .where(eq(policies.id, policy.id));

  await db
    .update(payments)
    .set({ policyId: policy.id })
    .where(eq(payments.id, payment.id));

  try {
    const [user] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, payment.userId))
      .limit(1);

    const recipient = user?.email ?? "customer@example.com";
    const userName = recipient !== "customer@example.com"
      ? recipient.split("@")[0]?.replace(/[._-]/g, " ") || "Client"
      : "Client";

    await dispatchNotification(db, {
      userId: payment.userId,
      policyId: policy.id,
      channel: "email",
      template: "policy_issued",
      recipient,
      data: {
        name: userName,
        policyNumber: policy.policyNumber!,
        startDate,
        endDate: endDateStr,
        dashboardUrl: "https://blaj.io/cont",
      },
    });
  } catch {
    // Don't fail policy creation for notification error
  }

  return { policyId: policy.id };
}

export async function isEventProcessed(
  db: Db,
  eventId: string,
): Promise<boolean> {
  const [event] = await db
    .select()
    .from(webhookEvents)
    .where(eq(webhookEvents.eventId, eventId));
  return !!event;
}

export async function markEventProcessed(
  db: Db,
  eventId: string,
  source: string,
  error?: string,
): Promise<void> {
  await db.insert(webhookEvents).values({
    source,
    eventId,
    processedAt: new Date(),
    error: error ?? null,
  });
}
