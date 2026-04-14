#!/bin/bash

# VSR Fintech Sol - Stop Script
# Version: 1.0.0

echo "======================================"
echo "  VSR Fintech Sol - Stopping Server"
echo "======================================"

# Kill Next.js dev server
PIDS=$(lsof -ti:5001 2>/dev/null)

if [ -n "$PIDS" ]; then
  echo "  Stopping processes on port 5001..."
  echo "$PIDS" | xargs kill -9 2>/dev/null
  echo "  ✅ Server stopped successfully"
else
  echo "  ℹ️  No server running on port 5001"
fi

echo "======================================"
