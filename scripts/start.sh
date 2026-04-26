#!/bin/bash

# VSR Fintech Solutions - Start Script
# Version: 1.0.0
# Usage: ./scripts/start.sh [dev|prod]

set -e

MODE=${1:-dev}
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "======================================"
echo "  VSR Fintech Solutions - Starting Server"
echo "======================================"
echo "  Mode: $MODE"
echo "  Directory: $PROJECT_DIR"
echo "======================================"

cd "$PROJECT_DIR"

# Check node_modules
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

if [ "$MODE" = "prod" ]; then
  echo "🔨 Building for production..."
  npm run build
  echo "🚀 Starting production server..."
  echo "   URL: http://localhost:5001"
  npm run start
else
  echo "🚀 Starting development server..."
  echo "   URL: http://localhost:5001"
  npm run dev
fi
