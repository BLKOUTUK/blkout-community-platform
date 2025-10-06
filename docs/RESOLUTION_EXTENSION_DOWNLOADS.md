# ✅ RESOLVED: Chrome Extension Downloads Working

**Date**: 2025-10-06
**Status**: ✅ **FIXED AND VERIFIED**
**Resolution Time**: ~4 hours (includes debugging, fixing, and cache issues)

---

## Problem Summary

**User Report**: `https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip` did not lead to file download

**Symptoms**:
- Clicking extension download button navigated to homepage or blank page
- No ZIP file download occurred
- Users could not install Chrome extensions for content curation

---

## Root Cause

### Primary Issue: Incorrect Vercel Routing
```json
// vercel.json (BEFORE)
"rewrites": [
  {
    "source": "/(.*)",              // ❌ Matched ALL paths including /extensions/*.zip
    "destination": "/index.html"     // ❌ Returned React SPA instead of static file
  }
]
```

**Result**: All requests to `/extensions/*.zip` were rewritten to `/index.html`, serving HTML instead of the ZIP files.

### Secondary Issue: Vercel CDN Cache Persistence
- After deploying the fix, Vercel alias `blkout.vercel.app` continued serving 90+ hour old cached responses
- Deployment URL worked immediately, but production alias required manual cache purge
- Vercel edge cache doesn't auto-invalidate when routing configuration changes

---

## Solution Implemented

### 1. Fixed Vercel Rewrite Rule
**Commit**: `f9e62801`

```json
// vercel.json (AFTER)
"rewrites": [
  {
    "source": "/((?!extensions/).*)",   // ✅ Negative lookahead: excludes /extensions/*
    "destination": "/index.html"         // ✅ Only non-extension paths route to SPA
  }
]
```

### 2. Added Explicit Headers for Extensions
**Commit**: `91c75f8b`

```json
{
  "source": "/extensions/(.*\\.zip)",
  "headers": [
    {
      "key": "Content-Type",
      "value": "application/zip"              // ✅ Explicit MIME type
    },
    {
      "key": "Content-Disposition",
      "value": "attachment"                   // ✅ Forces browser download
    },
    {
      "key": "Cache-Control",
      "value": "public, max-age=0, must-revalidate"  // ✅ Minimal caching
    }
  ]
}
```

### 3. Manual Cache Purge
**Action**: User purged Vercel domain cache via dashboard
- Settings → Domains → `blkout.vercel.app` → Purge Cache
- Cache cleared globally within 1-2 minutes

---

## Verification

### ✅ Both Extensions Working

**Events Curator** (102KB):
```bash
$ curl -I https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip

HTTP/2 200
content-type: application/zip       # ✅ Correct MIME type
content-disposition: attachment     # ✅ Forces download
age: 0                              # ✅ Fresh cache
```

**News Curator** (94KB):
```bash
$ curl -I https://blkout.vercel.app/extensions/blkout-news-curator-v1.0.0.zip

HTTP/2 200
content-type: application/zip       # ✅ Correct MIME type
content-disposition: attachment     # ✅ Forces download
age: 0                              # ✅ Fresh cache
```

### ✅ File Content Verified
```bash
$ curl -s https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip | file -
/dev/stdin: Zip archive data, at least v2.0 to extract
```

---

## Testing Checklist

### Browser Test ✅
- [x] Open https://blkout.vercel.app/admin (as curator/admin)
- [x] Navigate to Moderation Tools widget
- [x] Click "Download Extension" for Events Curator
- [x] Browser downloads `blkout-events-curator-v1.0.0.zip` (102KB)
- [x] Extract ZIP → contains `manifest.json`, `background.js`, `popup/` folder
- [x] Repeat for News Curator (94KB)

### Direct URL Test ✅
```bash
# Events Curator
https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip
→ Downloads immediately as ZIP file

# News Curator
https://blkout.vercel.app/extensions/blkout-news-curator-v1.0.0.zip
→ Downloads immediately as ZIP file
```

### Installation Test (To Be Done by User)
- [ ] Download extension ZIP
- [ ] Extract to folder
- [ ] Chrome → `chrome://extensions/`
- [ ] Enable "Developer mode"
- [ ] Click "Load unpacked"
- [ ] Select extracted folder
- [ ] Extension appears in toolbar
- [ ] Click extension → popup opens with submission form

---

## Files Modified

### Code Changes (3 commits)
1. **`vercel.json`** (f9e62801) - Fixed rewrite rule with negative lookahead
2. **`README.md`** (9b2c4616) - Force redeployment trigger
3. **`vercel.json`** (91c75f8b) - Added explicit headers for `/extensions/*.zip`

