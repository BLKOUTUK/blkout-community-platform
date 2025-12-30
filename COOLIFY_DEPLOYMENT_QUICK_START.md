# BLKOUT Services - Coolify Deployment Quick Start

**Created**: 2025-12-29 21:10
**Purpose**: Deploy 5 services to achieve 7/7 healthy status
**All services are GitHub-ready and can be deployed immediately!**

---

## ✅ Verified: All Services Ready to Deploy

| # | Service | GitHub Repository | Domain | Status |
|---|---------|-------------------|--------|--------|
| 1 | **Newsroom** | `BLKOUTUK/news-blkout` | news.blkoutuk.cloud | ✅ Ready |
| 2 | **Events** | `BLKOUTUK/black-qtipoc-events-calendar` | events.blkoutuk.cloud | ✅ Ready |
| 3 | **IVOR AI** | `BLKOUTUK/ivor-core` | ivor.blkoutuk.cloud | ✅ Ready |
| 4 | **Comms** | `blkoutuk/comms-blkout` | comms.blkoutuk.cloud | ✅ Ready |
| 5 | **CRM** | `BLKOUTUK/blkout-crm` | crm.blkoutuk.cloud | ✅ Ready |

---

## 🚀 Coolify Deployment Steps (For Each Service)

### Step-by-Step Deployment

**Log into Coolify**: https://infra.blkoutuk.cloud

**For each service**, follow these steps:

#### 1. Create New Application

- Click **"+ New"** button
- Select **"Application"**

#### 2. Connect Repository

- **Source**: GitHub
- **Organization**: BLKOUTUK (or blkoutuk for comms)
- **Repository**: Select from list (see table above)
- **Branch**: `main`

#### 3. Configure Build

- **Build Pack**: **Dockerfile** (all 5 have Dockerfiles!)
- **Port**: 3000 (default, or check Dockerfile)
- Auto-detected from Dockerfile

#### 4. Set Domain

Enter the domain for each service:
- news.blkoutuk.cloud
- events.blkoutuk.cloud
- ivor.blkoutuk.cloud
- comms.blkoutuk.cloud
- crm.blkoutuk.cloud

#### 5. Add Environment Variables

**For ALL services, add these**:
```
VITE_SUPABASE_URL = https://bgjengudzfickgomjqmz.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTIyNzUsImV4cCI6MjA0ODQ4ODI3NX0.ZGVudWlhDWWsczN0Y0FHQVE5SzlHZGRyM2pqUkpNMDh6RGd1S19BUQ
```

**For IVOR AI, also add**:
```
GROQ_API_KEY = [your-groq-api-key]
VITE_SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjkxMjI3NSwiZXhwIjoyMDQ4NDg4Mjc1fQ.cW1hNmZRQlNkeWxYZDRqb0JNY0JLZjFyVTBWQTFPMGdBVzROWlV0YWc
```

**Mark as**: ✅ Available at build time

#### 6. Deploy!

- Click **"Deploy"** button
- Watch build logs
- Wait 3-5 minutes per service

#### 7. Verify

After each deployment:
```bash
# Test the service
curl -I https://[service].blkoutuk.cloud

# Should return:
# HTTP/2 200
```

Then check health dashboard:
```
Visit: https://blkoutuk.com/health-dashboard
Click: "Refresh"
Expected: Service shows HEALTHY
```

---

## ⚡ Parallel Deployment (Fast Track - 20 Minutes Total)

**Deploy all 5 at once**:

1. **Open 5 browser tabs** in Coolify
2. **Create all 5 applications simultaneously**:
   - Tab 1: News (news.blkoutuk.cloud)
   - Tab 2: Events (events.blkoutuk.cloud)
   - Tab 3: IVOR (ivor.blkoutuk.cloud)
   - Tab 4: Comms (comms.blkoutuk.cloud)
   - Tab 5: CRM (crm.blkoutuk.cloud)

3. **Configure each** (5 minutes):
   - Connect GitHub repos (from table above)
   - Set domains
   - Add environment variables (same for all except IVOR)

4. **Click "Deploy" on all 5** (simultaneously!)

5. **Wait 5-10 minutes** for all builds to complete

6. **Check health dashboard**:
   ```
   Should see 3/7 → 4/7 → 5/7 → 6/7 → 7/7
   As each service comes online!
   ```

---

## 📋 Deployment Checklist (Quick Reference)

### Pre-Deployment (DONE ✅)
- [x] All 5 services found locally
- [x] All 5 have Dockerfiles
- [x] All 5 have GitHub repositories
- [x] All 5 have package.json

