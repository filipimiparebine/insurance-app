ALTER TABLE "api_clients" ADD COLUMN "rate_limit_config" jsonb;--> statement-breakpoint
CREATE INDEX "api_clients_active_idx" ON "api_clients" USING btree ("active");
