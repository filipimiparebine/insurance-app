output "hetzner_documents_bucket" {
  description = "Hetzner S3 documents bucket name"
  value       = module.hetzner_s3.documents_bucket_name
}

output "hetzner_documents_endpoint" {
  description = "Hetzner S3 documents bucket endpoint"
  value       = module.hetzner_s3.documents_bucket_endpoint
}

output "hetzner_backups_bucket" {
  description = "Hetzner S3 backups bucket name"
  value       = module.hetzner_s3.backups_bucket_name
}

output "hetzner_static_bucket" {
  description = "Hetzner S3 static assets bucket name"
  value       = module.hetzner_s3.static_bucket_name
}

output "hetzner_s3_region" {
  description = "Hetzner S3 region (EU compliance)"
  value       = module.hetzner_s3.s3_region
}

output "upstash_quotes_redis_endpoint" {
  description = "Upstash Redis endpoint for quote caching"
  value       = module.upstash_redis.quotes_cache_endpoint
  sensitive   = true
}

output "upstash_quotes_redis_port" {
  description = "Upstash Redis port for quote caching"
  value       = module.upstash_redis.quotes_cache_port
}

output "upstash_ratelimit_redis_endpoint" {
  description = "Upstash Redis endpoint for rate limiting"
  value       = module.upstash_redis.rate_limiter_endpoint
  sensitive   = true
}

output "upstash_redis_region" {
  description = "Upstash Redis region (EU compliance)"
  value       = module.upstash_redis.redis_region
}

output "upstash_quotes_connection_url" {
  description = "Upstash Redis connection URL for quote caching"
  value       = module.upstash_redis.quotes_redis_connection_url
  sensitive   = true
}

output "upstash_ratelimit_connection_url" {
  description = "Upstash Redis connection URL for rate limiting"
  value       = module.upstash_redis.ratelimit_redis_connection_url
  sensitive   = true
}

output "gcp_kms_key_ring_id" {
  description = "GCP KMS key ring resource ID"
  value       = module.gcp_kms.key_ring_id
}

output "gcp_kms_kek_name" {
  description = "GCP KMS Key Encryption Key name"
  value       = module.gcp_kms.kek_name
}

output "gcp_kms_kek_resource_name" {
  description = "GCP resource name for the KEK (for application configuration)"
  value       = module.gcp_kms.kek_resource_name
}

output "gcp_kms_region" {
  description = "GCP KMS region (EU compliance evidence)"
  value       = module.gcp_kms.kms_region
}

output "eu_compliance_summary" {
  description = "EU compliance evidence for all provisioned services"
  value = {
    gcp_kms_location       = module.gcp_kms.kms_region
    hetzner_s3_location    = module.hetzner_s3.s3_region
    upstash_redis_location = module.upstash_redis.redis_region
    all_eu_compliant = (
      module.gcp_kms.kms_region == "europe" &&
      module.hetzner_s3.s3_region == "fsn1" &&
      module.upstash_redis.redis_region == "eu-central-1"
    )
  }
}