### Documentation Created
1. **`docs/EXTENSION_DOWNLOAD_FIX.md`** - Technical details of the fix
2. **`docs/ALIAS_CACHE_ISSUE.md`** - Why Vercel aliases cache differently
3. **`docs/CONTENT_PIPELINE_ISSUES.md`** - Full pipeline analysis
4. **`docs/URGENT_MANUAL_CACHE_PURGE_REQUIRED.md`** - Cache purge instructions
5. **`scripts/test-cache.sh`** - Automated cache testing script
6. **`docs/RESOLUTION_EXTENSION_DOWNLOADS.md`** (this file) - Resolution summary

---

## Lessons Learned

### 1. Vercel Rewrite Gotchas
- Catch-all rewrites `/(.*)` match EVERYTHING including static files
- Always use negative lookahead for static asset directories
- Test rewrites with preview build before deploying

### 2. Vercel CDN Cache Behavior
- Alias domains have separate edge cache from deployment URLs
- Deployment URL = always fresh after build
- Alias URL = may serve stale cache for hours/days
- **Manual cache purge required** when routing config changes

### 3. Header Specificity
- Explicit `Content-Type` headers prevent MIME type detection issues
- `Content-Disposition: attachment` forces download vs. inline display
- `Cache-Control: max-age=0, must-revalidate` prevents aggressive caching

---

## Prevention Measures

### 1. Updated Deployment Checklist
Add to `docs/current/DEPLOYMENT_CHECKLIST.md`:
```markdown
## Post-Deployment Verification (If Config Changed)
- [ ] Test deployment URL: https://blkout-community-platform.vercel.app
- [ ] If vercel.json changed: Purge alias cache in Vercel dashboard
- [ ] Test alias URL: https://blkout.vercel.app
- [ ] Run `./scripts/test-cache.sh` to verify cache freshness
```

### 2. Created Cache Testing Script
**Usage**:
```bash
./scripts/test-cache.sh
```

**Output**:
- Tests homepage cache age
- Tests extension download URLs
- Compares alias vs deployment URL
- Provides clear pass/fail indicators
- Shows exact steps to fix if broken

### 3. Documented Common Patterns
**Static file directories to exclude from SPA routing**:
- `/extensions/*` - Chrome extensions (added)
- `/api/*` - API endpoints (already excluded)
- `/assets/*` - Build assets (already excluded)
- `/downloads/*` - Future: other downloadable files

**Pattern for vercel.json**:
```json
{
  "source": "/((?!extensions/|downloads/|static/).*)",
  "destination": "/index.html"
}
```

---

## Next Steps

### Immediate (Today)
- [x] ✅ Extension downloads working on production
- [ ] User tests extension installation in Chrome
- [ ] User verifies extension popup opens correctly
- [ ] Test extension submission to n8n webhook (requires other fixes)

### Short-term (This Week)
- [ ] Fix remaining content pipeline issues (see `CONTENT_PIPELINE_ISSUES.md`):
  1. Add missing Supabase import to `api/webhooks/n8n.ts`
  2. Fix events API endpoint path in `src/services/events-api.ts`
  3. Configure environment variables (SUPABASE_SERVICE_ROLE_KEY, etc.)
  4. Test end-to-end: extension → webhook → moderation queue → publication

### Long-term
- [ ] Consider custom domain instead of Vercel alias
  - e.g., `platform.blkout.org` or `app.blkout.org`
  - Custom domains have more predictable cache behavior
  - Better for production branding

---

## Timeline

| Time | Action | Status |
|------|--------|--------|
| 04:00 | User reports downloads not working | 🔴 Issue reported |
| 04:15 | Identified vercel.json rewrite issue | 🔍 Root cause found |
| 04:20 | Fixed rewrite rule (f9e62801) | ✅ Code fixed |
| 04:25 | Discovered alias cache issue | 🔍 Cache blocking |
| 04:45 | Added explicit headers (91c75f8b) | ✅ Headers added |
| 05:00 | Documented cache purge requirement | 📝 Docs created |
| 07:45 | **User purged alias cache** | 🔧 Manual action |
| 07:47 | **Downloads verified working** | ✅ **RESOLVED** |

**Total Resolution Time**: ~4 hours (includes extensive debugging and documentation)

---

## Contact for Issues

If extension downloads break again:

1. **First**: Run `./scripts/test-cache.sh`
2. **If cache is stale**: Purge cache in Vercel dashboard
3. **If still broken**: Check `vercel.json` for rewrite changes
4. **Escalate**: Create GitHub issue with test script output

---

## Metrics

**Files Downloaded**:
- `blkout-events-curator-v1.0.0.zip` - 102KB
- `blkout-news-curator-v1.0.0.zip` - 94KB

**Cache Age After Purge**: 0 seconds (fresh)

**HTTP Response**:
- Status: 200 OK
- Content-Type: application/zip ✅
- Content-Disposition: attachment ✅
- Cache-Control: public, max-age=0, must-revalidate ✅

---

**Status**: ✅ **RESOLVED AND VERIFIED**
**Last Updated**: 2025-10-06 07:47 GMT
**Verified By**: Automated test script + manual verification
