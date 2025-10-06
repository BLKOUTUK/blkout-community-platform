# Voices Page Image Loading Fix

**Date**: 2025-10-06
**Status**: ✅ **CODE FIXED** - Requires cache purge for production
**Related**: Extension downloads cache fix

---

## Problem Summary

**User Report**: Images on Voices page (https://blkout.vercel.app/voces) do not load

**Symptoms**:
- Voices page shows broken image placeholders
- Fallback images not displaying
- Image URLs return 404 or incorrect content type

---

## Root Cause

### Issue 1: Path Case Mismatch in Component Code

**VoicesPage.tsx** hardcoded incorrect fallback paths:
```typescript
// ❌ INCORRECT (3 locations in VoicesPage.tsx)
src={article.hero_image || '/Fallback images/blue images/blue man.jpg'}
//                          ^ Capital F, spaces in folder/file names
```

**Actual file structure:**
```
public/
  └── fallback-images/          # ✅ lowercase, hyphens
      ├── blue-images/
      │   └── blue-man.jpg      # ✅ lowercase, hyphens
      ├── red-images/
      ├── gold-images/
      └── green-images/
```

**Database migration** (`20251001_fix_voices_image_paths.sql`) already fixed database to use correct paths:
```sql
UPDATE voices_articles
SET hero_image = '/fallback-images/blue-images/blue-man.jpg'
```

**But component code never updated to match!**

### Issue 2: Stale Vercel Cache (Same as Extensions)

Even after deploying the fix, Vercel alias cache serves old content:
```bash
$ curl -I https://blkout.vercel.app/voces

age: 2442                    # ❌ 40+ minutes old
x-vercel-cache: HIT          # ❌ Serving from edge cache
etag: "b8d7f0ab..."          # ❌ Same etag for hours
```

---

## Solution Implemented

### 1. Fixed VoicesPage.tsx Image Paths

**Commit**: [Current commit]

Updated **3 locations** in `src/components/pages/VoicesPage.tsx`:

**Line 75** - Article detail hero:
```typescript
// BEFORE
src={selectedArticle.hero_image || '/Fallback images/blue images/blue man.jpg'}

// AFTER
src={selectedArticle.hero_image || '/fallback-images/blue-images/blue-man.jpg'}
```

**Line 234** - Featured article hero:
```typescript
// BEFORE
src={featuredArticles[1].hero_image || '/Fallback images/blue images/blue man.jpg'}

// AFTER
src={featuredArticles[1].hero_image || '/fallback-images/blue-images/blue-man.jpg'}
```

**Line 334** - Article grid thumbnails:
```typescript
// BEFORE
src={article.thumbnail_image || article.hero_image || '/Fallback images/blue images/blue man.jpg'}

// AFTER
src={article.thumbnail_image || article.hero_image || '/fallback-images/blue-images/blue-man.jpg'}
```

### 2. Cache Purge Required (Manual Step)

**After deployment, user must purge cache:**

1. Go to https://vercel.com/blkoutuk/blkout-community-platform
2. Settings → Domains
3. Find `blkout.vercel.app`
4. Click ⋮ → **Purge Cache**
5. Wait 1-2 minutes for global propagation

**Why needed**: Vercel alias cache persists across deployments when routing/content doesn't change dramatically. The cache was created when paths were broken, so it cached 404s or wrong content.

---

## Verification Steps

### After Deployment + Cache Purge:

**1. Test Voces Page Load**
```bash
curl -I https://blkout.vercel.app/voces

# Expected:
# age: 0 (or small number)
# content-type: text/html
# x-vercel-cache: MISS (first request after purge)
```

**2. Test Fallback Image**
```bash
curl -I https://blkout.vercel.app/fallback-images/blue-images/blue-man.jpg

# Expected:
# HTTP/2 200
# content-type: image/jpeg
# age: 0
```

**3. Browser Test**
- Open https://blkout.vercel.app/voces
- Verify featured article hero image displays
- Verify article grid thumbnails display
- Click an article → verify article detail hero image displays

**4. Check Database Image URLs**
```sql
SELECT id, title, hero_image, thumbnail_image
FROM voices_articles
WHERE published = true
LIMIT 5;

-- All image URLs should use:
-- /fallback-images/{color}-images/{color}-man.jpg
-- (lowercase, hyphens, no spaces)
```

---

## Related Issues

### Same Cache Problem as Extensions

This is **identical to the extension download cache issue** resolved earlier today:
- Vercel alias cache persists across deployments
- Manual cache purge required when content/routing changes
- Deployment URL works immediately, alias URL requires manual intervention

See: `docs/RESOLUTION_EXTENSION_DOWNLOADS.md`

### Database Already Fixed

The database migration `20251001_fix_voices_image_paths.sql` already updated all image paths in the `voices_articles` table to use correct lowercase/hyphenated paths.

**The component code just never caught up with the migration!**

---

## Files Modified

### Code Changes
1. **`src/components/pages/VoicesPage.tsx`** - Fixed 3 hardcoded fallback image paths

### Documentation Created
1. **`docs/VOICES_IMAGE_FIX.md`** (this file) - Technical fix details

---

## Prevention Measures

### 1. Image Path Constants

**Create centralized image path constants** to avoid hardcoding:

```typescript
// src/lib/fallback-images.ts
export const FALLBACK_IMAGES = {
  blue: '/fallback-images/blue-images/blue-man.jpg',
  red: '/fallback-images/red-images/red-man.jpg',
  gold: '/fallback-images/gold-images/gold-man.jpg',
  green: '/fallback-images/green-images/green-man.jpg',
} as const;

export const getDefaultFallbackImage = () => FALLBACK_IMAGES.blue;
```

**Usage in components:**
```typescript
import { getDefaultFallbackImage } from '@/lib/fallback-images';

<img src={article.hero_image || getDefaultFallbackImage()} />
```

### 2. Type Safety for Image Paths

**Add validation in TypeScript types:**
```typescript
export interface VoicesArticle {
  // ...
  hero_image?: `/fallback-images/${string}` | `https://${string}`;
  thumbnail_image?: `/fallback-images/${string}` | `https://${string}`;
}
```

This ensures only valid path patterns are used.

### 3. Migration + Component Sync Checklist

When updating database image paths:
- [ ] Run database migration
- [ ] Search codebase for hardcoded image paths
- [ ] Update all component fallbacks to match migration
- [ ] Test locally before deploying
- [ ] Document cache purge requirement

### 4. Use Cache Testing Script

Run after deployment:
```bash
./scripts/test-cache.sh
```

This will detect stale cache and provide fix instructions.

---

## Lessons Learned

### 1. Component Code ≠ Database State

Database migrations can update image URLs, but **component fallbacks must be updated separately**. Always check:
- Component hardcoded paths
- Default values in React props
- Fallback logic in ternaries

### 2. Vercel Cache Consistency

**Two separate cache issues in one day:**
1. Extension downloads
2. Voices page images

**Both required manual cache purge** despite code being fixed and deployed.

**Pattern**: When fixing routing, paths, or static content, **always plan for manual cache purge**.

### 3. File Naming Conventions Matter

**Spaces in folder/file names cause issues:**
- URL encoding problems (`%20`)
- Shell command escaping requirements
- Deployment platform inconsistencies

**Best practice**: Use hyphens or underscores, lowercase only.

---

## Timeline

| Time | Action | Status |
|------|--------|--------|
| (Earlier) | Database migration fixed image paths | ✅ Completed |
| 08:28 | User reports images not loading on Voces | 🔴 Issue reported |
| 08:30 | Identified hardcoded path mismatch | 🔍 Root cause found |
| 08:35 | Fixed VoicesPage.tsx (3 locations) | ✅ Code fixed |
| **Next** | **User deploys + purges cache** | ⏳ **Pending** |

---

## Next Steps

### Immediate (After Deployment)
1. Deploy code changes to production
2. **Manually purge Vercel alias cache** (critical!)
3. Test Voces page in browser
4. Verify images load correctly

### Short-term
1. Create `src/lib/fallback-images.ts` constants file
2. Refactor all image fallbacks to use constants
3. Add TypeScript path validation
4. Document in style guide: "Never hardcode image paths"

### Long-term
1. Consider CDN with more predictable cache behavior
2. Implement automated cache invalidation on deployment
3. Add image path validation in CI/CD pipeline

---

## Related Documentation

- `docs/RESOLUTION_EXTENSION_DOWNLOADS.md` - Extension download cache fix
- `docs/ALIAS_CACHE_ISSUE.md` - Vercel alias cache explanation
- `scripts/test-cache.sh` - Automated cache testing
- `supabase/migrations/20251001_fix_voices_image_paths.sql` - Database migration

---

## ✅ RESOLUTION UPDATE - 2025-10-06 08:50 GMT

### Root Cause Identified

The **actual problem** was not just path case mismatch - the migration script referenced **non-existent files**:
- ❌ `red-man.jpg` - doesn't exist
- ❌ `gold-man.jpg` - doesn't exist
- ❌ `green-man.jpg` - doesn't exist
- ✅ `blue-man.jpg` - exists

### Final Fix Applied

**Migration**: `20251006_fix_voices_images_correct_paths.sql`

Updated database to use **actual existing images** from each color folder:
- **Red**: `tumblr_5d9a2ccc0fa2a56133c0501cacc46adf_6a189059_1280.jpg` ✅
- **Gold**: `tumblr_1a0f924dc738fc40cef878489094f2d4_8441c000_1280.jpg` ✅
- **Green**: `tumblr_5b1b6534f4a738ceb37e212fb4433518_cf767bfe_1280.jpg` ✅
- **Blue**: `blue-man.jpg` ✅

All images verified accessible on production.

---

**Status**: ✅ **FULLY RESOLVED** - Database updated with existing image paths
**Last Updated**: 2025-10-06 08:50 GMT
**Verified By**: Migration applied, all image URLs return HTTP 200 with image/jpeg