### During Deployment (YOUR TURN)
- [ ] Log into Coolify
- [ ] Create application #1: Newsroom
- [ ] Create application #2: Events
- [ ] Create application #3: IVOR
- [ ] Create application #4: Comms
- [ ] Create application #5: CRM
- [ ] All 5 building successfully

### Post-Deployment (VERIFY)
- [ ] news.blkoutuk.cloud returns 200 OK
- [ ] events.blkoutuk.cloud returns 200 OK
- [ ] ivor.blkoutuk.cloud returns 200 OK
- [ ] comms.blkoutuk.cloud returns 200 OK
- [ ] crm.blkoutuk.cloud returns 200 OK
- [ ] Health dashboard shows 7/7 healthy
- [ ] Export final troubleshooting report
- [ ] Status: APPROVED! 🎉

---

## 🎯 Exact GitHub Repositories

**Copy these into Coolify**:

1. **Newsroom**: `https://github.com/BLKOUTUK/news-blkout`
2. **Events**: `https://github.com/BLKOUTUK/black-qtipoc-events-calendar`
3. **IVOR**: `https://github.com/BLKOUTUK/ivor-core`
4. **Comms**: `https://github.com/blkoutuk/comms-blkout`
5. **CRM**: `https://github.com/BLKOUTUK/blkout-crm`

---

## ⏱️ Timeline

**Setup (15 minutes)**:
- Create 5 Coolify applications
- Connect GitHub repos
- Set domains
- Add environment variables

**Build (10 minutes)**:
- All 5 build in parallel
- Monitor build logs
- Wait for completion

**Verify (5 minutes)**:
- Test each domain
- Check health dashboard
- Export final report

**Total**: **30 minutes to 7/7 healthy status!**

---

## 🔧 Environment Variables Template (For Coolify)

**Copy this into each service** (except IVOR has extras):

```
Variable Name: VITE_SUPABASE_URL
Value: https://bgjengudzfickgomjqmz.supabase.co
Build Time: ✅ Yes

Variable Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTIyNzUsImV4cCI6MjA0ODQ4ODI3NX0.ZGVudWlhDWWsczN0Y0FHQVE5SzlHZGRyM2pqUkpNMDh6RGd1S19BUQ
Build Time: ✅ Yes
```

**For IVOR AI, also add**:
```
Variable Name: GROQ_API_KEY
Value: [your-groq-api-key-here]
Build Time: ✅ Yes
```

---

## 🎯 What Happens After Deployment

### Expected Health Dashboard Status

**Services Tab (Overview)**:
```
✅ Main Website - 39ms - HEALTHY
✅ Blog/Voices - 67ms - HEALTHY
✅ Newsroom - XXms - HEALTHY (NEW!)
✅ Events Calendar - XXms - HEALTHY (NEW!)
✅ IVOR AI - XXms - HEALTHY (NEW!)
✅ Comms Dashboard - XXms - HEALTHY (NEW!)
✅ CRM - XXms - HEALTHY (NEW!)

Status: 7/7 Services Healthy (100%)
```

**Checklist Tab**:
```
Overall Status: APPROVED ✅
Passed: 16-17/17 (94-100%)
Failed: 0/17
Critical Blockers: 0
```

---

## 💡 Pro Tips

**Tip 1: Deploy in Priority Order**
- Start with Newsroom (has 125 articles ready)
- Then Events (has 96 pending items)
- Then IVOR, Comms, CRM

**Tip 2: Watch Build Logs**
- If a build fails, check logs for errors
- Common issues: missing env vars, TypeScript errors
- Fix and redeploy

**Tip 3: Use Health Dashboard**
- Refresh after each deployment
- Watch services turn green
- Export reports to track progress

**Tip 4: DNS Patience**
- New domains may take 5-10 minutes to resolve
- If service returns "connection refused", wait a bit
- DNS propagation can take up to 1 hour

---

## 📞 Ready to Deploy?

**You have 3 options**:

**Option A: Guided Sequential** (Safest)
- I'll guide you through deploying Newsroom first
- Test and verify
- Then move to next service

**Option B: Parallel All-at-Once** (Fastest)
- Set up all 5 in Coolify now
- Deploy simultaneously
- Check health dashboard in 15 minutes

**Option C: Just Newsroom + Events** (Quick Win)
- Deploy the 2 high-priority services
- Defer IVOR/Comms/CRM for later
- Get to 4/7 healthy status

Which approach would you like? I can provide exact Coolify UI instructions for whichever you choose! 🚀