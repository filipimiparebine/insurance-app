CREATE TYPE "public"."id_doc_type" AS ENUM('ci', 'bi', 'passport');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('email', 'sms', 'push');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('card', 'apple_pay', 'google_pay', 'link');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'succeeded', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."person_type" AS ENUM('individual', 'company');--> statement-breakpoint
CREATE TYPE "public"."policy_status" AS ENUM('active', 'cancelled', 'expired', 'pending', 'pending_cancellation');--> statement-breakpoint
CREATE TYPE "public"."policy_type" AS ENUM('rca', 'casco', 'home', 'health', 'travel', 'life');--> statement-breakpoint
CREATE TYPE "public"."quote_status" AS ENUM('pending', 'completed', 'failed', 'high_risk', 'expired');--> statement-breakpoint
CREATE TYPE "public"."vehicle_registration_status" AS ENUM('registered', 'pending_registration', 'mayor_registered');--> statement-breakpoint
CREATE TYPE "public"."vehicle_registration_subtype" AS ENUM('second_hand_ro', 'foreign', 'new_dealer_ro');--> statement-breakpoint
CREATE TABLE "api_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"api_key_hash" text,
	"rate_limit_per_min" integer DEFAULT 60,
	"allowed_endpoints" text[],
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"actor_id" uuid,
	"action" text,
	"field_name" text,
	"record_id" uuid,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consents_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"consent_type" text,
	"granted" boolean,
	"source" text,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"vehicle_id" uuid,
	"person_id" uuid,
	"policy_id" uuid,
	"type" text,
	"file_url" text,
	"mime_type" text,
	"size_bytes" integer,
	"ocr_extracted" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insurers" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text,
	"active" boolean DEFAULT true,
	"broker_commission_pct" numeric(5, 2),
	"api_endpoint" text,
	"api_credentials_secret_id" text
);
--> statement-breakpoint
CREATE TABLE "leasing_companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"cui" text,
	"active" boolean DEFAULT true,
	"is_user_added" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "legal_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text,
	"version" integer,
	"content_url" text,
	"effective_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"policy_id" uuid,
	"channel" "notification_channel",
	"template_key" text,
	"recipient" text,
	"status" text,
	"sent_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"policy_id" uuid,
	"quote_offer_id" uuid NOT NULL,
	"stripe_payment_intent_id" text NOT NULL,
	"amount" numeric(10, 2),
	"currency" text DEFAULT 'RON',
	"status" "payment_status",
	"payment_method" "payment_method",
	"failure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "payments_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "persons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "person_type" NOT NULL,
	"cnp_encrypted" "bytea",
	"cnp_dek_wrapped" "bytea",
	"cnp_hmac" "bytea",
	"first_name" text,
	"last_name" text,
	"id_doc_type" "id_doc_type",
	"id_doc_series_encrypted" "bytea",
	"id_doc_number_encrypted" "bytea",
	"id_doc_expires_at" date,
	"license_year" integer,
	"has_no_license" boolean DEFAULT false,
	"cui_encrypted" "bytea",
	"cui_hmac" "bytea",
	"company_name" text,
	"company_type" text,
	"registration_number" text,
	"caen_code" text,
	"representative_first_name" text,
	"representative_last_name" text,
	"representative_role" text,
	"email" text,
	"phone" text,
	"address_county" text,
	"address_city" text,
	"address_street_type" text,
	"address_street" text,
	"address_number" text,
	"address_block" text,
	"address_apartment" text,
	"address_postal_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"anonymized_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"policy_type" "policy_type" NOT NULL,
	"policy_number" text,
	"insurer_code" text NOT NULL,
	"subject_snapshot" jsonb,
	"owner_snapshot" jsonb,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"duration_months" integer NOT NULL,
	"status" "policy_status" DEFAULT 'active',
	"premium_net" numeric(10, 2),
	"broker_commission" numeric(10, 2),
	"total_amount" numeric(10, 2),
	"currency" text DEFAULT 'RON',
	"payment_id" uuid,
	"pdf_url" text,
	"pdf_hash" text,
	"ipid_url" text,
	"cancelled_at" timestamp with time zone,
	"cancellation_reason" text,
	"withdrawal_until" date,
	"issued_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"anonymized_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "quote_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote_search_id" uuid NOT NULL,
	"insurer_code" text NOT NULL,
	"duration_months" integer NOT NULL,
	"premium_net" numeric(10, 2),
	"broker_commission" numeric(10, 2),
	"total_amount" numeric(10, 2),
	"currency" text DEFAULT 'RON',
	"bonus_malus_class" text,
	"direct_settlement_delta" numeric(10, 2),
	"excluded_countries" text[],
	"external_offer_code" text,
	"is_available" boolean DEFAULT true,
	"unavailable_reason" text,
	"documents_url" text,
	"raw_response" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quote_searches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"owner_person_id" uuid NOT NULL,
	"drivers_person_ids" uuid[],
	"start_date" date NOT NULL,
	"duration_months_primary" integer NOT NULL,
	"duration_months_secondary" integer NOT NULL,
	"direct_settlement_requested" boolean DEFAULT false,
	"acknowledgments" jsonb,
	"status" "quote_status" DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "rca_policy_details" (
	"policy_id" uuid PRIMARY KEY NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"drivers_snapshot" jsonb,
	"leasing_snapshot" jsonb,
	"bonus_malus_class" text,
	"direct_settlement" boolean DEFAULT false,
	"excluded_countries" text[],
	"baar_code" text
);
--> statement-breakpoint
CREATE TABLE "user_consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"document_id" uuid,
	"accepted_at" timestamp with time zone,
	"ip_address" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"email_hmac" "bytea",
	"phone" text,
	"locale" text DEFAULT 'ro',
	"preferences" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "users_email_hmac_unique" UNIQUE("email_hmac")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"registration_status" "vehicle_registration_status" NOT NULL,
	"registration_subtype" "vehicle_registration_subtype",
	"plate_number" text,
	"vin" text NOT NULL,
	"vin_hmac" "bytea",
	"make" text,
	"model" text,
	"vehicle_category" text,
	"vehicle_subcategory" text,
	"usage_type" text,
	"fuel_type" text,
	"year_of_manufacture" integer,
	"first_registration_date" date,
	"max_mass_kg" integer,
	"engine_capacity_cc" integer,
	"engine_power_kw" numeric,
	"seats_count" integer,
	"civ_series" text,
	"civ_unknown" boolean DEFAULT false,
	"mileage" integer,
	"itp_expires_at" date,
	"is_leasing" boolean DEFAULT false,
	"leasing_company_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text,
	"event_id" text,
	"payload" jsonb,
	"processed_at" timestamp with time zone,
	"error" text,
	CONSTRAINT "webhook_events_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
