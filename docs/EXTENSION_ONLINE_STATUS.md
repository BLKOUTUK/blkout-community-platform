# Chrome Extension - When Will It Be Online?

**Date**: 2025-10-06
**Status**: ✅ **Backend Ready** - Extension API endpoint deployed
**Next Step**: Extension needs to connect to Railway backend (or update to use Vercel)

---

## Current Situation

### Extension Configuration
The Chrome extension (Events Curator) is currently configured to submit to:
```
https://blkout-api-railway-production.up.railway.app/api/events/moderation-queue
```

### What's Working ✅
1. **Chrome extension downloads** - ZIPs available and downloadable from `/admin`
2. **Local storage fallback** - Extension saves submissions to browser storage
3. **Vercel API endpoint** - `/api/events/moderation-queue` now exists and is ready

### What's Not Working ❌
1. **Railway backend endpoint** - `/api/events/moderation-queue` returns 404 on Railway
2. **Extension can't reach live backend** - Shows "saved locally (will sync when online)"

---

## When Will Extension Go Online?

The extension will go **online immediately** when **ONE** of these happens:

### Option 1: Update Extension to Use Vercel (Fastest) ⚡

**Change extension to point to Vercel instead of Railway:**

**Current (in extension ZIP):**
```javascript
this.apiEndpoint = 'https://blkout-api-railway-production.up.railway.app/api';
```

**Change to:**
```javascript
this.apiEndpoint = 'https://blkout.vercel.app/api';
```

**Result**: Extension will submit to `https://blkout.vercel.app/api/events/moderation-queue` ✅

**Timeline**: Can be done immediately (requires rebuilding extension ZIP)

---

### Option 2: Add Endpoint to Railway Backend

**Add the `/api/events/moderation-queue` endpoint to Railway deployment**

- Railway backend exists at: `https://blkout-api-railway-production.up.railway.app`
- Currently returns 404 for `/api/events/moderation-queue`
- Would need to deploy endpoint code to Railway

**Timeline**: Depends on Railway backend deployment setup

---

## Backend Endpoint Status

### ✅ Vercel Endpoint (Deployed)
**URL**: `https://blkout.vercel.app/api/events/moderation-queue`
**Status**: Live and ready to receive submissions
**Location**: `fresh-blkout/api/events/moderation-queue.ts`

**What it does:**
- Accepts POST requests from Chrome extension
- Validates event data (title, date required)
- Stores in `events` table (status: `pending`)
- Also adds to `moderation_queue` for unified admin view
- Returns success/error response to extension

**Database Integration:**
- Uses Supabase with service role key
- Writes to `events` table
- Writes to `moderation_queue` table
- Both tables already exist and tested

---

### ❌ Railway Endpoint (Not Deployed)
**URL**: `https://blkout-api-railway-production.up.railway.app/api/events/moderation-queue`
**Status**: Returns 404
**Issue**: Endpoint doesn't exist on Railway deployment

---

## Recommended Path: Update Extension

**Why Option 1 (Vercel) is better:**

1. **Already deployed** - No backend changes needed
2. **Standalone module** - Events calendar independence maintained
3. **Same infrastructure** - Uses same Supabase database
4. **Faster** - Can rebuild extension immediately

**Steps to go online with Vercel:**

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

4. Update version in manifest and redeploy

**Result**: Extension goes online immediately, submissions flow to moderation queue

---

## Testing the Live Endpoint

**Test Vercel endpoint is working:**

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

---

## What Happens When Extension Submits

### Current Flow (Offline Mode):
```
Extension → Detects API unavailable → Saves to chrome.storage.local → Shows "saved locally"
```

### Future Flow (Online Mode):
```
Extension → POST to API endpoint → Supabase events table → Moderation queue → Admin approval
```

**Step by step:**

1. **User clicks extension** on event page
2. **Extension extracts** event data (Schema.org, Open Graph, manual)
3. **User reviews/edits** in popup form
4. **Clicks "Submit"** button
5. **Extension sends POST** to `/api/events/moderation-queue`
6. **Vercel endpoint**:
   - Validates data
   - Inserts into `events` table (status: `pending`)
   - Inserts into `moderation_queue` (status: `pending_review`)
   - Returns success
7. **Extension shows** "Event submitted to moderation queue!"
8. **Offers to open** admin dashboard for review

---

## Environment Variables Required

**Already configured in Vercel:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

**Optional (for full n8n pipeline):**
- `N8N_WEBHOOK_SECRET` - For n8n automation
- `IVOR_API_URL` - For AI content analysis
- `IVOR_API_KEY` - For AI authentication

**Extension will work without optional variables** - they just enable advanced features.

---

## Current Database Status

**Events table:**
```sql
SELECT COUNT(*) FROM events WHERE status = 'pending';
-- Currently: 0 (no extension submissions yet)
```

**Moderation queue:**
```sql
SELECT COUNT(*) FROM moderation_queue WHERE type = 'event';
-- Currently: 0 (no extension submissions yet)
```

**Both tables ready to receive submissions when extension goes online.**

---

## Timeline Summary

| Action | Timeline | Status |
|--------|----------|--------|
| Backend endpoint deployed | ✅ Complete | Vercel live |
| Supabase tables ready | ✅ Complete | Tested |
| Extension needs update | ⏳ Pending | Change API URL |
| Rebuild extension ZIP | ⏳ Pending | 5-10 minutes |
| Deploy updated extension | ⏳ Pending | Replace ZIP file |
| **Extension online** | 🎯 **~30 minutes** | After ZIP update |

---

## Next Steps

1. **Rebuild extension** with Vercel API endpoint
2. **Test submission flow** end-to-end
3. **Update extension version** to v1.0.1
4. **Deploy updated ZIP** to `/public/extensions/`
5. **Test from fresh download** - verify online submission works

---

**Status**: ✅ **Backend ready** - Extension can go online as soon as API URL is updated
**Last Updated**: 2025-10-06 11:30 GMT
**Contact**: See `docs/CONTENT_PIPELINE_ISSUES.md` for full pipeline details
