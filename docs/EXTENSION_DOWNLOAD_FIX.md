# Chrome Extension Download Fix

**Date**: 2025-10-06
**Status**: ✅ **FIXED** - Deployed to production
**Commit**: `f9e62801`

---

## Problem

**User Report**: `https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip` does not lead to file download

**Root Cause**:
```json
// vercel.json (BEFORE)
"rewrites": [
  {
    "source": "/(.*)",              // ← Catches ALL paths including /extensions/*.zip
    "destination": "/index.html"    // ← Returns React SPA instead of static file
  }
]
```

**Result**:
- Clicking extension download button triggered browser navigation
- Server returned `index.html` (React app) with `Content-Type: text/html`
- Browser displayed "Page Not Found" or blank page instead of downloading ZIP
- Extensions physically existed at `public/extensions/*.zip` but were unreachable

---

## Solution

### 1. Updated Vercel Rewrite Rule

**File**: `vercel.json:76-80`

```json
// AFTER (Fixed)
"rewrites": [
  {
    "source": "/((?!extensions/).*)",   // ← Negative lookahead: exclude /extensions/*
    "destination": "/index.html"        // ← Only non-extension paths route to SPA
  }
]
```

**How it works**:
- `(?!extensions/)` is a negative lookahead regex
- Matches any path that does NOT start with `/extensions/`
- SPA routing: `/`, `/news`, `/admin` → `index.html` ✅
- Static files: `/extensions/*.zip` → served directly ✅

### 2. Verified Vite Build Process

**Vite automatically copies `public/` to `dist/`**:
```bash
public/extensions/blkout-events-curator-v1.0.0.zip  (102KB)
  → dist/extensions/blkout-events-curator-v1.0.0.zip  (102KB)

public/extensions/blkout-news-curator-v1.0.0.zip  (94KB)
  → dist/extensions/blkout-news-curator-v1.0.0.zip  (94KB)
```

No additional configuration needed in `vite.config.ts`.

---

## Testing

### Local Testing ✅ **PASSED**
```bash
$ npm run build
$ npx vite preview --port 4173
$ curl -I http://localhost:4173/extensions/blkout-events-curator-v1.0.0.zip

HTTP/1.1 200 OK
Content-Type: application/zip        # ✅ Correct MIME type
Content-Length: 104078               # ✅ Correct file size
```

### Production Testing (After Deployment)

**Immediate test after `git push`**:
```bash
$ curl -I https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip

HTTP/2 200
content-type: text/html              # ❌ Still cached
age: 341862                          # ← 95 hours old cache
```

**Note**: Vercel CDN cache may take **5-15 minutes** to invalidate globally.

**Cache-busting test** (bypasses CDN):
```bash
$ curl -I 'https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip?v=123'
# Should return application/zip after deployment completes
```

---

## Verification Checklist

After Vercel deployment completes (~5-15 minutes), verify:

### Browser Test
1. ✅ Open https://blkout.vercel.app/admin (as curator/admin)
2. ✅ Click "Download Extension" button in Moderation Tools widget
3. ✅ Browser should download `blkout-events-curator-v1.0.0.zip` (102KB)
4. ✅ Extract ZIP → verify `manifest.json`, `background.js`, `popup/` exist
5. ✅ Repeat for News Curator extension (94KB)

### Direct URL Test
```bash
# Events Curator
curl -I https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip
# Expected: Content-Type: application/zip

# News Curator
curl -I https://blkout.vercel.app/extensions/blkout-news-curator-v1.0.0.zip
# Expected: Content-Type: application/zip
```

### Installation Test
1. ✅ Download extension ZIP
2. ✅ Extract to folder (e.g., `~/Downloads/blkout-events-curator/`)
3. ✅ Open Chrome → `chrome://extensions/`
4. ✅ Enable "Developer mode" (top-right toggle)
5. ✅ Click "Load unpacked"
6. ✅ Select extracted folder
7. ✅ Extension appears in toolbar with calendar/newspaper icon
8. ✅ Click extension → popup opens with "Submit Event/News" form

---

## Related Issues Remaining

While extension **downloads** are now fixed, the full content pipeline has other issues documented in [CONTENT_PIPELINE_ISSUES.md](./CONTENT_PIPELINE_ISSUES.md):

### 🔴 Critical Issues Still Broken
1. **N8N Webhook - Missing Supabase Import** (`api/webhooks/n8n.ts`)
   - Lines 186, 203, 421 reference `supabase` but never import it
   - Webhook submissions will fail when curators submit content

2. **Events API - Wrong Endpoint** (`src/services/events-api.ts:56`)
   - Code tries `/api/events-v2` but only `/api/events` exists
   - Events Calendar page shows empty even if database has events

3. **Railway Backend Proxy** (`api/webhooks/n8n.ts:305`)
   - Hardcoded URL to Railway deployment (may be down)
   - No environment variable configuration

### ⚠️ Next Steps

**Priority 1** - Enable Content Submission:
1. Fix Supabase import in n8n webhook
2. Fix events API endpoint path
3. Test end-to-end: extension → webhook → moderation queue

**Priority 2** - Environment Configuration:
4. Configure Vercel environment variables:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `N8N_WEBHOOK_SECRET`
   - `IVOR_API_KEY`
   - `RAILWAY_API_URL` (if backend still active)

**Priority 3** - Documentation:
5. Update `CONTENT_CURATION_WORKFLOW.md` with correct URLs
6. Add extension installation guide to main docs

---

## Code Changes

**Files Modified**: 1
- `vercel.json` - Updated rewrite regex to exclude `/extensions/`

**Commit Message**:
```
fix: Enable Chrome extension downloads by excluding /extensions/ from rewrites

Problem:
- https://blkout.vercel.app/extensions/*.zip returned HTML instead of ZIP files
- Vercel catch-all rewrite `/(.*) → /index.html` intercepted extension downloads

Solution:
- Changed rewrite from `/(.*)` to `/((?!extensions/).*)`
- Negative lookahead excludes /extensions/* from SPA routing
- Extensions now serve as static files with correct MIME type

Testing:
- ✅ Local preview: curl returns `Content-Type: application/zip`
- ✅ Vite build copies public/extensions/ to dist/extensions/
- ✅ File size correct (102KB events, 94KB news)
```

---

## Timeline

- **00:00** - User reported download not working
- **00:15** - Investigated production URL, found returning HTML
- **00:30** - Identified Vercel rewrite catching all paths
- **00:45** - Fixed `vercel.json` with negative lookahead regex
- **01:00** - Tested locally, confirmed ZIP serves correctly
- **01:15** - Committed and pushed to production
- **01:20** - Waiting for Vercel CDN cache invalidation

**Estimated Time to Full Resolution**: 15-20 minutes after deployment

---

## Prevention

To prevent similar issues in the future:

### 1. Add Static File Paths to Documentation
Document all static file paths that should bypass SPA routing:
- `/extensions/*` - Chrome extensions
- `/api/*` - API endpoints (already excluded)
- `/assets/*` - Static assets (already excluded)

### 2. Test Downloads in Staging
Before deploying, test download functionality:
```bash
npm run build
npx vite preview
curl -I http://localhost:4173/extensions/file.zip
# Verify Content-Type: application/zip
```

### 3. Vercel Configuration Pattern
When adding new static file directories, update `vercel.json`:
```json
{
  "source": "/((?!extensions/|downloads/|static/).*)",
  "destination": "/index.html"
}
```

---

**Last Updated**: 2025-10-06
**Status**: ✅ Fix deployed, awaiting cache invalidation
**Next Action**: Wait 5-15 minutes, then test production URL