ALTER TABLE "consents_log" ADD CONSTRAINT "consents_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications_log" ADD CONSTRAINT "notifications_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications_log" ADD CONSTRAINT "notifications_log_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_quote_offer_id_quote_offers_id_fk" FOREIGN KEY ("quote_offer_id") REFERENCES "public"."quote_offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "persons" ADD CONSTRAINT "persons_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policies" ADD CONSTRAINT "policies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policies" ADD CONSTRAINT "policies_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_offers" ADD CONSTRAINT "quote_offers_quote_search_id_quote_searches_id_fk" FOREIGN KEY ("quote_search_id") REFERENCES "public"."quote_searches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_searches" ADD CONSTRAINT "quote_searches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_searches" ADD CONSTRAINT "quote_searches_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_searches" ADD CONSTRAINT "quote_searches_owner_person_id_persons_id_fk" FOREIGN KEY ("owner_person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rca_policy_details" ADD CONSTRAINT "rca_policy_details_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rca_policy_details" ADD CONSTRAINT "rca_policy_details_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_consents" ADD CONSTRAINT "user_consents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_consents" ADD CONSTRAINT "user_consents_document_id_legal_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."legal_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_leasing_company_id_leasing_companies_id_fk" FOREIGN KEY ("leasing_company_id") REFERENCES "public"."leasing_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_user_idx" ON "audit_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_log_action_idx" ON "audit_log" USING btree ("action");--> statement-breakpoint
CREATE INDEX "consents_user_idx" ON "consents_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "documents_user_idx" ON "documents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "documents_policy_idx" ON "documents" USING btree ("policy_id");--> statement-breakpoint
CREATE INDEX "documents_vehicle_idx" ON "documents" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_policy_idx" ON "notifications_log" USING btree ("policy_id");--> statement-breakpoint
CREATE INDEX "payments_user_idx" ON "payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payments_policy_idx" ON "payments" USING btree ("policy_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_stripe_pi_unique" ON "payments" USING btree ("stripe_payment_intent_id");--> statement-breakpoint
CREATE INDEX "persons_user_idx" ON "persons" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "persons_cnp_hmac_idx" ON "persons" USING btree ("cnp_hmac");--> statement-breakpoint
CREATE INDEX "persons_cui_hmac_idx" ON "persons" USING btree ("cui_hmac");--> statement-breakpoint
CREATE INDEX "policies_user_idx" ON "policies" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "policies_type_status_idx" ON "policies" USING btree ("policy_type","status");--> statement-breakpoint
CREATE UNIQUE INDEX "policies_number_unique" ON "policies" USING btree ("policy_number");--> statement-breakpoint
CREATE INDEX "quote_offers_search_idx" ON "quote_offers" USING btree ("quote_search_id");--> statement-breakpoint
CREATE INDEX "quote_offers_insurer_idx" ON "quote_offers" USING btree ("insurer_code");--> statement-breakpoint
CREATE INDEX "quote_searches_user_idx" ON "quote_searches" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quote_searches_status_idx" ON "quote_searches" USING btree ("status");--> statement-breakpoint
CREATE INDEX "user_consents_user_idx" ON "user_consents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_consents_doc_idx" ON "user_consents" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "users_clerk_idx" ON "users" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "vehicles_user_idx" ON "vehicles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vehicles_vin_idx" ON "vehicles" USING btree ("vin");--> statement-breakpoint
CREATE INDEX "vehicles_plate_idx" ON "vehicles" USING btree ("plate_number");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicles_vin_unique" ON "vehicles" USING btree ("vin");