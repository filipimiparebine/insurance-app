variable "gcp_project_id" {
  description = "GCP project ID where KMS resources will be created"
  type        = string
  sensitive   = true
}

variable "hetzner_s3_access_key" {
  description = "Hetzner S3 access key"
  type        = string
  sensitive   = true
}

variable "hetzner_s3_secret_key" {
  description = "Hetzner S3 secret key"
  type        = string
  sensitive   = true
}

variable "hetzner_s3_endpoint" {
  description = "Hetzner S3 endpoint URL"
  type        = string
  default     = "https://fsn1.your-objectstorage.com"
}

variable "upstash_email" {
  description = "Upstash account email"
  type        = string
  sensitive   = true
}

variable "upstash_api_key" {
  description = "Upstash API key for Terraform provider"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment name (prod, staging, dev)"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["prod", "staging", "dev"], var.environment)
    error_message = "Environment must be prod, staging, or dev."
  }
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "insurtech"
    Environment = "prod"
    ManagedBy   = "terraform"
  }
}
