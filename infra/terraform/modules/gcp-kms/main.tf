resource "google_kms_key_ring" "key_ring" {
  name     = var.key_ring_name
  location = var.location
  project  = var.project_id
}

resource "google_kms_crypto_key" "kek" {
  name            = var.key_name
  key_ring        = google_kms_key_ring.key_ring.id
  rotation_period = var.rotation_period

  version_template {
    algorithm        = var.key_algorithm
    protection_level = var.protection_level
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_kms_crypto_key_iam_binding" "encrypt_decrypt" {
  crypto_key_id = google_kms_crypto_key.kek.id
  role          = "roles/cloudkms.cryptoKeyEncrypterDecrypter"

  members = var.service_accounts
}
