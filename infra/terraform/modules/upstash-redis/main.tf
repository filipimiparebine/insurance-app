resource "upstash_redis_database" "quotes_cache" {
  database_name = "${var.name_prefix}-quotes"
  region        = var.region
  tls           = true
}

resource "upstash_redis_database" "rate_limiter" {
  database_name = "${var.name_prefix}-ratelimit"
  region        = var.region
  tls           = true
}
