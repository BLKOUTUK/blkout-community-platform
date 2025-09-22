#!/bin/bash

# BLKOUT PRODUCTION DEPLOYMENT SCRIPT
# Ensures reliable deployment to blkout.vercel.app

set -e

echo "🚀 BLKOUT Production Deployment Starting..."

# 1. Verify we're in the right directory
if [ ! -f "package.json" ] || ! grep -q "blkout-community-platform" package.json; then
    echo "❌ Error: Must run from blkout-community-platform directory"
    exit 1
fi

# 2. Verify git is clean and up to date
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Git working directory not clean. Commit changes first."
    git status --short
    exit 1
fi

echo "✅ Git status clean"

# 3. Build locally to verify
echo "🔨 Building locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Local build failed"
    exit 1
fi

echo "✅ Local build successful"

# 4. Deploy to Vercel
echo "☁️ Deploying to Vercel..."
DEPLOYMENT_URL=$(npx vercel --prod --yes | tail -1)

if [ $? -ne 0 ]; then
    echo "❌ Vercel deployment failed"
    exit 1
fi

echo "✅ Deployed to: $DEPLOYMENT_URL"

# 5. Update blkout.vercel.app alias
echo "🔗 Updating blkout.vercel.app alias..."
npx vercel alias $DEPLOYMENT_URL blkout.vercel.app

if [ $? -ne 0 ]; then
    echo "❌ Alias update failed"
    exit 1
fi

echo "✅ Alias updated successfully"

# 6. Verify deployment
echo "🔍 Verifying deployment..."
sleep 5  # Wait for propagation

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://blkout.vercel.app/)

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Deployment verified: https://blkout.vercel.app/ is responding"
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo "📱 Site URL: https://blkout.vercel.app/"
    echo "🔗 Direct URL: $DEPLOYMENT_URL"
else
    echo "⚠️ Warning: Site returned HTTP $HTTP_STATUS"
fi

echo ""
echo "📋 DEPLOYMENT SUMMARY:"
echo "   Source: $(pwd)"
echo "   Target: https://blkout.vercel.app/"
echo "   Commit: $(git rev-parse --short HEAD)"
echo "   Time: $(date)"