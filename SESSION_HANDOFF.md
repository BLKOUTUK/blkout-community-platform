# BLKOUT Platform Deployment - Session Handoff

**Date**: 2025-12-28
**Context**: Event cancelled due to deployment failures. Working to restore platform functionality.

## What Works ✅

- **Stories Archive**: 281 articles accessible at https://blkoutuk.com/stories
  - Joseph Beam articles found and accessible
  - Text contrast fixed with CSS overrides
  - Supabase legacy_articles table connected

- **Homepage**: Correct codebase (blkout-community-platform) deployed
  - Discover page functional
  - Navigation works

- **Server**: Express running on port 80 with tsx for TypeScript

## What Doesn't Work ❌

1. **Newsroom** (`/newsroom`)
   - Shows empty/no articles
   - Database has 125 published articles
   - API likely misconfigured

2. **Events Page** (`/events`)
   - Blank page or unstable
   - Database has 43 pending + 25 in moderation_queue
   - Needs event approval workflow

3. **Admin Dashboard** (`https://blkoutuk.com/admin`)
   - Visible but approve buttons don't work
   - Error: "not valid JSON" when clicking approve
   - Needs SERVICE_ROLE_KEY for database writes

## Root Cause

**Environment variables not working** despite being:
- Added to Coolify UI
- Marked "available at build time"
- Hardcoded in Dockerfile (commit 17cdf344)

**The VITE_ env vars should be baked into JavaScript during build but aren't reaching the code.**

## Deployment Details

**Correct Repository**: `BLKOUTUK/blkout-community-platform`
- Location: `/home/robbe/blkout-platform/archive/legacy-active-projects/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform`
- Latest commit: 17cdf344
- Platform: Coolify (blkout-core application)
- Port: 80
- Domain: blkoutuk.com

**Wrong Repository** (Don't use): `BLKOUTUK/blkout-website`
- This was experimental/side project
- Theory of Change built here but shouldn't have been

## Hardcoded Credentials in Dockerfile

**Location**: Lines 27-38 in Dockerfile

```
ENV VITE_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...
ENV VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...
ENV NEXT_PUBLIC_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...
ENV VITE_EVENTS_API_URL=https://events.blkoutuk.cloud
ENV VITE_NEWS_API_URL=https://news.blkoutuk.cloud
ENV VITE_IVOR_API_URL=https://ivor.blkoutuk.cloud
```

**⚠️ SECURITY NOTE**: These are temporarily hardcoded. Remove after verifying site works and fix Coolify env var passing.

## Next Steps

1. **Verify build includes credentials:**
   - Check build logs for ENV commands executing
   - Or SSH into container: `docker exec [container] env | grep VITE`

2. **If credentials still not working:**
   - Problem is in how Vite processes env vars
   - May need to use import.meta.env differently
   - Or create a .env file in container

3. **Fix Admin approve buttons:**
   - Likely calling wrong endpoint
   - Or liberationDB using wrong Supabase client
   - Check browser console for actual error

4. **Fix Events/Newsroom pages:**
   - Verify they're calling correct APIs
   - Check if they need different env var names
   - Ensure components handle empty/loading states

## Database Status

**Supabase Tables**:
- `legacy_articles`: 281 published (Stories) ✅ Working
- `news_articles`: 125 published (Newsroom) ❌ Not connecting
- `events`: 43 pending (Events) ❌ Not showing
- `moderation_queue`: 25 pending events (Admin) ❌ Can't approve

## Lessons Learned

1. **Repo confusion**: blkout-website vs blkout-community-platform
2. **Environment variables**: VITE_ vars must be at build time
3. **Health checks**: Dockerfile health checks conflicted with Coolify
4. **Route syntax**: Express 5 doesn't support `app.get('*')` wildcards
5. **TypeScript in production**: Needed tsx to import .ts API files

## Files Modified This Session

1. `Dockerfile` - Express server, tsx, hardcoded env vars
2. `server.cjs` - Fixed route syntax, commented IVOR proxy
3. `api/stories.ts` - Changed to legacy_articles table
4. `src/components/pages/StoryArchive.tsx` - Text contrast CSS overrides

## Critical Architecture Note

**Per DEPLOYMENT-PLAN.md:**
- Main site (blkoutuk.com) should serve from blkout-community-platform ✅ NOW CORRECT
- Specialized apps (events, news, etc.) on *.blkoutuk.cloud ✅ Already deployed
- Everything on Coolify Hostinger UK servers ✅ Correct

## Recommendation for Next Session

**Build unified command center dashboard** as originally requested:
- Platform health monitoring
- Service status validation
- Pre-deployment checklist
- CRM/Finance/Grants integration points

This would have prevented the deployment emergency by validating everything before going live.
