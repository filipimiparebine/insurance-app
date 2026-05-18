import type { Db } from "@blaj/db";
import { BaseInsurerAdapter } from "./base";
import {
  InsurerApiError,
  type GetQuoteParams,
  type InsurerQuoteResult,
  type IssuePolicyParams,
  type IssuePolicyResult,
  type CancelPolicyParams,
  type CancelPolicyResult,
} from "./types";

export class AsiromInsurerAdapter extends BaseInsurerAdapter {
  constructor() {
    super({
      code: "asirom",
      name: "Asirom Vienna Insurance Group",
      baseUrl: "https://api.asirom.ro",
      timeoutMs: 20000,
      maxRetries: 2,
    });
  }

  async doGetQuote(
    db: Db,
    params: GetQuoteParams,
  ): Promise<InsurerQuoteResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials)
      throw new InsurerApiError("Missing API credentials", this.config.code, "getQuote");

    const payload = {
      vehicleVin: params.vehicle.vin,
      plateNumber: params.vehicle.plateNumber,
      registrationStatus: params.vehicle.registrationStatus,
      yearOfManufacture: params.vehicle.yearOfManufacture,
      engineCapacityCc: params.vehicle.engineCapacityCc,
      enginePowerKw: params.vehicle.enginePowerKw,
      maxMassKg: params.vehicle.maxMassKg,
      seatsCount: params.vehicle.seatsCount,
      vehicleCategory: params.vehicle.vehicleCategory,
      usageType: params.vehicle.usageType,
      ownerCnpCui: params.owner.phone,
      ownerEmail: params.owner.email,
      startDate: params.startDate,
      months: params.durationMonths,
      bonusMalus: params.bonusMalusClass,
      directSettlement: params.directSettlementRequested,
    };

    const headers = { Authorization: `Token ${credentials}`, "Content-Type": "application/json" };

    const resp = await fetch(`${this.config.baseUrl}/rca/offer`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const body = await resp.json() as any;

    if (!resp.ok) {
      throw new InsurerApiError(
        body.error ?? "Quote request failed",
        this.config.code,
        "getQuote",
        resp.status,
        body,
      );
    }

    return {
      insurerCode: this.config.code,
      durationMonths: params.durationMonths,
      premiumNet: String(body.premiumNet ?? "0"),
      brokerCommission: String(body.commission ?? "0"),
      totalAmount: String(body.totalPremium ?? "0"),
      currency: String(body.currency ?? "RON"),
      bonusMalusClass: String(body.bonusMalus ?? params.bonusMalusClass),
      directSettlementDelta: String(body.directSettlementDelta ?? "0"),
      excludedCountries: body.excludedCountries ?? [],
      externalOfferCode: String(body.offerRef ?? null),
      isAvailable: body.available !== false,
      unavailableReason: body.rejectionReason ?? null,
      documentsUrl: body.ipidUrl ?? null,
      rawResponse: body,
    };
  }

  async doIssuePolicy(
    db: Db,
    params: IssuePolicyParams,
  ): Promise<IssuePolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials)
      throw new InsurerApiError("Missing API credentials", this.config.code, "issuePolicy");

    const payload = {
      offerRef: params.offerSnapshot.externalOfferCode,
      policyHolder: {
        type: params.owner.type === "company" ? "PJ" : "PF",
        firstName: params.owner.firstName,
        lastName: params.owner.lastName,
        email: params.owner.email,
        phone: params.owner.phone,
      },
      vin: params.vehicle.vin,
      plateNumber: params.vehicle.plateNumber,
      startDate: params.startDate,
      endDate: params.endDate,
      brokerRef: params.policyId,
    };

    const headers = { Authorization: `Token ${credentials}`, "Content-Type": "application/json" };

    const resp = await fetch(`${this.config.baseUrl}/rca/policy`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const body = await resp.json() as any;

    if (!resp.ok) {
      throw new InsurerApiError(
        body.error ?? "Policy issuance failed",
        this.config.code,
        "issuePolicy",
        resp.status,
        body,
      );
    }

    return {
      externalPolicyNumber: body.policyNumber,
      insurerStatus: body.status ?? "active",
      documents: body.documents ?? [],
      rawResponse: body,
    };
  }

  async doCancelPolicy(
    db: Db,
    params: CancelPolicyParams,
  ): Promise<CancelPolicyResult> {
    const credentials = await this.loadCredentials(db);
    if (!credentials)
      throw new InsurerApiError("Missing API credentials", this.config.code, "cancelPolicy");

    const headers = { Authorization: `Token ${credentials}`, "Content-Type": "application/json" };

    const resp = await fetch(
      `${this.config.baseUrl}/rca/policy/${params.externalPolicyNumber}/cancel`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ reason: params.reason, effectiveDate: params.effectiveDate }),
      },
    );

    const body = await resp.json() as any;

    if (!resp.ok) {
      throw new InsurerApiError(
        body.error ?? "Policy cancellation failed",
        this.config.code,
        "cancelPolicy",
        resp.status,
        body,
      );
    }

    return {
      cancelled: body.cancelled ?? true,
      refundAmount: String(body.refundAmount ?? "0"),
      currency: String(body.currency ?? "RON"),
      rawResponse: body,
    };
  }

  async doHealthCheck(): Promise<boolean> {
    const resp = await fetch(`${this.config.baseUrl}/status`, {
      signal: AbortSignal.timeout(5000),
    });
    return resp.ok;
  }
}

export function registerAsiromAdapter(): void {
  const { registerAdapter } = require("./factory");
  registerAdapter("asirom", () => new AsiromInsurerAdapter());
}
