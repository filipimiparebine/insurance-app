import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  date,
  integer,
  numeric,
  jsonb,
  boolean,
  customType,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const personTypeEnum = pgEnum("person_type", ["individual", "company"]);
export const idDocTypeEnum = pgEnum("id_doc_type", [
  "ci",
  "bi",
  "passport",
]);
export const vehicleRegistrationStatusEnum = pgEnum(
  "vehicle_registration_status",
  ["registered", "pending_registration", "mayor_registered"],
);
export const vehicleRegistrationSubtypeEnum = pgEnum(
  "vehicle_registration_subtype",
  ["second_hand_ro", "foreign", "new_dealer_ro"],
);
export const quoteStatusEnum = pgEnum("quote_status", [
  "pending",
  "completed",
  "failed",
  "high_risk",
  "expired",
]);
export const policyTypeEnum = pgEnum("policy_type", [
  "rca",
  "casco",
  "home",
  "health",
  "travel",
  "life",
]);
export const policyStatusEnum = pgEnum("policy_status", [
  "active",
  "cancelled",
  "expired",
  "pending",
  "pending_cancellation",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "succeeded",
  "failed",
  "refunded",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "card",
  "apple_pay",
  "google_pay",
  "link",
]);
export const notificationChannelEnum = pgEnum("notification_channel", [
  "email",
  "sms",
  "push",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").unique().notNull(),
    email: text("email").notNull(),
    emailHmac: bytea("email_hmac").unique(),
    phone: text("phone"),
    locale: text("locale").default("ro"),
    preferences: jsonb("preferences").$type<{
      emailReminders: boolean;
      smsReminders: boolean;
      pushReminders: boolean;
      cookiesAnalytics: boolean;
      cookiesMarketing: boolean;
    }>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("users_clerk_idx").on(table.clerkUserId),
    index("users_email_idx").on(table.email),
  ],
);

export const persons = pgTable(
  "persons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    type: personTypeEnum("type").notNull(),

    cnpEncrypted: bytea("cnp_encrypted"),
    cnpDekWrapped: bytea("cnp_dek_wrapped"),
    cnpHmac: bytea("cnp_hmac"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    idDocType: idDocTypeEnum("id_doc_type"),
    idDocSeriesEncrypted: bytea("id_doc_series_encrypted"),
    idDocNumberEncrypted: bytea("id_doc_number_encrypted"),
    idDocExpiresAt: date("id_doc_expires_at"),
    licenseYear: integer("license_year"),
    hasNoLicense: boolean("has_no_license").default(false),

    cuiEncrypted: bytea("cui_encrypted"),
    cuiHmac: bytea("cui_hmac"),
    companyName: text("company_name"),
    companyType: text("company_type"),
    registrationNumber: text("registration_number"),
    caenCode: text("caen_code"),
    representativeFirstName: text("representative_first_name"),
    representativeLastName: text("representative_last_name"),
    representativeRole: text("representative_role"),

    email: text("email"),
    phone: text("phone"),
    addressCounty: text("address_county"),
    addressCity: text("address_city"),
    addressStreetType: text("address_street_type"),
    addressStreet: text("address_street"),
    addressNumber: text("address_number"),
    addressBlock: text("address_block"),
    addressApartment: text("address_apartment"),
    addressPostalCode: text("address_postal_code"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    anonymizedAt: timestamp("anonymized_at", { withTimezone: true }),
  },
  (table) => [
    index("persons_user_idx").on(table.userId),
    index("persons_cnp_hmac_idx").on(table.cnpHmac),
    index("persons_cui_hmac_idx").on(table.cuiHmac),
  ],
);

export const vehicles = pgTable(
  "vehicles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),

    registrationStatus: vehicleRegistrationStatusEnum(
      "registration_status",
    ).notNull(),
    registrationSubtype: vehicleRegistrationSubtypeEnum(
      "registration_subtype",
    ),

    plateNumber: text("plate_number"),
    vin: text("vin").notNull(),
    vinHmac: bytea("vin_hmac"),

    make: text("make"),
    model: text("model"),
    vehicleCategory: text("vehicle_category"),
    vehicleSubcategory: text("vehicle_subcategory"),
    usageType: text("usage_type"),
    fuelType: text("fuel_type"),
    yearOfManufacture: integer("year_of_manufacture"),
    firstRegistrationDate: date("first_registration_date"),
    maxMassKg: integer("max_mass_kg"),
    engineCapacityCc: integer("engine_capacity_cc"),
    enginePowerKw: numeric("engine_power_kw"),
    seatsCount: integer("seats_count"),
    civSeries: text("civ_series"),
    civUnknown: boolean("civ_unknown").default(false),
    mileage: integer("mileage"),
    itpExpiresAt: date("itp_expires_at"),

    isLeasing: boolean("is_leasing").default(false),
    leasingCompanyId: uuid("leasing_company_id").references(
      () => leasingCompanies.id,
    ),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("vehicles_user_idx").on(table.userId),
    index("vehicles_vin_idx").on(table.vin),
    index("vehicles_plate_idx").on(table.plateNumber),
    uniqueIndex("vehicles_vin_unique").on(table.vin),
  ],
);

