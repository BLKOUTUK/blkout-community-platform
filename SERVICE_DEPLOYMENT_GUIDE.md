# BLKOUT Service Deployment Guide

**Created**: 2025-12-29
**Purpose**: Deploy 5 missing services to achieve 7/7 healthy status
**Context**: Health dashboard now monitoring all 7 services

---

## 🎯 Current Status (After Reintroduction)

**Health Dashboard Now Shows**:
- ✅ Main Website - blkoutuk.com (HEALTHY)
- ✅ Blog/Voices - blog.blkoutuk.cloud (HEALTHY)
- ❓ Events Calendar - events.blkoutuk.cloud (Need to deploy)
- ❓ Newsroom - news.blkoutuk.cloud (Need to deploy)
- ❓ Comms Dashboard - comms.blkoutuk.cloud (Need to deploy)
- ❓ CRM - crm.blkoutuk.cloud (Need to deploy)
- ❓ IVOR AI - ivor.blkoutuk.cloud (Need to deploy)

**Goal**: Deploy the 5 missing services to achieve 7/7 healthy status

---

## 📋 Service Overview

### Priority 1: Events Calendar (events.blkoutuk.cloud)

**Purpose**: Community event management
**Database**: Uses `events` table (43 pending events in database)
**Current Status**: Not deployed
**Impact**: HIGH (community events are core feature)

**What It Does**:
- Displays upcoming BLKOUT events
- Allows event submissions
- Calendar view of community gatherings
- Integration with Google Calendar (possibly)

**Deployment Requirements**:
- Repository: May need separate repo or use main repo
- Domain: events.blkoutuk.cloud
- Database: Supabase (events table)
- Environment Variables:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
  - VITE_SUPABASE_SERVICE_ROLE_KEY (for submissions)

**Questions to Answer**:
1. Does events.blkoutuk.cloud repo exist?
2. Or should events be hosted on main site at /events route?
3. Is there a separate events-calendar codebase?

---

### Priority 2: Newsroom (news.blkoutuk.cloud)

**Purpose**: BLKOUT news and journalism
**Database**: Uses `news_articles` table (125 published articles)
**Current Status**: Not deployed
**Impact**: HIGH (news content exists but not accessible)

**What It Does**:
- Displays 125 published news articles
- News archive and search
- Editorial content from BLKOUT journalists
- Possibly AI-generated content from Griot/Weaver agents

**Deployment Requirements**:
- Repository: May need separate repo
- Domain: news.blkoutuk.cloud
- Database: Supabase (news_articles table)
- Environment Variables:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY

**Questions to Answer**:
1. Does news.blkoutuk.cloud repo exist?
2. Or should newsroom be at /newsroom route on main site?
3. Is this the same as the /newsroom route that was falling back to home?

**Possible Solution**: The newsroom might be intended as a route on the main site, not a separate service!

---

### Priority 3: IVOR AI (ivor.blkoutuk.cloud)

**Purpose**: AI assistant for BLKOUT community
**Database**: May use conversation history tables
**Current Status**: Not deployed
**Impact**: MEDIUM (AI assistance for community)

**What It Does**:
- AI-powered community support
- Conversational interface
- Integration with GROQ AI (from IVOR documentation)
- Possibly FastAPI backend

**Deployment Requirements**:
- Repository: Likely separate repo (Python/FastAPI)
- Domain: ivor.blkoutuk.cloud
- API: GROQ AI integration
- Environment Variables:
  - GROQ_API_KEY
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY

**Questions to Answer**:
1. Is IVOR already deployed somewhere else?
2. Is there a separate ivor backend repository?
3. What's the current IVOR API endpoint?

**Note**: Main site has IVOR integration code in `src/services/ivor-integration.ts` and `src/components/ivor/`

---

### Priority 4: Comms Dashboard (comms.blkoutuk.cloud)

