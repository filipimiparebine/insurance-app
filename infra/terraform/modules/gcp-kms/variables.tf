variable "project_id" {
  description = "GCP project ID where KMS resources will be created"
  type        = string
}

variable "key_ring_name" {
  description = "Name of the KMS key ring"
  type        = string
  default     = "insurtech-keyring"

  validation {
    condition     = can(regex("^[a-zA-Z0-9_-]+$", var.key_ring_name))
    error_message = "Key ring name must contain only alphanumeric characters, hyphens, and underscores."
  }
}

variable "key_name" {
  description = "Name of the KEK (Key Encryption Key)"
  type        = string
  default     = "insurtech-kek"

  validation {
    condition     = length(var.key_name) >= 1 && length(var.key_name) <= 63
    error_message = "Key name must be 1-63 characters."
  }
}

variable "location" {
  description = "GCP region or multi-region for the key ring"
  type        = string
  default     = "europe"

  validation {
    condition     = contains(["europe", "europe-west1", "europe-west2", "europe-west3", "europe-west4", "europe-west6", "europe-west8", "europe-west9", "europe-central2", "europe-north1", "europe-southwest1"], var.location)
    error_message = "Location must be a valid EU GCP region or the 'europe' multi-region."
  }
}

variable "rotation_period" {
  description = "Auto-rotation period for the KEK (suffix s for seconds, e.g. 2592000s = 30 days)"
  type        = string
  default     = "2592000s"
}

variable "key_algorithm" {
  description = "Algorithm for the crypto key"
  type        = string
  default     = "GOOGLE_SYMMETRIC_ENCRYPTION"

  validation {
    condition     = contains(["GOOGLE_SYMMETRIC_ENCRYPTION", "EC_SIGN_P256_SHA256", "RSA_SIGN_PKCS1_2048_SHA256"], var.key_algorithm)
    error_message = "Key algorithm must be a valid GCP KMS algorithm."
  }
}

variable "protection_level" {
  description = "Protection level for the crypto key"
  type        = string
  default     = "HSM"

  validation {
    condition     = contains(["SOFTWARE", "HSM", "EXTERNAL", "EXTERNAL_VPC"], var.protection_level)
    error_message = "Protection level must be SOFTWARE, HSM, EXTERNAL, or EXTERNAL_VPC."
  }
}

variable "service_accounts" {
  description = "List of service accounts with encrypt/decrypt access. Use full principal format (serviceAccount:email)."
  type        = list(string)
  default     = []
}
