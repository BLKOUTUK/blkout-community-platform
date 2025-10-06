# BLKOUT Production Deployment Guide

## ⚠️ IMPORTANT: ONE SOURCE OF TRUTH

**This directory** (`/blkout-community-platform`) is the **ONLY** source for `blkout.vercel.app`.

Never deploy from any other directory or project to avoid confusion.

## 🚀 How to Deploy

### Simple Method (Recommended)
```bash
./deploy.sh
```

This script:
- ✅ Verifies you're in the right directory
- ✅ Checks git is clean
- ✅ Builds locally to catch errors
- ✅ Deploys to Vercel
- ✅ Updates `blkout.vercel.app` alias
- ✅ Verifies deployment works

### Manual Method (If needed)
```bash
# 1. Ensure git is clean
git status

# 2. Build locally
npm run build

# 3. Deploy to Vercel
npx vercel --prod --yes

# 4. Update alias (replace URL with output from step 3)
npx vercel alias <deployment-url> blkout.vercel.app
```

## 🎯 Target URLs

- **Production**: https://blkout.vercel.app/
- **Vercel Project**: `blkout-community-platform`

## ✅ Verification

After deployment, check:
1. https://blkout.vercel.app/ loads correctly
2. Recent changes are visible
3. IVOR introduction page works (`Meet IVOR` navigation)

## 🚫 What NOT To Do

- ❌ Don't deploy from other directories
- ❌ Don't create new Vercel projects for this site
- ❌ Don't manually alias to old deployments
- ❌ Don't deploy with uncommitted changes

## 🆘 If Something Goes Wrong

1. Check this directory: `/blkout-community-platform`
2. Run: `./deploy.sh`
3. If that fails, check git status and commit changes
4. Contact developer if issues persist

## 📝 Project Structure

```
Source: /blkout-community-platform/
├── src/components/pages/IVORIntroduction.tsx  ← IVOR page
├── src/App.tsx                                ← Main routing
├── deploy.sh                                  ← Deployment script
└── DEPLOYMENT.md                              ← This file
```

---

**Last Updated**: $(date)
**Current Commit**: $(git rev-parse --short HEAD)