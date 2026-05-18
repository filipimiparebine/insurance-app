terraform {
  required_version = ">= 1.5.0"

  required_providers {
    upstash = {
      source  = "upstash/upstash"
      version = "~> 1.0"
    }
  }
}
