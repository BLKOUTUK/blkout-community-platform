# Chrome Extensions - When Will They Be Online?

**Date**: 2025-10-06
**Status**: ✅ **Backend Ready** - Both extension API endpoints deployed
**Extensions**: Events Curator + News Curator
**Next Step**: Extensions need to update API URLs from Railway → Vercel

---

## Current Situation

### Extension Configurations

**Events Curator** is currently configured to submit to:
```
https://blkout-api-railway-production.up.railway.app/api/events/moderation-queue
```

**News Curator** is currently configured to submit to:
```
https://blkout-api-railway-production.up.railway.app/api/news/moderation-queue
```

### What's Working ✅
1. **Chrome extension downloads** - Both ZIPs available and downloadable from `/admin`
2. **Local storage fallback** - Both extensions save submissions to browser storage
3. **Vercel API endpoints** - Both endpoints now exist and are ready:
   - `/api/events/moderation-queue` ✅
   - `/api/news/moderation-queue` ✅

### What's Not Working ❌
1. **Railway backend endpoints** - Both return 404 on Railway:
   - `/api/events/moderation-queue` → 404
   - `/api/news/moderation-queue` → 404
2. **Extensions can't reach live backend** - Both show "saved locally (will sync when online)"

---

## When Will Extensions Go Online?

Both extensions will go **online immediately** when **ONE** of these happens:

### Option 1: Update Extensions to Use Vercel (Fastest) ⚡

**Change both extensions to point to Vercel instead of Railway:**

**Current (in both extension ZIPs):**
```javascript
this.apiEndpoint = 'https://blkout-api-railway-production.up.railway.app/api';
```

**Change to:**
```javascript
this.apiEndpoint = 'https://blkout.vercel.app/api';
```

**Result**:
- Events extension submits to `https://blkout.vercel.app/api/events/moderation-queue` ✅
- News extension submits to `https://blkout.vercel.app/api/news/moderation-queue` ✅

**Timeline**: Can be done immediately (requires rebuilding both extension ZIPs)

---

### Option 2: Add Endpoints to Railway Backend

**Add both moderation queue endpoints to Railway deployment**

- Railway backend exists at: `https://blkout-api-railway-production.up.railway.app`
- Currently returns 404 for both:
  - `/api/events/moderation-queue`
  - `/api/news/moderation-queue`
- Would need to deploy endpoint code to Railway

**Timeline**: Depends on Railway backend deployment setup

---

## Backend Endpoint Status

### ✅ Vercel Endpoints (Both Deployed)

#### Events Endpoint
**URL**: `https://blkout.vercel.app/api/events/moderation-queue`
**Status**: Live and ready to receive submissions
**Location**: `fresh-blkout/api/events/moderation-queue.ts`

**What it does:**
- Accepts POST requests from Events Curator extension
- Validates event data (title, date required)
- Stores in `events` table (status: `pending`)
- Also adds to `moderation_queue` for unified admin view
- Returns success/error response to extension

**Database Integration:**
- Uses Supabase with service role key
- Writes to `events` table
- Writes to `moderation_queue` table
- Both tables already exist and tested

#### News Endpoint
**URL**: `https://blkout.vercel.app/api/news/moderation-queue`
**Status**: Live and ready to receive submissions
**Location**: `fresh-blkout/api/news/moderation-queue.ts`

**What it does:**
- Accepts POST requests from News Curator extension
- Validates article data (title, content required)
- Stores in `news_articles` table (status: `draft`)
- Also adds to `moderation_queue` for unified admin view
- Generates unique slug from article title
- Returns success/error response to extension

**Database Integration:**
- Uses Supabase with service role key
- Writes to `news_articles` table
- Writes to `moderation_queue` table
- Both tables already exist and tested

---

### ❌ Railway Endpoints (Not Deployed)

**Events URL**: `https://blkout-api-railway-production.up.railway.app/api/events/moderation-queue`
**News URL**: `https://blkout-api-railway-production.up.railway.app/api/news/moderation-queue`
**Status**: Both return 404
**Issue**: Endpoints don't exist on Railway deployment

---

## Recommended Path: Update Both Extensions

**Why Option 1 (Vercel) is better:**

1. **Already deployed** - No backend changes needed
2. **Standalone modules** - Events & news independence maintained
3. **Same infrastructure** - Uses same Supabase database
4. **Faster** - Can rebuild extensions immediately

**Steps to go online with Vercel:**

### Events Extension

1. Extract current extension source:
```bash
unzip public/extensions/blkout-events-curator-v1.0.0.zip -d /tmp/events-ext
```

2. Edit `/tmp/events-ext/popup/popup.js` line 9:
```javascript
// OLD:
this.apiEndpoint = 'https://blkout-api-railway-production.up.railway.app/api';

// NEW:
this.apiEndpoint = 'https://blkout.vercel.app/api';
```

3. Rebuild ZIP:
```bash
cd /tmp/events-ext
zip -r blkout-events-curator-v1.0.1.zip ./*
mv blkout-events-curator-v1.0.1.zip /path/to/fresh-blkout/public/extensions/
```

### News Extension

1. Extract current extension source:
```bash
unzip public/extensions/blkout-news-curator-v1.0.0.zip -d /tmp/news-ext
```

2. Edit `/tmp/news-ext/popup/popup.js` line 9:
```javascript
// OLD:
this.apiEndpoint = 'https://blkout-api-railway-production.up.railway.app/api';

// NEW:
this.apiEndpoint = 'https://blkout.vercel.app/api';
```

3. Rebuild ZIP:
```bash
cd /tmp/news-ext
zip -r blkout-news-curator-v1.0.1.zip ./*
mv blkout-news-curator-v1.0.1.zip /path/to/fresh-blkout/public/extensions/
```

