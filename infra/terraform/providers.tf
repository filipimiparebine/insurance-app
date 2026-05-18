terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    upstash = {
      source  = "upstash/upstash"
      version = "~> 1.0"
    }
  }

  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = "europe-west3"
}

provider "aws" {
  region     = "fsn1"
  access_key = var.hetzner_s3_access_key
  secret_key = var.hetzner_s3_secret_key

  endpoints {
    s3 = var.hetzner_s3_endpoint
  }

  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_region_validation      = true
  skip_metadata_api_check     = true
}

provider "upstash" {
  email   = var.upstash_email
  api_key = var.upstash_api_key
}
