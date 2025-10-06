# Vercel Alias Cache Issue - Extension Downloads

**Date**: 2025-10-06
**Status**: ✅ **FIX DEPLOYED** but alias cache is stale

---

## Problem Discovery

**Deployment URL** (latest): ✅ **WORKS**
```bash
$ curl -I https://blkout-community-platform.vercel.app/extensions/blkout-events-curator-v1.0.0.zip

age: 0                              # ← Fresh deployment
content-type: application/zip       # ← Correct MIME type
date: Mon, 06 Oct 2025 04:17:42 GMT
```

**Alias URL** (blkout.vercel.app): ❌ **STALE CACHE**
```bash
$ curl -I https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip

age: 342045                         # ← 95 hours old!
content-type: text/html             # ← Old broken response
date: Mon, 06 Oct 2025 04:17:33 GMT
etag: "b8d7f0ab72c9e028d7cd37d2227b096d"  # ← Same etag for days
```

---

## Root Cause

**Vercel alias** (`blkout.vercel.app`) has its own CDN cache layer separate from the deployment cache.

When you:
1. Deploy code with `git push`
2. Vercel creates new deployment at `blkout-community-platform-<hash>.vercel.app`
3. Deployment URL immediately serves new content ✅
4. Alias `blkout.vercel.app` points to deployment BUT...
5. **Alias CDN cache doesn't automatically invalidate** ❌

Result: Alias serves stale content for hours/days until cache expires naturally.

---

## Verification

### ✅ Fix IS Deployed (Verified)
```bash
# Direct deployment URL - WORKING
https://blkout-community-platform.vercel.app/extensions/blkout-events-curator-v1.0.0.zip
→ Content-Type: application/zip
→ Downloads correctly

# Direct deployment URL - WORKING
https://blkout-community-platform.vercel.app/extensions/blkout-news-curator-v1.0.0.zip
→ Content-Type: application/zip
→ Downloads correctly
```

### ❌ Alias Cache - STALE
```bash
# Alias URL - CACHED
https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip
→ Content-Type: text/html
→ Returns index.html (old behavior)
```

---

## Solutions

### Option 1: Manual Cache Purge (Vercel Dashboard) ⚡ **FASTEST**

1. Go to https://vercel.com/blkoutuk/blkout-community-platform
2. Click on the latest deployment (should show "Production")
3. Click "Visit" to confirm it works on deployment URL
4. Go to **Settings** → **Domains**
5. Find `blkout.vercel.app` alias
6. Click **⋮ More** → **Purge Cache** or **Redeploy**
7. Wait 1-2 minutes for cache to clear globally

### Option 2: Force Redeployment ⚡ **RELIABLE**

Trigger a new deployment to force alias cache invalidation:

```bash
# Make a trivial change (add newline to README or similar)
echo "" >> README.md

# Commit and push
git add README.md
git commit -m "chore: Force deployment to clear alias cache"
git push origin main
```

When Vercel deploys, it should update the alias cache.

### Option 3: Add Cache-Control Headers 🛡️ **PREVENTIVE**

Update `vercel.json` to prevent aggressive caching on `/extensions/*`:

```json
{
  "headers": [
    {
      "source": "/extensions/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"  // 1 hour cache
        },
        {
          "key": "Content-Type",
          "value": "application/zip"
        }
      ]
    },
    // ... existing headers
  ]
}
```

This ensures:
- Downloads cache for 1 hour (performance)
- `must-revalidate` forces cache check after expiry
- Explicit `Content-Type` prevents misdetection

### Option 4: Wait for Natural Cache Expiry ⏰ **SLOWEST**

Vercel's default cache TTL is typically 31 days, but varies by:
- `Cache-Control` headers (currently: `no-cache, no-store, must-revalidate`)
- CDN edge location
- Traffic patterns

Could take **minutes to hours** depending on region.

---

## Recommended Action

**Immediate** (5 minutes):
1. Log into Vercel dashboard
2. Go to Domains → `blkout.vercel.app`
3. Purge cache or trigger redeploy
4. Test: `curl -I https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip`
5. Verify `Content-Type: application/zip` and `age: 0`

**Short-term** (today):
6. Add explicit Cache-Control headers for `/extensions/*` in `vercel.json`
7. Deploy changes
8. Document for team: "After deployment, purge alias cache"

**Long-term** (this week):
9. Consider custom domain instead of Vercel alias
   - Custom domains have more predictable cache behavior
   - Better for production (e.g., `platform.blkout.org`)

---

## Temporary Workaround

While waiting for cache to clear, users can:

1. **Use direct deployment URL** (always latest):
   ```
   https://blkout-community-platform.vercel.app/extensions/blkout-events-curator-v1.0.0.zip
   https://blkout-community-platform.vercel.app/extensions/blkout-news-curator-v1.0.0.zip
   ```

2. **Update ModerationTools.tsx** to use deployment URL temporarily:
   ```typescript
   // Temporary fix until alias cache clears
   link.href = `https://blkout-community-platform.vercel.app/extensions/${fileName}`;
   ```

3. **Cache-busting query parameter**:
   ```
   https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip?v=2025-10-06
   ```
   (May not work if cache doesn't respect query params)

---

## Prevention for Future Deployments

### 1. Add to Deployment Checklist
```markdown
## Post-Deployment Steps
- [ ] Test deployment URL works: https://blkout-community-platform.vercel.app
- [ ] Purge alias cache in Vercel dashboard
- [ ] Test alias URL works: https://blkout.vercel.app
- [ ] Verify in different regions if possible
```

### 2. Document Alias Behavior
Add to team docs:
> **Important**: Vercel aliases have separate CDN cache. After deploying, always purge cache for production alias `blkout.vercel.app` in the Vercel dashboard.

### 3. Consider CI/CD Cache Purge
Use Vercel API to automatically purge cache after deployment:
```bash
# In GitHub Actions after successful deployment
curl -X POST "https://api.vercel.com/v1/purge?url=https://blkout.vercel.app/extensions/*" \
  -H "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Testing Commands

After purging cache, verify fix:

```bash
# Should return application/zip
curl -I https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip

# Check age header (should be 0 or very small)
curl -I https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip | grep age

# Try downloading
curl -O https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip
unzip -l blkout-events-curator-v1.0.0.zip  # Should show manifest.json, etc.
```

---

**Current Status**:
- ✅ Code fix deployed and working on deployment URL
- ❌ Alias cache needs manual purge
- ⏳ Waiting for user to purge cache in Vercel dashboard

**Next Action**: User to log into Vercel and purge `blkout.vercel.app` domain cache
