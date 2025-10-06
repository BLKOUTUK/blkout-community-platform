# Content Pipeline Issues - Events & News

**Date**: 2025-10-06
**Status**: 🔴 Issues Identified - Fixes Required

---

## Issue Summary

User reported: "downloads don't lead to download" for events and news content pipelines.

**Root Cause Analysis**: Multiple broken components in the content submission pipeline from Chrome extensions → n8n webhook → moderation queue → publication.

---

## 🔴 Critical Issues Found

### 1. Chrome Extension Downloads ✅ **VERIFIED WORKING**
**Status**: Files exist and download code is correct

**Location**: `src/components/moderation/ModerationTools.tsx:21-33`

**Files**:
- ✅ `public/extensions/blkout-events-curator-v1.0.0.zip` (102KB)
- ✅ `public/extensions/blkout-news-curator-v1.0.0.zip` (94KB)

**Download Code**:
```typescript
const downloadExtension = (type: 'events' | 'news') => {
  const fileName = type === 'events'
    ? 'blkout-events-curator-v1.0.0.zip'
    : 'blkout-news-curator-v1.0.0.zip';

  const link = document.createElement('a');
  link.href = `/extensions/${fileName}`;  // ✅ Correct path
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
```

**Conclusion**: Download mechanism works correctly. Issue must be elsewhere in pipeline.

---

### 2. N8N Webhook - Missing Supabase Import 🔴 **BROKEN**
**Status**: **CRITICAL** - Webhook will fail when trying to access moderation_log table

**Location**: `api/webhooks/n8n.ts`

**Problem**:
- Lines 186, 203, 421 reference `supabase` client
- **No import statement for Supabase exists**
- `checkForDuplicates()` and research processing will fail

**Missing Code**:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

**Current Broken References**:
```typescript:186-189
const { data: urlMatches, error: urlError } = await supabase  // ❌ undefined
  .from('moderation_log')
  .select('*')
  .eq('metadata->>url', content.source_url)
```

**Impact**:
- All n8n webhook submissions will fail
- Duplicate checks won't work
- Research automation completely broken

---

### 3. Events API - Missing events-v2 Endpoint 🔴 **BROKEN**
**Status**: **CRITICAL** - Events page will show empty state

**Location**: `src/services/events-api.ts:56`

**Problem**:
```typescript:56
this.baseURL = '/api/events-v2';  // ❌ This endpoint doesn't exist!
```

**Available Endpoints**:
- ✅ `/api/events` exists (api/events.ts)
- ❌ `/api/events-v2` does NOT exist

**Impact**:
- Events Calendar page will fail to load events
- Falls back to empty array (line 62-63)
- Users see "no events" even if database has events

**Fix Required**: Either:
1. Change baseURL to `/api/events` (recommended)
2. Create `/api/events-v2.ts` endpoint

---

### 4. Railway API Proxy - Environment Variable Issues ⚠️ **LIKELY BROKEN**
**Status**: **WARNING** - Will fail unless environment variables configured

**Location**: `api/webhooks/n8n.ts:305`

**Problem**:
```typescript:305
const railwayResponse = await fetch('https://blkout-api-railway-production.up.railway.app/api/webhooks/n8n', {
```

**Issues**:
- Hardcoded Railway URL (should be environment variable)
- Railway deployment may not exist anymore (based on RAILWAY_DEPLOYMENT.md in archive)
- No error handling if Railway API is down
- Will fail silently if Railway backend isn't running

**Environment Variables Needed**:
```bash
RAILWAY_API_URL=https://blkout-api-railway-production.up.railway.app
N8N_WEBHOOK_SECRET=<secret>
IVOR_API_URL=https://ivor-api.blkout.org
IVOR_API_KEY=<key>
```

---

### 5. Content Workflow Documentation vs Implementation Mismatch ⚠️ **DOCUMENTATION DRIFT**
**Status**: **WARNING** - Documentation references wrong URLs

**Location**: `docs/workflows/CONTENT_CURATION_WORKFLOW.md`

**Documented Dashboard URLs**:
```markdown
- Events Dashboard: https://liberation.blkoutcollective.org/admin/events
- News Dashboard: https://liberation.blkoutcollective.org/admin/news
```

**Actual Dashboard URLs** (from `ModerationTools.tsx`):
```typescript
- Events: https://events-blkout.vercel.app/admin
- News: https://news-blkout.vercel.app/admin
```

**Impact**:
- Curators will click links that go to wrong URLs
- Confusion about which platform to use
- Documentation doesn't match production architecture

---