### Update Versions

4. Update manifest.json version in both extensions to "1.0.1"
5. Replace old ZIPs in `public/extensions/`
6. Update ModerationTools.tsx to reference v1.0.1

**Result**: Both extensions go online immediately, submissions flow to moderation queue

---

## Testing the Live Endpoints

### Test Events Endpoint

```bash
curl -X POST https://blkout.vercel.app/api/events/moderation-queue \
  -H "Content-Type: application/json" \
  -d '{
    "edited": {
      "title": "Test Event from API",
      "description": "Testing the moderation queue endpoint",
      "date": "2025-01-15",
      "startTime": "18:00",
      "location": "London",
      "organizer": "Test Organizer"
    },
    "original": {
      "url": "https://example.com/event"
    }
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Event submitted to moderation queue successfully",
  "event": {
    "id": "uuid-here",
    "title": "Test Event from API",
    "status": "pending",
    "date": "2025-01-15"
  },
  "timestamp": "2025-10-06T..."
}
```

### Test News Endpoint

```bash
curl -X POST https://blkout.vercel.app/api/news/moderation-queue \
  -H "Content-Type: application/json" \
  -d '{
    "edited": {
      "title": "Test News Article from API",
      "content": "Testing the news moderation queue endpoint with full content.",
      "excerpt": "Testing the news moderation queue",
      "category": "community",
      "author": "Test Author"
    },
    "original": {
      "url": "https://example.com/article"
    }
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "News article submitted to moderation queue successfully",
  "article": {
    "id": "uuid-here",
    "title": "Test News Article from API",
    "slug": "test-news-article-from-api-1234567890",
    "status": "draft",
    "category": "community"
  },
  "timestamp": "2025-10-06T..."
}
```

---

## What Happens When Extensions Submit

### Current Flow (Offline Mode):
```
Extension → Detects API unavailable → Saves to chrome.storage.local → Shows "saved locally"
```

### Future Flow (Online Mode):

#### Events Extension
```
Extension → POST /api/events/moderation-queue → events table → moderation_queue → Admin approval
```

**Step by step:**

1. **User clicks extension** on event page (Eventbrite, Meetup, etc.)
2. **Extension extracts** event data (Schema.org, Open Graph, manual)
3. **User reviews/edits** in popup form
4. **Clicks "Submit"** button
5. **Extension sends POST** to `/api/events/moderation-queue`
6. **Vercel endpoint**:
   - Validates data (title, date required)
   - Inserts into `events` table (status: `pending`)
   - Inserts into `moderation_queue` (type: `event`)
   - Returns success
7. **Extension shows** "Event submitted to moderation queue!"
8. **Offers to open** events admin dashboard

#### News Extension
```
Extension → POST /api/news/moderation-queue → news_articles table → moderation_queue → Admin approval
```

**Step by step:**

1. **User clicks extension** on news article page
2. **Extension extracts** article data (Schema.org, Open Graph, manual)
3. **User reviews/edits** in popup form
4. **Clicks "Submit"** button
5. **Extension sends POST** to `/api/news/moderation-queue`
6. **Vercel endpoint**:
   - Validates data (title, content required)
   - Generates unique slug
   - Inserts into `news_articles` table (status: `draft`)
   - Inserts into `moderation_queue` (type: `news`)
   - Returns success
7. **Extension shows** "Article submitted to moderation queue!"
8. **Offers to open** news admin dashboard

---

## Environment Variables Required

**Already configured in Vercel:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

**Optional (for full n8n pipeline):**
- `N8N_WEBHOOK_SECRET` - For n8n automation
- `IVOR_API_URL` - For AI content analysis
- `IVOR_API_KEY` - For AI authentication

**Extensions will work without optional variables** - they just enable advanced features.

---

## Current Database Status

**Events table:**
```sql
SELECT COUNT(*) FROM events WHERE status = 'pending';
-- Currently: 0 (no extension submissions yet)
```

**News articles table:**
```sql
SELECT COUNT(*) FROM news_articles WHERE status = 'draft';
-- Currently: 0 (no extension submissions yet)
```

**Moderation queue:**
```sql
SELECT COUNT(*) FROM moderation_queue WHERE type IN ('event', 'news');
-- Currently: 0 (no extension submissions yet)
```

**All tables ready to receive submissions when extensions go online.**

---

## Timeline Summary

| Action | Timeline | Status |
|--------|----------|--------|
| Backend endpoints deployed | ✅ Complete | Both Vercel live |
| Supabase tables ready | ✅ Complete | All tested |
| Extensions need update | ⏳ Pending | Change API URLs |
| Rebuild extension ZIPs | ⏳ Pending | 10-15 minutes |
| Deploy updated extensions | ⏳ Pending | Replace ZIP files |
| **Extensions online** | 🎯 **~45 minutes** | After ZIPs updated |

---

## Next Steps

1. **Rebuild both extensions** with Vercel API endpoints
2. **Test submission flows** end-to-end for both
3. **Update extension versions** to v1.0.1
4. **Deploy updated ZIPs** to `/public/extensions/`
5. **Update ModerationTools.tsx** to reference v1.0.1
6. **Test from fresh downloads** - verify online submissions work

---

**Status**: ✅ **Backend ready** - Both extensions can go online as soon as API URLs are updated
**Last Updated**: 2025-10-06 12:00 GMT
**Endpoints**:
- Events: `https://blkout.vercel.app/api/events/moderation-queue` ✅
- News: `https://blkout.vercel.app/api/news/moderation-queue` ✅
**Contact**: See `docs/CONTENT_PIPELINE_ISSUES.md` for full pipeline details
