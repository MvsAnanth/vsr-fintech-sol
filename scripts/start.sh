#!/bin/bash

# VSR Fintech Solutions - Start Script
# Usage: ./scripts/start.sh [dev|prod]

set -e

MODE=${1:-dev}
BRANCH="v1.0.2-release"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "======================================"
echo "  VSR Fintech Solutions"
echo "======================================"
echo "  Mode   : $MODE"
echo "  Branch : $BRANCH"
echo "  Dir    : $PROJECT_DIR"
echo "======================================"

cd "$PROJECT_DIR"

# Sync from GitHub before starting
echo "🔄 Syncing from origin/$BRANCH..."
git fetch origin "$BRANCH" --quiet
git reset --hard "origin/$BRANCH" --quiet
echo "✅ Synced to $(git rev-parse --short HEAD)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install --silent
fi

if [ "$MODE" = "prod" ]; then
  echo "🔨 Building for production..."
  npm run build
  echo "🚀 Starting production server on :5001"
  npm run start
else
  echo "🚀 Starting dev server on :5001"
  npm run dev
fi
