CREATE TYPE "public"."push_token_platform" AS ENUM('ios', 'android');--> statement-breakpoint
CREATE TABLE "app_config" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"type" text DEFAULT 'string' NOT NULL,
	"description" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "push_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"platform" "push_token_platform" NOT NULL,
	"device_id" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "api_clients" ADD COLUMN "api_key_prefix" text;--> statement-breakpoint
ALTER TABLE "api_clients" ADD COLUMN "api_key_bcrypt" text;--> statement-breakpoint
ALTER TABLE "api_clients" ADD COLUMN "rate_limit_config" jsonb;--> statement-breakpoint
ALTER TABLE "legal_documents" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "push_tokens" ADD CONSTRAINT "push_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "push_tokens_user_idx" ON "push_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "push_tokens_token_unique" ON "push_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "api_clients_prefix_idx" ON "api_clients" USING btree ("api_key_prefix");