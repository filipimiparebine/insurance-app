output "quotes_cache_id" {
  description = "Database ID of the quotes cache Redis instance"
  value       = upstash_redis_database.quotes_cache.database_id
  sensitive   = true
}

output "quotes_cache_name" {
  description = "Name of the quotes cache Redis database"
  value       = upstash_redis_database.quotes_cache.database_name
}

output "quotes_cache_endpoint" {
  description = "Redis endpoint for the quotes cache"
  value       = upstash_redis_database.quotes_cache.endpoint
  sensitive   = true
}

output "quotes_cache_port" {
  description = "Redis port for the quotes cache"
  value       = upstash_redis_database.quotes_cache.port
}

output "quotes_cache_password" {
  description = "Redis password for the quotes cache"
  value       = upstash_redis_database.quotes_cache.password
  sensitive   = true
}

output "rate_limiter_id" {
  description = "Database ID of the rate limiter Redis instance"
  value       = upstash_redis_database.rate_limiter.database_id
  sensitive   = true
}

output "rate_limiter_name" {
  description = "Name of the rate limiter Redis database"
  value       = upstash_redis_database.rate_limiter.database_name
}

output "rate_limiter_endpoint" {
  description = "Redis endpoint for the rate limiter"
  value       = upstash_redis_database.rate_limiter.endpoint
  sensitive   = true
}

output "rate_limiter_port" {
  description = "Redis port for the rate limiter"
  value       = upstash_redis_database.rate_limiter.port
}

output "rate_limiter_password" {
  description = "Redis password for the rate limiter"
  value       = upstash_redis_database.rate_limiter.password
  sensitive   = true
}

output "redis_region" {
  description = "Upstash Redis region (EU compliance evidence)"
  value       = var.region
}

output "quotes_redis_connection_url" {
  description = "Redis connection URL for quotes cache (rediss:// for TLS)"
  value       = "rediss://default:${upstash_redis_database.quotes_cache.password}@${upstash_redis_database.quotes_cache.endpoint}:${upstash_redis_database.quotes_cache.port}"
  sensitive   = true
}

output "ratelimit_redis_connection_url" {
  description = "Redis connection URL for rate limiter (rediss:// for TLS)"
  value       = "rediss://default:${upstash_redis_database.rate_limiter.password}@${upstash_redis_database.rate_limiter.endpoint}:${upstash_redis_database.rate_limiter.port}"
  sensitive   = true
}
