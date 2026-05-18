# =============================================================================
# Insurtech Infrastructure — Provisioning Guide
# =============================================================================
# Issue: TEC-15 — GCP KMS + Hetzner S3 + Upstash Redis EU provisioning
# =============================================================================

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        EU Infrastructure                            │
│                                                                     │
│  ┌───────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │   GCP Cloud KMS   │  │  Hetzner S3      │  │  Upstash Redis   │ │
│  │   europe multi    │  │  fsn1            │  │  eu-central-1    │ │
│  │   (HSM-backed)    │  │  (Falkenstein)   │  │  (Frankfurt)     │ │
│  └────────┬──────────┘  └────────┬─────────┘  └────────┬─────────┘ │
│           │                      │                      │           │
│  ┌────────▼──────────┐  ┌────────▼─────────┐  ┌────────▼─────────┐ │
│  │ KEK (auto-rotate  │  │ documents (ver)  │  │ quotes-cache     │ │
│  │  monthly, HSM)    │  │ backups          │  │ rate-limiter     │ │
│  │                   │  │ static (CDN)     │  │                  │ │
│  └───────────────────┘  └──────────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Prerequisites

### 1. GCP Cloud KMS
- GCP project with billing enabled
- KMS API enabled: `gcloud services enable cloudkms.googleapis.com`
- Service account with `roles/cloudkms.admin` (create keys) and `roles/iam.serviceAccountAdmin` (bind IAM)
- Authenticate: `gcloud auth application-default login`

### 2. Hetzner S3
- Hetzner Cloud account with Object Storage access
- Generate S3 access key and secret key from Hetzner Cloud Console → Object Storage

### 3. Upstash Redis
- Upstash account at https://console.upstash.com
- Generate API key from Account → API Keys

## Quick Start

```bash
cd infra/terraform

# Copy and fill in credentials
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with actual credentials

# Initialize
terraform init

# Plan
terraform plan -out=tfplan

# Apply
terraform apply tfplan

# View outputs (connection strings, resource IDs)
terraform output

# View sensitive outputs
terraform output -json | jq '.'
```

## Credentials Needed

| Service    | Variable                    | How to Obtain                                        |
|------------|----------------------------|------------------------------------------------------|
| GCP KMS    | `gcp_project_id`           | GCP Console → Project Selector                       |
| Hetzner S3 | `hetzner_s3_access_key`    | Hetzner Cloud Console → Object Storage → Credentials |
| Hetzner S3 | `hetzner_s3_secret_key`    | Hetzner Cloud Console → Object Storage → Credentials |
| Upstash    | `upstash_email`            | Upstash Console → Account Settings                   |
| Upstash    | `upstash_api_key`          | Upstash Console → API Keys                           |

## EU Compliance Evidence

| Service      | Region           | Evidence                                            |
|-------------|------------------|-----------------------------------------------------|
| GCP KMS     | europe           | Multi-region covering all EU GCP datacenters         |
| Hetzner S3  | fsn1             | Falkenstein, Germany (ISO 27001 certified)           |
| Upstash Redis | eu-central-1   | Frankfurt, Germany (SOC 2, GDPR compliant)           |

## Module Reference

### gcp-kms
- Creates key ring in europe multi-region
- Generates KEK with HSM protection level
- Enables monthly auto-rotation (30 days)
- Binds encrypt/decrypt IAM role for service accounts

### hetzner-s3
- Creates 3 buckets: documents (versioned), backups, static (public)
- Configures CORS for static bucket
- Enables SSE-S3 encryption on all buckets
- Lifecycle policies for version expiration

### upstash-redis
- Provisions 2 serverless Redis databases
- TLS enabled by default
- Multi-zone replication for HA (prod only)

## Outputs (for downstream teams)

After `terraform apply`, provide these to:
- **Security Lead ([TEC-7](/TEC/issues/TEC-7))**: `gcp_kms_kek_resource_name`
- **Data Lead ([TEC-11](/TEC/issues/TEC-11))**: `hetzner_documents_bucket`, `hetzner_documents_endpoint`
- **Distributed Systems Engineer**: `upstash_quotes_connection_url`, `upstash_ratelimit_connection_url`
- **DevOps Lead ([TEC-9](/TEC/issues/TEC-9))**: `hetzner_static_bucket`, `hetzner_s3_region`
