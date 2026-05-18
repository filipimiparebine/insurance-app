#!/bin/bash
# Neon Postgres provisioning script for blaj.io
# Usage: bash scripts/provision-neon.sh
# Requires: neonctl CLI (npm install -g neonctl)
# Requires: NEON_API_KEY env var or `neonctl auth` to be completed first

set -euo pipefail

PROJECT_NAME="blaj"
REGION="aws-eu-central-1"
DB_NAME="blaj"
PITR_RETENTION_DAYS=7
PITR_ENABLED=true
BRANCH_NAME_PREFIX="pr-"

echo "=== Provisioning Neon Postgres for blaj.io ==="

if ! command -v neonctl &>/dev/null; then
  echo "Installing neonctl..."
  npm install -g neonctl
fi

if [ -n "${NEON_API_KEY:-}" ]; then
  echo "Using NEON_API_KEY for authentication"
elif neonctl me &>/dev/null 2>&1; then
  echo "Using neonctl cached auth"
else
  echo "Authenticate with Neon first: neonctl auth"
  echo "Or export NEON_API_KEY=<your-key>"
  exit 1
fi

echo "Creating Neon project: $PROJECT_NAME in $REGION..."
PROJECT_ID=$(neonctl projects create \
  --name "$PROJECT_NAME" \
  --region-id "$REGION" \
  --output json | jq -r '.project.id')

echo "Project created: $PROJECT_ID"

echo "Configuring PITR (${PITR_RETENTION_DAYS}d retention)..."
# PITR is a project-level setting; apply via API
if [ -n "${NEON_API_KEY:-}" ]; then
  curl -s -X PATCH "https://api.neon.tech/v2/projects/${PROJECT_ID}" \
    -H "Authorization: Bearer $NEON_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"project\": {
        \"pitr_enabled\": ${PITR_ENABLED},
        \"pitr_retention_period_days\": ${PITR_RETENTION_DAYS}
      }
    }" > /dev/null
  echo "PITR configured: ${PITR_RETENTION_DAYS}d retention"
else
  echo "Skipping PITR config (requires NEON_API_KEY for direct API call)"
  echo "  Configure manually: neonctl projects update --pitr-enabled --pitr-retention-period-days ${PITR_RETENTION_DAYS}"
fi

echo "Creating database: $DB_NAME..."
neonctl databases create \
  --name "$DB_NAME" \
  --project-id "$PROJECT_ID" \
  --owner-name "blaj_app"

echo "Setting up ephemeral database branching for per-PR environments..."
# Create a branch policy template: branches are created on-demand
# Document the branch creation command for CI/CD
echo "  Branch creation command (for CI):"
echo "  neonctl branches create --project-id \"${PROJECT_ID}\" --name \"${BRANCH_NAME_PREFIX}<PR_NUMBER>\""
echo ""
echo "  Branch deletion command (for CI):"
echo "  neonctl branches delete --project-id \"${PROJECT_ID}\" --branch-id <branch-id>"

echo "Getting connection string..."
CONN_STRING=$(neonctl connection-string \
  --project-id "$PROJECT_ID" \
  --database-name "$DB_NAME" \
  --role-name "blaj_app" \
  --pooled)

UNPOOLED=$(neonctl connection-string \
  --project-id "$PROJECT_ID" \
  --database-name "$DB_NAME" \
  --role-name "blaj_app")

echo ""
echo "=== Provisioning complete ==="
echo "Add to .env:"
echo "DATABASE_URL=$CONN_STRING"
echo "DATABASE_URL_UNPOOLED=$UNPOOLED"
echo "NEON_PROJECT_ID=$PROJECT_ID"
echo ""
echo "Next: cd packages/db && pnpm db:migrate && pnpm db:seed"
