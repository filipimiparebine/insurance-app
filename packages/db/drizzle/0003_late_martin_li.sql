ALTER TABLE "api_clients" ADD COLUMN "api_key_prefix" text;--> statement-breakpoint
ALTER TABLE "api_clients" ADD COLUMN "api_key_bcrypt" text;--> statement-breakpoint
CREATE INDEX "api_clients_prefix_idx" ON "api_clients" USING btree ("api_key_prefix");
