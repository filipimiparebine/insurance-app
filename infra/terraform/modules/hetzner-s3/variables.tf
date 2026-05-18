variable "bucket_prefix" {
  description = "Prefix for all S3 bucket names (e.g., 'insurtech-prod' or 'insurtech-staging')"
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]*[a-z0-9]$", var.bucket_prefix))
    error_message = "Bucket prefix must be lowercase alphanumeric with hyphens."
  }
}

variable "tags" {
  description = "Tags to apply to all S3 buckets"
  type        = map(string)
  default     = {}
}

variable "document_version_expiration_days" {
  description = "Days until noncurrent document versions expire (0 to disable)"
  type        = number
  default     = 2555
}

variable "backup_versioning_enabled" {
  description = "Enable versioning on the backups bucket"
  type        = bool
  default     = true
}

variable "backup_expiration_days" {
  description = "Days until backup objects expire (0 to disable)"
  type        = number
  default     = 90
}

variable "cors_allowed_origins" {
  description = "List of origins allowed for CORS on the static assets bucket"
  type        = list(string)
  default     = ["https://blaj.io", "https://www.blaj.io"]
}

variable "endpoint_url" {
  description = "Hetzner S3 endpoint URL"
  type        = string
  default     = "https://fsn1.your-objectstorage.com"
}

variable "region" {
  description = "Hetzner S3 region"
  type        = string
  default     = "fsn1"
}
