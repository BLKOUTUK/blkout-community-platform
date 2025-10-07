#!/bin/bash
# Package Chrome Extensions for Distribution
# Builds .zip files with fixed manifests for admin dashboard downloads

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🚀 Packaging BLKOUT Chrome Extensions..."

# News Curator
echo "📰 Packaging News Curator..."
cd "$PROJECT_ROOT/chrome-extension-news"

# Check if zip is installed
if ! command -v zip &> /dev/null; then
    echo "❌ zip command not found. Installing..."
    echo "Please run: sudo apt-get install zip"
    exit 1
fi

# Create zip excluding unnecessary files
zip -r "$PROJECT_ROOT/public/extensions/blkout-news-curator-v1.0.1.zip" . \
    -x "*.git*" \
    -x "auth/*" \
    -x "*.DS_Store" \
    -x "*.zone.identifier"

# Copy to dist as well
mkdir -p "$PROJECT_ROOT/dist/extensions"
cp "$PROJECT_ROOT/public/extensions/blkout-news-curator-v1.0.1.zip" \
   "$PROJECT_ROOT/dist/extensions/blkout-news-curator-v1.0.1.zip"

echo "✅ News Curator packaged"

# Events Curator
echo "📅 Packaging Events Curator..."
cd "$PROJECT_ROOT/chrome-extension-events"

zip -r "$PROJECT_ROOT/public/extensions/blkout-events-curator-v1.0.1.zip" . \
    -x "*.git*" \
    -x "auth/*" \
    -x "*.DS_Store" \
    -x "*.zone.identifier"

cp "$PROJECT_ROOT/public/extensions/blkout-events-curator-v1.0.1.zip" \
   "$PROJECT_ROOT/dist/extensions/blkout-events-curator-v1.0.1.zip"

echo "✅ Events Curator packaged"

# List results
echo ""
echo "📦 Packaged extensions:"
ls -lh "$PROJECT_ROOT/public/extensions/"*.zip

echo ""
echo "✅ Extensions ready for download from admin dashboards!"
echo "   - News: /extensions/blkout-news-curator-v1.0.1.zip"
echo "   - Events: /extensions/blkout-events-curator-v1.0.1.zip"
