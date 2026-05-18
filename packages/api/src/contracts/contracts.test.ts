import { describe, it, expect } from "vitest";

import { createQuoteInput, createQuoteOutput } from "../contracts/quotes";
import { getPolicyInput, listPoliciesInput, cancelPolicyInput, cancelPolicyOutput } from "../contracts/policies";
import {
  createPaymentIntentInput,
  createPaymentIntentOutput,
  getPaymentInput,
  cancelWithRefundInput,
  cancelWithRefundOutput,
} from "../contracts/payments";
import {
  getProfileInput,
  getProfileOutput,
  updatePreferencesInput,
  updatePreferencesOutput,
  deleteAccountInput,
} from "../contracts/account";
import {
  registerPushTokenInput,
  unregisterPushTokenInput,
} from "../contracts/push-tokens";

const VALID_UUID = "00000000-0000-0000-0000-000000000001";

function validQuoteInput() {
  return {
    userId: VALID_UUID,
    vehicle: {
      stare: "inmatriculat",
      numar_inmatriculare: "B01ABC",
      serie_sasiu: "WBA3A5C59DF123456",
      marca: "BMW",
      model: "320d",
      categorie: "autoturism",
      subcategorie: "berlina",
      mod_utilizare: "privat",
      tip_combustibil: "motorina",
      an_fabricatie: 2018,
      masa_maxima: 1500,
      capacitate_cilindrica: 1995,
      putere: 135,
      numar_locuri: 5,
      data_primei_inmatriculari: "2018-03-15",
      kilometraj: 80000,
      data_expirare_itp: "2026-03-15",
    },
    owner: {
      tip_persoana: "pf" as const,
      nume: "Doe",
      prenume: "John",
      cnp: "1900101010011",
      serie_ci: "AB",
      numar_ci: "123456",
      email: "john@example.com",
      telefon: "0722123456",
      adresa: {
        judet: "Bucuresti",
        localitate: "Bucuresti",
        strada: "Test",
        numar: "1",
        cod_postal: "012345",
      },
    },
    startDate: "2026-06-01",
    durationMonthsPrimary: 12,
    durationMonthsSecondary: 1,
    acknowledgments: {
      gdprAt: new Date().toISOString(),
      precontractualAt: new Date().toISOString(),
      noConsultancyAt: new Date().toISOString(),
    },
  };
}

describe("createQuoteInput", () => {
  it("accepts a valid quote input", () => {
    const result = createQuoteInput.safeParse(validQuoteInput());
    expect(result.success).toBe(true);
  });

  it("rejects a missing userId", () => {
    const input = validQuoteInput();
    delete (input as Record<string, unknown>).userId;
    expect(createQuoteInput.safeParse(input).success).toBe(false);
  });

  it("rejects a non-uuid userId", () => {
    const input = validQuoteInput();
    (input as Record<string, unknown>).userId = "not-a-uuid";
    expect(createQuoteInput.safeParse(input).success).toBe(false);
  });

  it("rejects an invalid startDate format", () => {
    const input = validQuoteInput();
    (input as Record<string, unknown>).startDate = "01-06-2026";
    expect(createQuoteInput.safeParse(input).success).toBe(false);
  });

  it("rejects durationMonthsPrimary below 1", () => {
    const input = validQuoteInput();
    (input as Record<string, unknown>).durationMonthsPrimary = 0;
    expect(createQuoteInput.safeParse(input).success).toBe(false);
  });

  it("rejects durationMonthsPrimary above 12", () => {
    const input = validQuoteInput();
    (input as Record<string, unknown>).durationMonthsPrimary = 13;
    expect(createQuoteInput.safeParse(input).success).toBe(false);
  });

  it("applies default value for directSettlementRequested", () => {
    const input = validQuoteInput();
    delete (input as Record<string, unknown>).directSettlementRequested;
    const result = createQuoteInput.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.directSettlementRequested).toBe(false);
    }
  });

  it("applies default durationMonthsPrimary when omitted", () => {
    const input = validQuoteInput();
    delete (input as Record<string, unknown>).durationMonthsPrimary;
    const result = createQuoteInput.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.durationMonthsPrimary).toBe(12);
    }
  });
});