**Purpose**: Internal communications and announcements
**Database**: May use announcements tables
**Current Status**: Not deployed
**Impact**: MEDIUM (internal team tool)

**What It Does**:
- Team communications
- Announcement management
- Possibly admin-only tool
- Integration with email systems

**Deployment Requirements**:
- Repository: May be part of admin tools
- Domain: comms.blkoutuk.cloud
- Database: Supabase
- Environment Variables: TBD

**Questions to Answer**:
1. Is this deployed but at different URL?
2. Is this an internal tool or public-facing?
3. Does a comms-dashboard repo exist?

---

### Priority 5: CRM (crm.blkoutuk.cloud)

**Purpose**: Customer/Community Relationship Management
**Database**: Uses contacts, communication_history tables
**Current Status**: Not deployed
**Impact**: LOW (internal/admin tool, part of future Phase 2)

**What It Does**:
- Contact management
- Member database
- Communication tracking
- Part of future Command Center (Phase 2)

**Deployment Requirements**:
- Repository: May not exist yet (planned for Q1 2026)
- Domain: crm.blkoutuk.cloud
- Database: Supabase (contacts tables)
- Environment Variables: TBD

**Questions to Answer**:
1. Does CRM exist or is it planned?
2. Is this part of the Command Center roadmap (Phase 2)?
3. Should we deploy or remove from current monitoring?

---

## 🔍 Discovery Phase: Which Services Actually Exist?

Let's find out which of these 5 services have repositories:

### Check Local Repositories

```bash
# Search for service repositories
ls -la ~/blkout-platform/archive/legacy-active-projects/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/ | grep -i "event\|news\|comms\|crm\|ivor"
```

### Check GitHub Repositories

Look for these GitHub repos under BLKOUTUK organization:
- BLKOUTUK/events-calendar or BLKOUTUK/blkout-events
- BLKOUTUK/newsroom or BLKOUTUK/blkout-news
- BLKOUTUK/comms-dashboard or BLKOUTUK/blkout-comms
- BLKOUTUK/crm or BLKOUTUK/blkout-crm
- BLKOUTUK/ivor or BLKOUTUK/blkout-ivor

### Check Coolify Applications

**Log into Coolify**: https://infra.blkoutuk.cloud
**Look for**:
- Existing applications for these services
- Whether they're stopped vs never created
- DNS/domain configurations

---

## 🚀 Deployment Strategy

### Approach A: Separate Microservices (Complex but Scalable)

**If each service has its own repository**:

1. **For Each Service**:
   - Clone repository locally
   - Update environment variables
   - Test locally: `npm run dev`
   - Create Coolify application
   - Configure domain (*.blkoutuk.cloud)
   - Deploy to Coolify
   - Verify health check shows "HEALTHY"

**Benefits**:
- ✅ Independent deployments
- ✅ Easier to scale
- ✅ Technology flexibility (some could be Python, etc.)

**Drawbacks**:
- ❌ More complex to manage
- ❌ 5 separate deployments needed

---

### Approach B: Integrated Routes (Simple but Monolithic)

**If these should be routes on main site**:

1. **Add Routes to App.tsx**:
   ```typescript
   case 'newsroom':
     return <NewsroomPage />;
   case 'events-calendar':
     return <EventsCalendar />;
   // etc.
   ```

2. **Create Page Components**:
   - src/components/pages/NewsroomPage.tsx
   - src/components/pages/EventsCalendar.tsx
   - etc.

3. **Deploy Once**:
   - All services available at blkoutuk.com/[route]
   - Single deployment
   - Simpler to manage

**Benefits**:
- ✅ Single deployment
- ✅ Shared environment variables
- ✅ Easier to maintain

**Drawbacks**:
- ❌ Monolithic (harder to scale)
- ❌ All services in one codebase

---

### Approach C: Hybrid (Recommended)

**Main site routes** (simple services):
- /newsroom → NewsroomPage (displays 125 news articles)
- /events → EventsCalendar (displays approved events)

