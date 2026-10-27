#!/usr/bin/env bash
# ==============================================================================
# FairShift — Google Cloud Run Automated Deployment Script
# PromptWars × ACM SRM Student Chapter (2026)
# ==============================================================================
set -e

SERVICE_NAME="fairshift-sdg8"
REGION="asia-south1"

echo "=========================================================="
echo "🚀 FairShift — Google Cloud Run Deployment Pipeline"
echo "=========================================================="

# 1. Verify gcloud CLI
if ! command -v gcloud &> /dev/null; then
  echo "❌ Error: Google Cloud SDK ('gcloud') CLI is not found on PATH."
  echo "👉 To install via Homebrew on macOS:"
  echo "   brew install --cask google-cloud-sdk"
  echo "👉 Then authenticate:"
  echo "   gcloud auth login"
  echo "   gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

# 2. Check active authenticated project
ACTIVE_PROJECT=$(gcloud config get-value project 2>/dev/null || true)
if [ -z "$ACTIVE_PROJECT" ] || [ "$ACTIVE_PROJECT" = "(unset)" ]; then
  echo "❌ Error: No active Google Cloud project set in gcloud CLI."
  echo "👉 Run:"
  echo "   gcloud projects list"
  echo "   gcloud config set project <PROJECT_ID>"
  exit 1
fi

echo "✅ Active Google Cloud Project: $ACTIVE_PROJECT"
echo "✅ Target Region: $REGION"
echo "✅ Target Service Name: $SERVICE_NAME"
echo ""

# 3. Deploy source directly to Cloud Run (Cloud Build automatically compiles Dockerfile)
echo "📦 Initiating Cloud Run build and deployment from source repository..."
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production

echo ""
echo "=========================================================="
echo "🎉 Deployment Complete!"
echo "Service URL:"
gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format='value(status.url)'
echo "=========================================================="