export const leasingCompanies = pgTable("leasing_companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  cui: text("cui"),
  active: boolean("active").default(true),
  isUserAdded: boolean("is_user_added").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const quoteSearches = pgTable(
  "quote_searches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    vehicleId: uuid("vehicle_id")
      .references(() => vehicles.id)
      .notNull(),
    ownerPersonId: uuid("owner_person_id")
      .references(() => persons.id)
      .notNull(),
    driversPersonIds: uuid("drivers_person_ids").array(),

    startDate: date("start_date").notNull(),
    durationMonthsPrimary: integer("duration_months_primary").notNull(),
    durationMonthsSecondary: integer("duration_months_secondary").notNull(),

    directSettlementRequested: boolean(
      "direct_settlement_requested",
    ).default(false),

    acknowledgments: jsonb("acknowledgments").$type<{
      gdprAt: string;
      precontractualAt: string;
      noConsultancyAt: string;
    }>(),

    status: quoteStatusEnum("status").default("pending"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => [
    index("quote_searches_user_idx").on(table.userId),
    index("quote_searches_status_idx").on(table.status),
  ],
);

export const quoteOffers = pgTable(
  "quote_offers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quoteSearchId: uuid("quote_search_id")
      .references(() => quoteSearches.id)
      .notNull(),

    insurerCode: text("insurer_code").notNull(),
    durationMonths: integer("duration_months").notNull(),

    premiumNet: numeric("premium_net", { precision: 10, scale: 2 }),
    brokerCommission: numeric("broker_commission", {
      precision: 10,
      scale: 2,
    }),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }),
    currency: text("currency").default("RON"),

    bonusMalusClass: text("bonus_malus_class"),
    directSettlementDelta: numeric("direct_settlement_delta", {
      precision: 10,
      scale: 2,
    }),

    excludedCountries: text("excluded_countries").array(),
    externalOfferCode: text("external_offer_code"),

    isAvailable: boolean("is_available").default(true),
    unavailableReason: text("unavailable_reason"),
    documentsUrl: text("documents_url"),

    rawResponse: jsonb("raw_response"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("quote_offers_search_idx").on(table.quoteSearchId),
    index("quote_offers_insurer_idx").on(table.insurerCode),
  ],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    policyId: uuid("policy_id"),
    quoteOfferId: uuid("quote_offer_id")
      .references(() => quoteOffers.id)
      .notNull(),

    stripePaymentIntentId: text("stripe_payment_intent_id")
      .unique()
      .notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }),
    currency: text("currency").default("RON"),
    status: paymentStatusEnum("status"),
    paymentMethod: paymentMethodEnum("payment_method"),
    failureReason: text("failure_reason"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("payments_user_idx").on(table.userId),
    index("payments_policy_idx").on(table.policyId),
    uniqueIndex("payments_stripe_pi_unique").on(table.stripePaymentIntentId),
  ],
);

export const policies = pgTable(
  "policies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    policyType: policyTypeEnum("policy_type").notNull(),
    policyNumber: text("policy_number"),
    insurerCode: text("insurer_code").notNull(),

    subjectSnapshot: jsonb("subject_snapshot"),
    ownerSnapshot: jsonb("owner_snapshot"),

    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    durationMonths: integer("duration_months").notNull(),
    status: policyStatusEnum("status").default("active"),

    premiumNet: numeric("premium_net", { precision: 10, scale: 2 }),
    brokerCommission: numeric("broker_commission", {
      precision: 10,
      scale: 2,
    }),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }),
    currency: text("currency").default("RON"),

    paymentId: uuid("payment_id").references(() => payments.id),

    externalPolicyNumber: text("external_policy_number"),
    pdfUrl: text("pdf_url"),
    pdfHash: text("pdf_hash"),
    ipidUrl: text("ipid_url"),

    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    cancellationReason: text("cancellation_reason"),
    withdrawalUntil: date("withdrawal_until"),

    issuedAt: timestamp("issued_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    anonymizedAt: timestamp("anonymized_at", { withTimezone: true }),
  },
  (table) => [
    index("policies_user_idx").on(table.userId),
    index("policies_type_status_idx").on(table.policyType, table.status),
    uniqueIndex("policies_number_unique").on(table.policyNumber),
  ],
);

