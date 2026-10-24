#!/usr/bin/env bash
# ========================================================
# Database Backup Script
# Usage: ./deploy/scripts/backup.sh
# ========================================================

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "💾 Starting database backup..."
docker compose exec -T postgres pg_dump -U postgres matching_team_db | gzip > "$FILENAME"

echo "✅ Backup successfully saved to $FILENAME"

# Keep only the last 7 days of backups
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -delete
echo "🧹 Old backups pruned (retention: 7 days)."
