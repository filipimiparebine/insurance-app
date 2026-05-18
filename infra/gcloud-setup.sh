#!/usr/bin/env bash
# =============================================================================
# Insurtech GCP Project Setup
# TEC-108: Create GCP project and enable KMS API
# =============================================================================
# Prerequisites: gcloud CLI installed and authenticated (Step 1 is manual)
# Usage: ./gcloud-setup.sh
# =============================================================================

set -euo pipefail

PROJECT_ID="insurtech-platform-mvp"
PROJECT_NAME="Insurtech Platform MVP"
BILLING_ACCOUNT=""
REGION="europe-west3"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# ---------------------------------------------------------------------------
# Step 0: Verify authentication
# ---------------------------------------------------------------------------
log_info "Checking gcloud authentication..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | grep -q '@'; then
    log_error "No active gcloud account found."
    echo ""
    echo "  You must complete Step 1 manually:"
    echo "    1. Go to https://console.cloud.google.com"
    echo "    2. Sign up / sign in with the company email"
    echo "    3. Run: gcloud auth login"
    echo "    4. Run: gcloud auth application-default login"
    echo "    5. Re-run this script"
    echo ""
    exit 1
fi

ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
log_info "Authenticated as: $ACTIVE_ACCOUNT"

# ---------------------------------------------------------------------------
# Step 1: Check if project exists
# ---------------------------------------------------------------------------
log_info "Checking if project '$PROJECT_ID' exists..."
if gcloud projects describe "$PROJECT_ID" &>/dev/null; then
    log_warn "Project '$PROJECT_ID' already exists, skipping creation."
else
    log_info "Creating project: $PROJECT_ID ($PROJECT_NAME)..."
    gcloud projects create "$PROJECT_ID" \
        --name="$PROJECT_NAME" \
        --set-as-default

    log_info "Project created. Project ID: $PROJECT_ID"

    # -----------------------------------------------------------------------
    # Step 2: Link billing account
    # -----------------------------------------------------------------------
    log_info "Checking billing accounts..."
    BILLING_ACCOUNTS=$(gcloud beta billing accounts list --format="value(name,displayName,open)" 2>/dev/null || echo "")

    if [ -z "$BILLING_ACCOUNTS" ]; then
        log_error "No billing accounts found."
        echo "  Ensure a billing account is set up at: https://console.cloud.google.com/billing"
        echo "  Then re-run this script."
        exit 1
    fi

    BILLING_COUNT=$(echo "$BILLING_ACCOUNTS" | grep -c "True" || echo "0")

    if [ "$BILLING_COUNT" -eq 1 ]; then
        BILLING_ACCOUNT=$(echo "$BILLING_ACCOUNTS" | grep "True" | awk '{print $1}')
        log_info "Using billing account: $BILLING_ACCOUNT"
    else
        log_info "Available billing accounts:"
        echo "$BILLING_ACCOUNTS" | while read -r line; do
            echo "  $line"
        done
        echo ""
        read -r -p "Enter the billing account ID to use: " BILLING_ACCOUNT
    fi

    log_info "Linking billing account '$BILLING_ACCOUNT' to project '$PROJECT_ID'..."
    gcloud beta billing projects link "$PROJECT_ID" \
        --billing-account="$BILLING_ACCOUNT"

    log_info "Billing account linked."
fi

# ---------------------------------------------------------------------------
# Step 3: Set as active project
# ---------------------------------------------------------------------------
log_info "Setting active project to: $PROJECT_ID"
gcloud config set project "$PROJECT_ID"
gcloud config set compute/region "$REGION"

# ---------------------------------------------------------------------------
# Step 4: Enable Cloud KMS API
# ---------------------------------------------------------------------------
log_info "Enabling Cloud KMS API..."
gcloud services enable cloudkms.googleapis.com --project="$PROJECT_ID"

log_info "Verifying KMS API is enabled..."
gcloud services list --enabled --project="$PROJECT_ID" --filter="name:cloudkms.googleapis.com"

# ---------------------------------------------------------------------------
# Step 5: Verify and output
# ---------------------------------------------------------------------------
echo ""
echo "================================================================================"
log_info "GCP Setup Complete!"
echo "================================================================================"
echo ""
echo "  Project ID:    $PROJECT_ID"
echo "  Project Name:  $PROJECT_NAME"
echo "  Region:        $REGION"
echo "  KMS API:       Enabled"
echo ""
echo "--------------------------------------------------------------------------------"
echo "Next steps for Terraform provisioning:"
echo "--------------------------------------------------------------------------------"
echo ""
echo "  1. Update terraform.tfvars with the project ID:"
echo "     echo 'gcp_project_id = \"$PROJECT_ID\"' >> infra/terraform/terraform.tfvars"
echo ""
echo "  2. Uncomment the GCP KMS module in main.tf (lines 1-10)"
echo ""
echo "  3. Uncomment the Google provider block in providers.tf (lines 24-27)"
echo ""
echo "  4. Run terraform:"
echo "     cd infra/terraform"
echo "     terraform init"
echo "     terraform plan -out=tfplan"
echo "     terraform apply tfplan"
echo ""
echo "  5. Post the project ID to TEC-37"
echo ""
echo "================================================================================"

# Output for TEC-37
echo "PROJECT_ID=$PROJECT_ID" > /tmp/tec108-gcp-output.txt
log_info "Credentials output written to: /tmp/tec108-gcp-output.txt"
