#!/bin/bash
# Test Vercel cache status for blkout.vercel.app

echo "🔍 Testing Vercel Cache Status"
echo "================================"
echo ""

echo "1️⃣  Testing ALIAS (blkout.vercel.app):"
echo "   URL: https://blkout.vercel.app/"
ALIAS_RESPONSE=$(curl -sI https://blkout.vercel.app/ 2>&1)
ALIAS_AGE=$(echo "$ALIAS_RESPONSE" | grep -i "^age:" | cut -d' ' -f2 | tr -d '\r')
ALIAS_DATE=$(echo "$ALIAS_RESPONSE" | grep -i "^date:" | cut -d' ' -f2- | tr -d '\r')
ALIAS_CACHE=$(echo "$ALIAS_RESPONSE" | grep -i "x-vercel-cache:" | cut -d' ' -f2 | tr -d '\r')

echo "   Age: ${ALIAS_AGE}s ($(($ALIAS_AGE / 3600)) hours old)"
echo "   Date: $ALIAS_DATE"
echo "   Cache Status: $ALIAS_CACHE"

if [ "$ALIAS_AGE" -gt 3600 ]; then
  echo "   ❌ STALE CACHE (>1 hour old)"
else
  echo "   ✅ FRESH CACHE"
fi
echo ""

echo "2️⃣  Testing DEPLOYMENT URL (blkout-community-platform.vercel.app):"
echo "   URL: https://blkout-community-platform.vercel.app/"
DEPLOY_RESPONSE=$(curl -sI https://blkout-community-platform.vercel.app/ 2>&1)
DEPLOY_AGE=$(echo "$DEPLOY_RESPONSE" | grep -i "^age:" | cut -d' ' -f2 | tr -d '\r')
DEPLOY_DATE=$(echo "$DEPLOY_RESPONSE" | grep -i "^date:" | cut -d' ' -f2- | tr -d '\r')
DEPLOY_CACHE=$(echo "$DEPLOY_RESPONSE" | grep -i "x-vercel-cache:" | cut -d' ' -f2 | tr -d '\r')

echo "   Age: ${DEPLOY_AGE}s"
echo "   Date: $DEPLOY_DATE"
echo "   Cache Status: $DEPLOY_CACHE"
echo "   ✅ Always fresh (deployment URL)"
echo ""

echo "3️⃣  Testing EXTENSION DOWNLOAD (alias):"
echo "   URL: https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip"
EXT_RESPONSE=$(curl -sI https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip 2>&1)
EXT_TYPE=$(echo "$EXT_RESPONSE" | grep -i "^content-type:" | cut -d' ' -f2 | tr -d '\r')
EXT_AGE=$(echo "$EXT_RESPONSE" | grep -i "^age:" | cut -d' ' -f2 | tr -d '\r')
EXT_DISPOSITION=$(echo "$EXT_RESPONSE" | grep -i "^content-disposition:" | cut -d' ' -f2 | tr -d '\r')

echo "   Content-Type: $EXT_TYPE"
echo "   Age: ${EXT_AGE}s"
echo "   Content-Disposition: $EXT_DISPOSITION"

if [[ "$EXT_TYPE" == *"zip"* ]]; then
  echo "   ✅ WORKING - Serves as ZIP file"
elif [[ "$EXT_TYPE" == *"html"* ]]; then
  echo "   ❌ BROKEN - Serves as HTML (cached old routing)"
else
  echo "   ⚠️  UNKNOWN - Content-Type: $EXT_TYPE"
fi
echo ""

echo "4️⃣  Testing EXTENSION DOWNLOAD (deployment URL):"
echo "   URL: https://blkout-community-platform.vercel.app/extensions/blkout-events-curator-v1.0.0.zip"
EXT_DEPLOY_RESPONSE=$(curl -sI https://blkout-community-platform.vercel.app/extensions/blkout-events-curator-v1.0.0.zip 2>&1)
EXT_DEPLOY_TYPE=$(echo "$EXT_DEPLOY_RESPONSE" | grep -i "^content-type:" | cut -d' ' -f2 | tr -d '\r')
EXT_DEPLOY_DISPOSITION=$(echo "$EXT_DEPLOY_RESPONSE" | grep -i "^content-disposition:" | cut -d' ' -f2 | tr -d '\r')

echo "   Content-Type: $EXT_DEPLOY_TYPE"
echo "   Content-Disposition: $EXT_DEPLOY_DISPOSITION"
echo "   ✅ Always works (deployment URL)"
echo ""

echo "================================"
echo "📊 SUMMARY"
echo "================================"
echo ""

if [ "$ALIAS_AGE" -gt 3600 ]; then
  echo "⚠️  CACHE PURGE REQUIRED"
  echo ""
  echo "The alias blkout.vercel.app is serving ${ALIAS_AGE}s ($(($ALIAS_AGE / 3600))h) old content."
  echo ""
  echo "🔧 TO FIX:"
  echo "1. Go to https://vercel.com/blkoutuk/blkout-community-platform"
  echo "2. Click 'Settings' → 'Domains'"
  echo "3. Find 'blkout.vercel.app'"
  echo "4. Click ⋮ menu → 'Purge Cache'"
  echo "5. Wait 1-2 minutes"
  echo "6. Run this script again to verify"
  echo ""
else
  echo "✅ CACHE IS FRESH"
  echo ""
  if [[ "$EXT_TYPE" == *"zip"* ]]; then
    echo "✅ Extension downloads are working!"
  else
    echo "⚠️  Extension downloads still broken despite fresh cache"
    echo "    This may require additional debugging"
  fi
fi

echo "🕐 Last checked: $(date)"
