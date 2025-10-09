#!/bin/bash

# BLKOUT Voices Migration - Apply via Supabase API
set -e

echo "🚀 Applying BLKOUT Voices Migration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Source environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

SUPABASE_URL="${VITE_SUPABASE_URL:-$NEXT_PUBLIC_SUPABASE_URL}"
SUPABASE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo "❌ Missing Supabase credentials!"
    echo "   Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
    exit 1
fi

# Read migration file
MIGRATION_FILE="database/migrations/002_voices_system.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "📄 Reading migration from: $MIGRATION_FILE"
echo ""

# Extract project ID from URL
PROJECT_ID=$(echo $SUPABASE_URL | sed 's/https:\/\/\([^.]*\).*/\1/')

echo "🔗 Supabase Project: $PROJECT_ID"
echo ""
echo "⚠️  Please run the migration manually via Supabase Dashboard:"
echo ""
echo "1. Open: https://app.supabase.com/project/$PROJECT_ID/sql"
echo "2. Create new query"
echo "3. Copy and paste contents of: $MIGRATION_FILE"
echo "4. Click 'Run'"
echo ""
echo "Or use this direct link:"
echo "https://app.supabase.com/project/$PROJECT_ID/sql/new"
echo ""

# Offer to open the file for copying
echo "Would you like to display the SQL for copying? (y/n)"
read -r response

if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
    echo ""
    echo "━━━━━━━━━━━━━━ MIGRATION SQL ━━━━━━━━━━━━━━━"
    cat "$MIGRATION_FILE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi

echo "✅ Once migration is complete, continue with:"
echo "   npm run build && npm run deploy"
