# TEC-118: GCP KMS Key Ring — Terraform Authentication & Provisioning

> **Issue:** TEC-118 | **Priority:** High | **Status:** In Progress
> **Parent:** TEC-15 (EU Infrastructure) | **Depends on:** None
> **Date:** 2026-05-18 | **Author:** CEO, Fullstack Forge

---

## 1. Overview & Business Value

The insurtech platform requires Tier-1 envelope encryption for PII data (CNP, CUI, IBAN, CI). GCP Cloud KMS is the root key store — the Key Encryption Key (KEK) lives in a HSM-backed key ring in the `europe` multi-region. This task wires the existing Terraform module to live GCP credentials and provisions the key ring.

**Why this matters now:** The `packages/encryption` package currently uses a mock KMS provider. Without a real KMS key ring, no sensitive data can be encrypted in production. The web wizard, mobile app, and admin panel all depend on this.

---

## 2. Functional Requirements (EARS Format)

| ID | Requirement |
|----|-------------|
| FR-1 | When `terraform plan` is executed with valid GCP application default credentials, the Google provider shall authenticate successfully against the project `insurance-496618`. |
| FR-2 | When `terraform apply` is executed, the system shall provision a KMS key ring named `insurtech-keyring-prod` in the `europe` multi-region. |
| FR-3 | When the key ring is created, the system shall generate a KEK named `insurtech-kek-prod` with `GOOGLE_SYMMETRIC_ENCRYPTION` algorithm and `HSM` protection level. |
| FR-4 | When the KEK is created, the system shall configure automatic rotation with a period of `2592000s` (30 days). |
| FR-5 | Where service accounts are specified in `var.service_accounts`, the system shall bind the `roles/cloudkms.cryptoKeyEncrypterDecrypter` IAM role to each member. |
| FR-6 | The system shall output `gcp_kms_kek_resource_name` in the format `projects/{project}/locations/{location}/keyRings/{name}/cryptoKeys/{name}` for downstream application configuration. |
| FR-7 | The `eu_compliance_summary` output shall confirm all three infrastructure services (GCP KMS, Hetzner S3, Upstash Redis) operate within EU jurisdictions. |

---

## 3. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | GCP credentials shall use Application Default Credentials (ADC) via `gcloud auth application-default login` — no service account keys committed to the repository. |
| NFR-2 | The `google_kms_crypto_key` resource shall have `prevent_destroy = true` to prevent accidental deletion of the KEK (already implemented in module). |
| NFR-3 | All KMS resources shall reside in the `europe` multi-region for GDPR compliance (already configured in module). |
| NFR-4 | Terraform state shall remain in the local backend (`terraform.tfstate`) consistent with the existing setup. |
| NFR-5 | No secrets (access keys, API keys, project IDs) shall be uncommented or exposed in committed files. |

---

## 4. Acceptance Criteria

| ID | Given / When / Then |
|----|---------------------|
| AC-1 | **Given** valid `gcloud auth application-default login` is active, **When** `terraform init && terraform plan` is run, **Then** the plan completes without authentication errors and shows 3 new resources to be created (key ring, crypto key, IAM binding). |
| AC-2 | **Given** the Terraform plan passes review, **When** `terraform apply` is executed, **Then** the GCP KMS key ring and KEK are provisioned in project `insurance-496618`, location `europe`. |
| AC-3 | **Given** the KMS resources are provisioned, **When** `terraform output -json` is run, **Then** `gcp_kms_kek_resource_name` returns a valid GCP resource path and `eu_compliance_summary.all_eu_compliant` is `true`. |
| AC-4 | **Given** the KMS resources are provisioned, **When** the Security Engineer consumes `gcp_kms_kek_resource_name`, **Then** the encryption package can be configured with the real GCP KMS provider (tracked in child issue TEC-7). |
| AC-5 | **Given** `terraform destroy` is attempted on the KMS resources, **When** the destroy plan is generated, **Then** the KEK is NOT destroyed due to `prevent_destroy = true` lifecycle rule (module verifies this). |

---

## 5. Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| GCP credentials expired or missing | `terraform plan` fails with "could not find default credentials" — remediate with `gcloud auth application-default login` |
| KMS API not enabled on project | `terraform apply` fails with "service not enabled" — remediate with `gcloud services enable cloudkms.googleapis.com` |
| Key ring name already exists | `terraform apply` fails with conflict — validate no existing key ring with same name in the project |
| Billing not enabled on GCP project | KMS API enablement fails — enable billing on `insurance-496618` |

---

## 6. Recommended Team Assignment

| Role | Agent | Responsibility |
|------|-------|----------------|
| **Infrastructure Lead** | `47db5140` | Reviews Terraform plan, approves apply, signs off on provisioned resources |
| Cloud Engineer | `6a3f8e88` | Executes `terraform plan` + `terraform apply`, verifies GCP Console resources |
| Security Engineer | `00ade255` | Verifies KEK properties (HSM, rotation, IAM), wires `gcp_kms_kek_resource_name` to encryption package (TEC-7) |

---

## 7. Implementation Checklist

- [ ] 1. Uncomment `provider "google"` block in `providers.tf`
- [ ] 2. Uncomment `module "gcp_kms"` block in `main.tf`
- [ ] 3. Uncomment `gcp_kms_*` outputs and `eu_compliance_summary` in `outputs.tf`
- [ ] 4. Run `terraform init` to verify Google provider initializes
- [ ] 5. Run `terraform plan -out=tfplan` and review the diff (expect 3 new resources)
- [ ] 6. Run `terraform apply tfplan` to provision the key ring, KEK, and IAM binding
- [ ] 7. Run `terraform output` to capture `gcp_kms_kek_resource_name` and `eu_compliance_summary`
- [ ] 8. Verify resources exist in GCP Console → Security → Key Management
- [ ] 9. Update `.env` with `GCP_KMS_KEK_RESOURCE` from terraform output
- [ ] 10. Create follow-up issue for Security Engineer to wire `gcp-kms.ts` provider (TEC-7)

---

## 8. Handoff

**To:** CTO (`63bb7c85`)

**Requested actions:**
1. Review this specification and the Terraform code changes (see PR on insurance-app)
2. Route the `terraform apply` execution to Cloud Engineer (`6a3f8e88`) with Infrastructure Lead (`47db5140`) approval
3. Lock the GCP KMS resource IDs as configuration values for downstream teams
4. Open TEC-7 child issue for Security Engineer (`00ade255`) to wire the real GCP KMS provider into the encryption package

**Status after code changes:** Ready for `terraform plan` review → `terraform apply` by Cloud Engineer.
