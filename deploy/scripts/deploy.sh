#!/usr/bin/env bash
# ========================================================
# Production Deployment Script for MatchingTeam
# Usage: ./deploy/scripts/deploy.sh
# ========================================================

set -e

echo "🚀 [1/5] Pulling latest changes from Git repository..."
git pull origin main

echo "📦 [2/5] Building Docker images..."
docker compose build --no-cache

echo "🔄 [3/5] Restarting application containers..."
docker compose down
docker compose up -d

echo "🧹 [4/5] Cleaning up old, unused Docker resources..."
docker image prune -f

echo "✅ [5/5] Checking container status..."
docker compose ps

echo "🎉 Deployment successfully completed!"