export const rcaPolicyDetails = pgTable(
  "rca_policy_details",
  {
    policyId: uuid("policy_id")
      .primaryKey()
      .references(() => policies.id),
    vehicleId: uuid("vehicle_id")
      .references(() => vehicles.id)
      .notNull(),
    driversSnapshot: jsonb("drivers_snapshot"),
    leasingSnapshot: jsonb("leasing_snapshot"),
    bonusMalusClass: text("bonus_malus_class"),
    directSettlement: boolean("direct_settlement").default(false),
    excludedCountries: text("excluded_countries").array(),
    baarCode: text("baar_code"),
  },
);

export const insurers = pgTable(
  "insurers",
  {
    code: text("code").primaryKey(),
    name: text("name"),
    active: boolean("active").default(true),
    brokerCommissionPct: numeric("broker_commission_pct", {
      precision: 5,
      scale: 2,
    }),
    apiEndpoint: text("api_endpoint"),
    apiCredentialsSecretId: text("api_credentials_secret_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
);

export const notificationsLog = pgTable(
  "notifications_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    policyId: uuid("policy_id").references(() => policies.id),
    channel: notificationChannelEnum("channel"),
    templateKey: text("template_key"),
    recipient: text("recipient"),
    status: text("status"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
  },
  (table) => [
    index("notifications_user_idx").on(table.userId),
    index("notifications_policy_idx").on(table.policyId),
  ],
);

export const consentsLog = pgTable(
  "consents_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    consentType: text("consent_type"),
    granted: boolean("granted"),
    source: text("source"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("consents_user_idx").on(table.userId)],
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    vehicleId: uuid("vehicle_id").references(() => vehicles.id),
    personId: uuid("person_id").references(() => persons.id),
    policyId: uuid("policy_id").references(() => policies.id),
    type: text("type"),
    fileUrl: text("file_url"),
    mimeType: text("mime_type"),
    sizeBytes: integer("size_bytes"),
    ocrExtracted: jsonb("ocr_extracted"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("documents_user_idx").on(table.userId),
    index("documents_policy_idx").on(table.policyId),
    index("documents_vehicle_idx").on(table.vehicleId),
  ],
);

export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: text("source"),
    eventId: text("event_id").unique(),
    payload: jsonb("payload"),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    error: text("error"),
  },
);

export const legalDocuments = pgTable(
  "legal_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: text("type"),
    version: integer("version"),
    contentUrl: text("content_url"),
    effectiveDate: date("effective_date"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
);

export const userConsents = pgTable(
  "user_consents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    documentId: uuid("document_id").references(() => legalDocuments.id),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
  },
  (table) => [
    index("user_consents_user_idx").on(table.userId),
    index("user_consents_doc_idx").on(table.documentId),
  ],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id"),
    actorId: uuid("actor_id"),
    action: text("action"),
    fieldName: text("field_name"),
    recordId: uuid("record_id"),
    reason: text("reason"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("audit_log_user_idx").on(table.userId),
    index("audit_log_action_idx").on(table.action),
  ],
);

export const apiClients = pgTable(
  "api_clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    apiKeyHash: text("api_key_hash"),
    apiKeyPrefix: text("api_key_prefix"),
    apiKeyBcrypt: text("api_key_bcrypt"),
    rateLimitPerMin: integer("rate_limit_per_min").default(60),
    rateLimitConfig: jsonb("rate_limit_config").$type<Record<string, { requests: number; window: `${number} s` | `${number} m` }>>(),
    allowedEndpoints: text("allowed_endpoints").array(),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (table) => [
    index("api_clients_prefix_idx").on(table.apiKeyPrefix),
  ],
);

export const pushTokenPlatformEnum = pgEnum("push_token_platform", [
  "ios",
  "android",
]);

export const pushTokens = pgTable(
  "push_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    token: text("token").notNull(),
    platform: pushTokenPlatformEnum("platform").notNull(),
    deviceId: text("device_id"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("push_tokens_user_idx").on(table.userId),
    uniqueIndex("push_tokens_token_unique").on(table.token),
  ],
);

export const appConfig = pgTable("app_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  type: text("type").notNull().default("string"),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  updatedBy: uuid("updated_by"),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertVehicleSchema = createInsertSchema(vehicles);
export const selectVehicleSchema = createSelectSchema(vehicles);
export const insertQuoteSearchSchema = createInsertSchema(quoteSearches);
export const selectQuoteSearchSchema = createSelectSchema(quoteSearches);
export const insertPolicySchema = createInsertSchema(policies);
export const selectPolicySchema = createSelectSchema(policies);
export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);