**Separate services** (complex/specialized):
- ivor.blkoutuk.cloud → IVOR AI backend (FastAPI/Python)
- comms.blkoutuk.cloud → Comms dashboard (if needed)
- crm.blkoutuk.cloud → CRM (future/Phase 2)

**Benefits**:
- ✅ Simple content on main site
- ✅ Complex services separated
- ✅ Balanced complexity

---

## 📊 Decision Matrix

| Service | Exists? | Priority | Approach | Timeline |
|---------|---------|----------|----------|----------|
| **Events Calendar** | ? | HIGH | TBD | This week |
| **Newsroom** | ? | HIGH | Route on main site? | This week |
| **IVOR AI** | Maybe | MEDIUM | Separate service | Next week |
| **Comms Dashboard** | ? | LOW | TBD | Future |
| **CRM** | No (planned) | LOW | Phase 2 (Q1 2026) | Future |

---

## 🔧 Quick Investigation Commands

**Run these to discover what exists**:

```bash
# Check local repositories
find ~/blkout-platform -type d -name "*event*" -o -name "*news*" -o -name "*ivor*" 2>/dev/null

# Check for newsroom component in main repo
find src/components/pages -name "*News*" -o -name "*Newsroom*"

# Check for events component
find src/components/pages -name "*Event*" -o -name "*Calendar*"

# Check for IVOR repos
ls ~/blkout-platform/archive/legacy-active-projects/ACTIVE_PROJECTS/ | grep -i ivor
```

---

## 🎯 Recommended Next Steps

### Step 1: Discovery (10 minutes)

Run investigation commands to find:
- Which services have repositories
- Which are already in main codebase
- Which need to be created

### Step 2: Prioritize (5 minutes)

Based on discovery, decide:
- **Events**: Deploy or add route?
- **Newsroom**: Deploy or add route? (125 articles ready!)
- **IVOR**: Deploy or integrate?
- **Comms/CRM**: Deploy, integrate, or defer?

### Step 3: Quick Win - Add Routes (30 minutes)

**If newsroom/events should be routes**:
1. Create NewsroomPage.tsx component
2. Create EventsCalendar.tsx component
3. Add to App.tsx navigation
4. Deploy once
5. Health check shows improvements!

### Step 4: Deploy Separate Services (1-2 hours each)

**For services that need separate deployment**:
1. Clone/create repository
2. Configure Coolify application
3. Set environment variables
4. Deploy and test
5. Verify health check shows "HEALTHY"

---

## 📁 Files Created for Reference

1. **DELETE_MOCK_DRAFTS.sql** - Safe cleanup of 3 draft articles
2. **MOCK_DATA_CLEANUP_REFINED.sql** - Manual review guide
3. **SERVICE_DEPLOYMENT_GUIDE.md** - This file

---

## ⏱️ Timeline

**Right Now (21:06)**:
- ✅ All 7 services added to health monitoring
- ⏳ Deployment in progress (2-3 minutes)

**In 3 Minutes (21:09)**:
1. Refresh health dashboard
2. See which services show "DOWN" (need deployment)
3. Export troubleshooting report
4. Report will show diagnosis for each down service

**Next**:
- Run discovery commands to find which services exist
- Decide deployment approach (routes vs separate services)
- Deploy systematically based on priority

---

## 💡 Key Questions for You

Before we start deploying, I need to know:

1. **Do you have separate repositories** for events/news/ivor/comms/crm?
2. **Should some of these be routes** on main site instead?
3. **Which services are CRITICAL** for community (events? newsroom?)
4. **Which can be deferred** (CRM is Phase 2 anyway)

Let me know what you find, or I can help you investigate! 🔍

**In 3 minutes**, refresh the health dashboard and share the new troubleshooting report - it will show exactly which services need deployment and give specific diagnoses for each! 🎯