# 🚨 URGENT: Manual Cache Purge Required

**Date**: 2025-10-06
**Status**: ⚠️ **FIX DEPLOYED BUT CACHED** - Manual Vercel dashboard action needed
**Urgency**: **HIGH** - Downloads blocked for all users on production alias

---

## Current Situation

### ✅ Fix Is Deployed and Working
```bash
# Direct deployment URL - WORKS PERFECTLY
$ curl -I https://blkout-community-platform.vercel.app/extensions/blkout-events-curator-v1.0.0.zip

HTTP/2 200
age: 0
content-type: application/zip          # ✅ Correct
content-disposition: attachment        # ✅ Forces download
cache-control: public, max-age=0       # ✅ No caching
```

### ❌ Alias Cache Is Stuck (95+ Hours Old)
```bash
# Production alias - BROKEN DUE TO CACHE
$ curl -I https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip

HTTP/2 200
age: 342480                            # ❌ 95+ hours old!
content-type: text/html                # ❌ Wrong MIME type
content-disposition: inline            # ❌ Displays instead of download
x-vercel-cache: HIT                    # ❌ Serving from edge cache
etag: "b8d7f0ab72c9e028d7cd37d2227b096d"  # ❌ Same etag for days
```

---

## What We've Tried

### Attempt 1: Fixed vercel.json Rewrite Rule ✅
**Commit**: `f9e62801`
```json
// Changed from: "source": "/(.*)"
// Changed to:   "source": "/((?!extensions/).*)"
```
Result: Deployed successfully, but alias cache didn't invalidate.

### Attempt 2: Force Redeployment ❌
**Commit**: `9b2c4616`
- Added empty line to README.md
- Triggered new deployment
Result: New deployment created, but alias still serves old cache.

### Attempt 3: Explicit Cache Headers ❌
**Commit**: `91c75f8b`
```json
{
  "source": "/extensions/(.*\\.zip)",
  "headers": [
    {"key": "Content-Type", "value": "application/zip"},
    {"key": "Content-Disposition", "value": "attachment"},
    {"key": "Cache-Control", "value": "public, max-age=0, must-revalidate"}
  ]
}
```
Result: Deployed successfully, but Vercel edge cache ignores new headers for existing cached content.

---

## Why Automatic Cache Purge Doesn't Work

**Vercel CDN has two cache layers**:

1. **Deployment Cache** (clears on new deployment) ✅
   - `blkout-community-platform.vercel.app` works immediately

2. **Alias Edge Cache** (persists across deployments) ❌
   - `blkout.vercel.app` serves stale content
   - Cache key is based on URL + etag
   - Vercel doesn't invalidate edge cache automatically when:
     - Config files change (vercel.json)
     - New deployments are created
     - Headers are updated

**Root Cause**: The cache was created **before** the rewrite fix, so it cached the wrong response (index.html). Even though new deployments bypass the cache for new requests, the alias continues serving the cached response.

---

## 🔧 Manual Fix Required (Vercel Dashboard)

### Steps to Purge Cache:

#### Option A: Purge Cache via Domains (Recommended)

1. **Log into Vercel Dashboard**
   - Go to https://vercel.com/
   - Navigate to `BLKOUTUK` → `blkout-community-platform` project

2. **Find the Alias**
   - Click **Settings** tab
   - Click **Domains** in left sidebar
   - Find `blkout.vercel.app` in the list

3. **Purge Cache**
   - Click the **⋮** menu next to `blkout.vercel.app`
   - Select **Purge Cache** or **Invalidate Cache**
   - Confirm the action

4. **Wait 1-2 Minutes**
   - Cache purge propagates to all edge locations
   - Global CDN refresh typically takes 30 seconds - 2 minutes

5. **Verify**
   ```bash
   curl -I https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip
   # Should show: age: 0, content-type: application/zip
   ```

#### Option B: Redeploy from Dashboard (Alternative)

1. Go to **Deployments** tab
2. Find the latest deployment (top of list)
3. Click **⋮** menu
4. Select **Redeploy**
5. Choose **Use existing Build Cache: No**
6. Click **Redeploy**
7. Wait for deployment to complete
8. Test alias URL

#### Option C: Use Vercel CLI (If Installed)

```bash
# Purge specific URL
vercel --prod --purge https://blkout.vercel.app/extensions/*

# Or purge entire domain
vercel domains purge blkout.vercel.app
```

---

## Verification After Purge

Run these commands to confirm the fix is working:

### 1. Check Events Curator Extension
```bash
curl -I https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip

# Expected:
# HTTP/2 200
# age: 0 (or small number)
# content-type: application/zip
# content-disposition: attachment
# cache-control: public, max-age=0, must-revalidate
```

