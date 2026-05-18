output "key_ring_id" {
  description = "Full resource ID of the KMS key ring"
  value       = google_kms_key_ring.key_ring.id
}

output "key_ring_name" {
  description = "Name of the KMS key ring"
  value       = google_kms_key_ring.key_ring.name
}

output "kek_id" {
  description = "Full resource ID of the Key Encryption Key (KEK)"
  value       = google_kms_crypto_key.kek.id
}

output "kek_name" {
  description = "Name of the KEK"
  value       = google_kms_crypto_key.kek.name
}

output "kek_resource_name" {
  description = "GCP resource name format for the KEK (for application config)"
  value       = "projects/${var.project_id}/locations/${var.location}/keyRings/${google_kms_key_ring.key_ring.name}/cryptoKeys/${google_kms_crypto_key.kek.name}"
}

output "kms_region" {
  description = "Region/multi-region of the KMS deployment (EU compliance evidence)"
  value       = var.location
}