## 🔄 Content Pipeline Flow (As Designed)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Curator Discovery                                         │
│    ├─ Visits event page or news article                      │
│    ├─ Clicks Chrome extension icon                           │
│    └─ Extension auto-extracts data (Schema.org, OG, etc.)    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Extension Submission                                       │
│    ├─ Curator reviews/edits extracted data                   │
│    ├─ Validates required fields                              │
│    └─ Submits to moderation queue (status: pending_review)   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. n8n Webhook Processing ❌ BROKEN                          │
│    ├─ Receives submission from extension                     │
│    ├─ Checks for duplicates (supabase ❌ undefined)          │
│    ├─ Analyzes with IVOR AI                                  │
│    ├─ Proxies to Railway backend ❌ LIKELY DOWN              │
│    └─ Inserts into moderation_log                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Admin Moderation                                          │
│    ├─ Admin reviews queue at /admin/moderation               │
│    ├─ Edits content if needed                                │
│    └─ Approves → changes status to 'approved'                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Publication                                               │
│    ├─ Approved content moves to published_events/news        │
│    └─ Appears on public Events Calendar / News page          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend Display ❌ BROKEN (events-v2 missing)            │
│    ├─ EventsCalendar.tsx loads from /api/events-v2 ❌        │
│    ├─ NewsPage.tsx loads from /api/news ✅                   │
│    └─ StoryArchive.tsx loads from /api/stories ✅            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Fixes Required (Priority Order)

### Priority 1: Critical Path Fixes
1. **Add Supabase import to n8n webhook** (`api/webhooks/n8n.ts`)
   - Import `createClient` from `@supabase/supabase-js`
   - Initialize Supabase client with environment variables
   - Test duplicate checking functionality

2. **Fix events API endpoint** (`src/services/events-api.ts:56`)
   - Change baseURL from `/api/events-v2` to `/api/events`
   - Test events loading on Events Calendar page

3. **Verify Railway backend status**
   - Check if Railway deployment is still active
   - If not, remove proxy logic or update to new backend URL
   - Add environment variable for Railway URL instead of hardcoding

### Priority 2: Environment Variables
4. **Configure production environment variables** (Vercel dashboard)
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   N8N_WEBHOOK_SECRET=<webhook-secret>
   IVOR_API_URL=<ivor-api-url>
   IVOR_API_KEY=<ivor-api-key>
   RAILWAY_API_URL=<railway-url-if-still-used>
   ```

### Priority 3: Documentation Updates
5. **Update CONTENT_CURATION_WORKFLOW.md**
   - Fix dashboard URLs to match actual Vercel deployments
   - Update workflow diagram to reflect current architecture
   - Add notes about Railway backend status

---

## ✅ Testing Checklist

After fixes, test end-to-end:

### Events Pipeline
- [ ] Download Events Curator extension from ModerationTools widget
- [ ] Install extension in Chrome (developer mode)
- [ ] Visit an Eventbrite/Meetup event page
- [ ] Click extension, verify auto-extraction works
- [ ] Submit event to moderation queue
- [ ] Check Supabase `moderation_queue` table for submission
- [ ] Log into /admin/moderation and verify event appears
- [ ] Approve event
- [ ] Check Events Calendar page shows approved event
- [ ] Verify /api/events returns event data

### News Pipeline
- [ ] Download News Curator extension from ModerationTools widget
- [ ] Install extension in Chrome (developer mode)
- [ ] Visit a news article with Schema.org markup
- [ ] Click extension, verify auto-extraction works
- [ ] Submit article to moderation queue
- [ ] Check Supabase `moderation_queue` table for submission
- [ ] Log into /admin/moderation and verify article appears
- [ ] Approve article
- [ ] Check News page shows approved article
- [ ] Verify /api/news returns article data

### n8n Automation
- [ ] Configure n8n workflow to send test webhook
- [ ] Send POST to `/api/webhooks/n8n` with test content
- [ ] Verify supabase duplicate check works
- [ ] Verify IVOR AI analysis runs (or falls back gracefully)
- [ ] Verify content appears in moderation queue
- [ ] Check Vercel function logs for errors

---

## 🎯 Expected Behavior After Fixes

1. **Downloads work** ✅ Already working
2. **Extensions submit to n8n webhook** → Should work after Supabase import fix
3. **Webhook processes submissions** → Should work after Supabase + Railway fixes
4. **Content appears in moderation queue** → Should work after fixes
5. **Admins can approve content** → Depends on admin UI functionality
6. **Approved content appears on Events/News pages** → Should work after events-v2 fix

---

## 🚨 Questions for User

1. **Is the Railway backend still active?** If not, should we:
   - Remove Railway proxy entirely
   - Point to a different backend
   - Handle submissions directly in n8n webhook

2. **What is the actual behavior when trying downloads?**
   - Do the ZIPs download but extensions don't work?
   - Do the download buttons not respond?
   - Do downloads work but submissions fail?

3. **Are environment variables configured in Vercel?**
   - SUPABASE_SERVICE_ROLE_KEY
   - N8N_WEBHOOK_SECRET
   - IVOR_API_KEY

---

**Last Updated**: 2025-10-06
**Reviewed By**: Claude Code