### 2. Check News Curator Extension
```bash
curl -I https://blkout.vercel.app/extensions/blkout-news-curator-v1.0.0.zip

# Expected: Same as above
```

### 3. Browser Test
1. Open https://blkout.vercel.app/admin
2. Click "Download Extension" in Moderation Tools widget
3. Should download `blkout-events-curator-v1.0.0.zip` (102KB)
4. Extract ZIP and verify contains:
   - `manifest.json`
   - `background.js`
   - `popup/popup.html`
   - `icons/` folder

### 4. Direct Link Test
Click this URL directly in browser:
```
https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip
```
Should immediately download ZIP file, not navigate to blank page.

---

## Current Workaround (Until Cache Purged)

### For Internal Testing
Use the direct deployment URL which works immediately:
```
https://blkout-community-platform.vercel.app/extensions/blkout-events-curator-v1.0.0.zip
https://blkout-community-platform.vercel.app/extensions/blkout-news-curator-v1.0.0.zip
```

### For Public Users
Temporarily update `ModerationTools.tsx` to use deployment URL:

```typescript
// src/components/moderation/ModerationTools.tsx:28
const link = document.createElement('a');
// Temporary workaround until alias cache is purged
link.href = `https://blkout-community-platform.vercel.app/extensions/${fileName}`;
link.download = fileName;
```

**Remember to revert this** after alias cache is purged.

---

## Timeline

| Time | Action | Result |
|------|--------|--------|
| 00:00 | User reports download not working | Issue identified |
| 00:30 | Fixed vercel.json rewrite rule | Deployed f9e62801 |
| 01:00 | Tested, found alias cache issue | Deployment URL works, alias doesn't |
| 01:15 | Force redeployment | Still cached |
| 01:45 | Added explicit headers | Still cached |
| **NOW** | **Waiting for manual cache purge** | **ACTION REQUIRED** |

---

## Why This Happened

**Original Problem**:
- `vercel.json` had catch-all rewrite: `/(.*) → /index.html`
- This included `/extensions/*.zip` paths
- Vercel CDN cached this wrong routing decision

**Why Fixes Didn't Auto-Clear**:
- Vercel edge cache has very long TTL (days/weeks)
- Cache key doesn't include deployment ID or vercel.json hash
- New deployments create new routes but don't invalidate old cached routes
- This is a known Vercel CDN behavior for aliased domains

---

## Prevention for Future

### 1. Add to Deployment Checklist
```markdown
## After Deployment (If Routing/Headers Changed)
- [ ] Test deployment URL
- [ ] **Purge alias cache in Vercel dashboard**
- [ ] Test alias URL
- [ ] Verify on mobile/different locations
```

### 2. Use Cache-Busting for Critical Downloads
```typescript
// For time-sensitive downloads, add version parameter
const timestamp = Date.now();
link.href = `/extensions/${fileName}?v=${timestamp}`;
```

### 3. Monitor Cache Age
Add monitoring for stale cache:
```bash
# Alert if age > 1 hour for critical paths
age=$(curl -sI https://blkout.vercel.app/extensions/file.zip | grep age | cut -d' ' -f2)
if [ $age -gt 3600 ]; then
  echo "⚠️  Cache is stale (${age}s old) - purge needed"
fi
```

### 4. Consider Custom Domain
Custom domains (e.g., `platform.blkout.org`) have more predictable cache behavior than Vercel aliases.

---

## Summary

**What's Working**:
- ✅ Code fix is correct and deployed
- ✅ Direct deployment URL serves files correctly
- ✅ All headers are properly configured

**What's Blocked**:
- ❌ Production alias `blkout.vercel.app` serves 95-hour-old cached HTML
- ❌ Users on production cannot download extensions
- ❌ Automatic cache invalidation doesn't work for this scenario

**Required Action**:
1. Log into Vercel dashboard
2. Settings → Domains → `blkout.vercel.app`
3. Click ⋮ → Purge Cache
4. Wait 1-2 minutes
5. Verify with curl commands above

**ETA to Resolution**: 5 minutes after manual cache purge

---

**Next Steps**:
1. User purges cache in Vercel dashboard
2. Verify downloads work on `blkout.vercel.app`
3. Update documentation with cache purge procedure
4. Test end-to-end content pipeline (see CONTENT_PIPELINE_ISSUES.md)

---

**Last Updated**: 2025-10-06 04:25 GMT
**Status**: Awaiting manual cache purge
**Blocking**: All extension downloads on production alias