describe("createQuoteOutput", () => {
  it("accepts a valid quote output", () => {
    const result = createQuoteOutput.safeParse({
      searchId: VALID_UUID,
      expiresAt: new Date().toISOString(),
      offers: [],
    });
    expect(result.success).toBe(true);
  });

  it("accepts populated offers array", () => {
    const result = createQuoteOutput.safeParse({
      searchId: VALID_UUID,
      expiresAt: new Date().toISOString(),
      offers: [{ insurer: "Test Insurer", price: 500 }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing offers", () => {
    expect(
      createQuoteOutput.safeParse({
        searchId: VALID_UUID,
        expiresAt: new Date().toISOString(),
      }).success,
    ).toBe(false);
  });

  it("rejects a non-uuid searchId", () => {
    expect(
      createQuoteOutput.safeParse({
        searchId: "not-a-uuid",
        expiresAt: new Date().toISOString(),
        offers: [],
      }).success,
    ).toBe(false);
  });
});

describe("getPolicyInput", () => {
  it("accepts a valid uuid policyId", () => {
    expect(getPolicyInput.safeParse({ policyId: VALID_UUID }).success).toBe(
      true,
    );
  });

  it("rejects a non-uuid policyId", () => {
    expect(getPolicyInput.safeParse({ policyId: "abc" }).success).toBe(false);
  });

  it("rejects empty object", () => {
    expect(getPolicyInput.safeParse({}).success).toBe(false);
  });
});

describe("listPoliciesInput", () => {
  it("accepts a valid input with required userId", () => {
    const result = listPoliciesInput.safeParse({ userId: VALID_UUID });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(20);
      expect(result.data.offset).toBe(0);
    }
  });

  it("accepts optional status filter", () => {
    const result = listPoliciesInput.safeParse({
      userId: VALID_UUID,
      status: "active",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("active");
    }
  });

  it("rejects invalid status", () => {
    expect(
      listPoliciesInput.safeParse({
        userId: VALID_UUID,
        status: "unknown",
      }).success,
    ).toBe(false);
  });

  it("rejects limit below 1", () => {
    expect(
      listPoliciesInput.safeParse({ userId: VALID_UUID, limit: 0 }).success,
    ).toBe(false);
  });

  it("rejects limit above 100", () => {
    expect(
      listPoliciesInput.safeParse({ userId: VALID_UUID, limit: 101 }).success,
    ).toBe(false);
  });

  it("rejects negative offset", () => {
    expect(
      listPoliciesInput.safeParse({ userId: VALID_UUID, offset: -1 }).success,
    ).toBe(false);
  });

  it("accepts all valid statuses", () => {
    const statuses = ["active", "cancelled", "expired", "pending", "pending_cancellation"] as const;
    for (const status of statuses) {
      expect(
        listPoliciesInput.safeParse({ userId: VALID_UUID, status }).success,
      ).toBe(true);
    }
  });
});

describe("cancelPolicyInput", () => {
  it("accepts a valid cancel request", () => {
    const result = cancelPolicyInput.safeParse({
      policyId: VALID_UUID,
      reason: "Policy no longer needed",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing reason", () => {
    expect(
      cancelPolicyInput.safeParse({ policyId: VALID_UUID }).success,
    ).toBe(false);
  });

  it("rejects empty reason", () => {
    expect(
      cancelPolicyInput.safeParse({ policyId: VALID_UUID, reason: "" }).success,
    ).toBe(false);
  });

  it("rejects reason exceeding 500 chars", () => {
    expect(
      cancelPolicyInput.safeParse({
        policyId: VALID_UUID,
        reason: "x".repeat(501),
      }).success,
    ).toBe(false);
  });

  it("accepts reason at exactly 500 chars", () => {
    const result = cancelPolicyInput.safeParse({
      policyId: VALID_UUID,
      reason: "x".repeat(500),
    });
    expect(result.success).toBe(true);
  });
});

describe("cancelPolicyOutput", () => {
  it("accepts refunded true with amount and currency", () => {
    const result = cancelPolicyOutput.safeParse({
      refunded: true,
      amount: 150.5,
      currency: "RON",
    });
    expect(result.success).toBe(true);
  });

  it("accepts refunded false without optional fields", () => {
    const result = cancelPolicyOutput.safeParse({ refunded: false });
    expect(result.success).toBe(true);
  });

  it("rejects non-boolean refunded", () => {
    expect(cancelPolicyOutput.safeParse({ refunded: "yes" }).success).toBe(
      false,
    );
  });
});

describe("createPaymentIntentInput", () => {
  it("accepts a valid payment intent", () => {
    const result = createPaymentIntentInput.safeParse({
      userId: VALID_UUID,
      quoteOfferId: VALID_UUID,
      amount: 150.75,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.currency).toBe("RON");
    }
  });

  it("rejects amount of zero", () => {
    expect(
      createPaymentIntentInput.safeParse({
        userId: VALID_UUID,
        quoteOfferId: VALID_UUID,
        amount: 0,
      }).success,
    ).toBe(false);
  });

  it("rejects negative amount", () => {
    expect(
      createPaymentIntentInput.safeParse({
        userId: VALID_UUID,
        quoteOfferId: VALID_UUID,
        amount: -10,
      }).success,
    ).toBe(false);
  });

  it("accepts optional customerId", () => {
    const result = createPaymentIntentInput.safeParse({
      userId: VALID_UUID,
      quoteOfferId: VALID_UUID,
      amount: 100,
      customerId: "cus_123",
    });
    expect(result.success).toBe(true);
  });
});

describe("createPaymentIntentOutput", () => {
  it("accepts valid output with clientSecret", () => {
    const result = createPaymentIntentOutput.safeParse({
      clientSecret: "pi_secret_123",
      paymentIntentId: "pi_123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts null clientSecret", () => {
    const result = createPaymentIntentOutput.safeParse({
      clientSecret: null,
      paymentIntentId: "pi_123",
    });
    expect(result.success).toBe(true);
  });
});

describe("getPaymentInput", () => {
  it("accepts a valid uuid paymentId", () => {
    expect(
      getPaymentInput.safeParse({ paymentId: VALID_UUID }).success,
    ).toBe(true);
  });

  it("rejects a non-uuid paymentId", () => {
    expect(getPaymentInput.safeParse({ paymentId: "abc" }).success).toBe(false);
  });
});

describe("cancelWithRefundInput", () => {
  it("accepts valid cancel with refund request", () => {
    const result = cancelWithRefundInput.safeParse({
      policyId: VALID_UUID,
      reason: "Duplicate policy",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing reason", () => {
    expect(
      cancelWithRefundInput.safeParse({ policyId: VALID_UUID }).success,
    ).toBe(false);
  });

  it("rejects empty reason", () => {
    expect(
      cancelWithRefundInput.safeParse({
        policyId: VALID_UUID,
        reason: "",
      }).success,
    ).toBe(false);
  });

  it("rejects reason exceeding 500 chars", () => {
    expect(
      cancelWithRefundInput.safeParse({
        policyId: VALID_UUID,
        reason: "x".repeat(501),
      }).success,
    ).toBe(false);
  });
});

describe("cancelWithRefundOutput", () => {
  it("accepts a successful refund output", () => {
    const result = cancelWithRefundOutput.safeParse({
      refunded: true,
      amount: 200,
      currency: "RON",
    });
    expect(result.success).toBe(true);
  });

  it("accepts refunded false with no amount", () => {
    const result = cancelWithRefundOutput.safeParse({ refunded: false });
    expect(result.success).toBe(true);
  });
});

describe("getProfileInput", () => {
  it("accepts a valid userId", () => {
    expect(
      getProfileInput.safeParse({ userId: VALID_UUID }).success,
    ).toBe(true);
  });

  it("rejects a non-uuid userId", () => {
    expect(getProfileInput.safeParse({ userId: "me" }).success).toBe(false);
  });
});

describe("getProfileOutput", () => {
  it("accepts a full profile response", () => {
    const result = getProfileOutput.safeParse({
      user: { id: VALID_UUID, email: "a@b.com" },
      persons: [],
      vehicles: [],
      policies: [],
    });
    expect(result.success).toBe(true);
  });

  it("accepts record values of any type", () => {
    const result = getProfileOutput.safeParse({
      user: { id: VALID_UUID, age: 30, active: true },
      persons: [{ name: "Jane" }],
      vehicles: [{ plate: "B01ABC", year: 2018 }],
      policies: [{ status: "active", premium: 500 }],
    });
    expect(result.success).toBe(true);
  });
});

describe("updatePreferencesInput", () => {
  it("accepts valid preferences", () => {
    const result = updatePreferencesInput.safeParse({
      userId: VALID_UUID,
      preferences: { emailReminders: false },
    });
    expect(result.success).toBe(true);
  });

  it("accepts all preference flags", () => {
    const result = updatePreferencesInput.safeParse({
      userId: VALID_UUID,
      preferences: {
        emailReminders: true,
        smsReminders: true,
        pushReminders: false,
        cookiesAnalytics: true,
        cookiesMarketing: false,
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-boolean preference value", () => {
    expect(
      updatePreferencesInput.safeParse({
        userId: VALID_UUID,
        preferences: { emailReminders: "yes" },
      }).success,
    ).toBe(false);
  });

  it("accepts empty preferences object", () => {
    // All fields are optional
    const result = updatePreferencesInput.safeParse({
      userId: VALID_UUID,
      preferences: {},
    });
    expect(result.success).toBe(true);
  });
});

describe("deleteAccountInput", () => {
  it("accepts a valid delete request", () => {
    const result = deleteAccountInput.safeParse({ userId: VALID_UUID });
    expect(result.success).toBe(true);
  });

  it("accepts with optional reason", () => {
    const result = deleteAccountInput.safeParse({
      userId: VALID_UUID,
      reason: "Too expensive",
    });
    expect(result.success).toBe(true);
  });

  it("rejects reason exceeding 500 chars", () => {
    expect(
      deleteAccountInput.safeParse({
        userId: VALID_UUID,
        reason: "x".repeat(501),
      }).success,
    ).toBe(false);
  });
});

describe("registerPushTokenInput", () => {
  it("accepts a valid push token registration", () => {
    const result = registerPushTokenInput.safeParse({
      userId: VALID_UUID,
      token: "expo-token-abc123",
      platform: "ios",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing token", () => {
    expect(
      registerPushTokenInput.safeParse({ userId: VALID_UUID }).success,
    ).toBe(false);
  });

  it("rejects empty token", () => {
    expect(
      registerPushTokenInput.safeParse({
        userId: VALID_UUID,
        token: "",
      }).success,
    ).toBe(false);
  });

  it("rejects invalid platform", () => {
    expect(
      registerPushTokenInput.safeParse({
        userId: VALID_UUID,
        token: "token",
        platform: "windows",
      }).success,
    ).toBe(false);
  });

  it("accepts optional deviceId", () => {
    const result = registerPushTokenInput.safeParse({
      userId: VALID_UUID,
      token: "token",
      platform: "android",
      deviceId: "device-1",
    });
    expect(result.success).toBe(true);
  });
});

describe("unregisterPushTokenInput", () => {
  it("accepts a valid unregister request", () => {
    const result = unregisterPushTokenInput.safeParse({
      userId: VALID_UUID,
      token: "expo-token-abc123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing token", () => {
    expect(
      unregisterPushTokenInput.safeParse({ userId: VALID_UUID }).success,
    ).toBe(false);
  });

  it("rejects empty token", () => {
    expect(
      unregisterPushTokenInput.safeParse({
        userId: VALID_UUID,
        token: "",
      }).success,
    ).toBe(false);
  });
});

describe("updatePreferencesOutput", () => {
  it("accepts success true", () => {
    expect(
      updatePreferencesOutput.safeParse({ success: true }).success,
    ).toBe(true);
  });

  it("accepts success false", () => {
    expect(
      updatePreferencesOutput.safeParse({ success: false }).success,
    ).toBe(true);
  });

  it("rejects non-boolean success", () => {
    expect(
      updatePreferencesOutput.safeParse({ success: 1 }).success,
    ).toBe(false);
  });
});
