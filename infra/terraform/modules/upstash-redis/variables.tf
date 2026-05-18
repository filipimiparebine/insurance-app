variable "name_prefix" {
  description = "Prefix for Upstash Redis database names"
  type        = string
  default     = "insurtech"

  validation {
    condition     = can(regex("^[a-zA-Z0-9_-]+$", var.name_prefix))
    error_message = "Name prefix must be alphanumeric with hyphens and underscores."
  }
}

variable "region" {
  description = "Upstash region for Redis deployment"
  type        = string
  default     = "eu-central-1"

  validation {
    condition = contains([
      "eu-central-1",
      "eu-west-1",
      "eu-west-2",
      "us-east-1",
      "us-west-1",
      "ap-northeast-1",
      "ap-southeast-1",
    ], var.region)
    error_message = "Region must be a valid Upstash region in EU (eu-central-1, eu-west-1, eu-west-2)."
  }
}


