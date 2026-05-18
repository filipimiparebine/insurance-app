module "gcp_kms" {
  source = "./modules/gcp-kms"

  project_id    = var.gcp_project_id
  key_ring_name = "insurtech-keyring-${var.environment}"
  key_name      = "insurtech-kek-${var.environment}"
  location      = "europe"

  service_accounts = []
}

module "hetzner_s3" {
  source = "./modules/hetzner-s3"

  bucket_prefix = "insurtech-${var.environment}"
  endpoint_url  = var.hetzner_s3_endpoint

  cors_allowed_origins = var.environment == "prod" ? [
    "https://blaj.io",
    "https://www.blaj.io"
    ] : [
    "https://staging.blaj.io",
    "http://localhost:3000"
  ]

  tags = var.tags
}

module "upstash_redis" {
  source = "./modules/upstash-redis"

  name_prefix = "insurtech-${var.environment}"
  region      = "eu-central-1"
}
