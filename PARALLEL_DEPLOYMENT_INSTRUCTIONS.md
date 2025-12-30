# Deploy All 5 BLKOUT Services - Parallel Deployment Guide

**Created**: 2025-12-29 21:15
**Timeline**: 30 minutes to 7/7 healthy status
**Strategy**: Deploy all 5 simultaneously in Coolify

---

## 🎯 Goal

Deploy 5 services in parallel to achieve **7/7 healthy status** in health dashboard.

**Current**: 2/7 healthy (Main Website, Blog/Voices)
**Target**: 7/7 healthy (All services operational)

---

## 📋 Pre-Deployment Checklist

### Ready to Deploy ✅

- [x] All 5 GitHub repositories identified
- [x] All 5 have Dockerfiles
- [x] Environment variables prepared
- [x] Coolify account access: https://infra.blkoutuk.cloud
- [x] Health dashboard ready to monitor: https://blkoutuk.com/health-dashboard

---

## 🚀 Parallel Deployment Steps

### PHASE 1: Setup All 5 Applications (15 minutes)

**Open 5 browser tabs** or do them one after another - just don't click "Deploy" until all 5 are configured!

---

#### Application #1: Newsroom

**Coolify UI Steps**:

1. **Create Application**:
   - Click **"+ New"** → **"Application"**

2. **Source**:
   - Type: **GitHub**
   - Organization: **BLKOUTUK**
   - Repository: **news-blkout**
   - Branch: **main**

3. **Build Settings**:
   - Build Pack: **Dockerfile**
   - Port: **3000** (auto-detected)

4. **Domain**:
   - Domain: **news.blkoutuk.cloud**
   - HTTPS: ✅ (auto-enabled)

5. **Environment Variables**:
   - Click **"+ Add Variable"**

   **Variable 1**:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://bgjengudzfickgomjqmz.supabase.co`
   - Build Time: ✅ Yes

   **Variable 2**:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTIyNzUsImV4cCI6MjA0ODQ4ODI3NX0.ZGVudWlhDWWsczN0Y0FHQVE5SzlHZGRyM2pqUkpNMDh6RGd1S19BUQ`
   - Build Time: ✅ Yes

6. **Save** (don't deploy yet!)

---

#### Application #2: Events Calendar

**Coolify UI Steps**:

1. **Create Application**:
   - Click **"+ New"** → **"Application"**

2. **Source**:
   - Type: **GitHub**
   - Organization: **BLKOUTUK**
   - Repository: **black-qtipoc-events-calendar**
   - Branch: **main**

3. **Build Settings**:
   - Build Pack: **Dockerfile**
   - Port: **3000**

4. **Domain**:
   - Domain: **events.blkoutuk.cloud**

5. **Environment Variables**:

   **Variable 1**:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://bgjengudzfickgomjqmz.supabase.co`
   - Build Time: ✅

   **Variable 2**:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTIyNzUsImV4cCI6MjA0ODQ4ODI3NX0.ZGVudWlhDWWsczN0Y0FHQVE5SzlHZGRyM2pqUkpNMDh6RGd1S19BUQ`
   - Build Time: ✅

6. **Save** (don't deploy yet!)

---

#### Application #3: IVOR AI

**Coolify UI Steps**:

1. **Create Application**:
   - Click **"+ New"** → **"Application"**

2. **Source**:
   - Type: **GitHub**
   - Organization: **BLKOUTUK**
   - Repository: **ivor-core**
   - Branch: **main**

3. **Build Settings**:
   - Build Pack: **Dockerfile**
   - Port: **8000** (likely FastAPI - check Dockerfile)

4. **Domain**:
   - Domain: **ivor.blkoutuk.cloud**

5. **Environment Variables**:

   **Variable 1**:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://bgjengudzfickgomjqmz.supabase.co`
   - Build Time: ✅

   **Variable 2**:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTIyNzUsImV4cCI6MjA0ODQ4ODI3NX0.ZGVudWlhDWWsczN0Y0FHQVE5SzlHZGRyM2pqUkpNMDh6RGd1S19BUQ`
   - Build Time: ✅

   **Variable 3**:
   - Name: `VITE_SUPABASE_SERVICE_ROLE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjkxMjI3NSwiZXhwIjoyMDQ4NDg4Mjc1fQ.cW1hNmZRQlNkeWxYZDRqb0JNY0JLZjFyVTBWQTFPMGdBVzROWlV0YWc`
   - Build Time: ✅

   **Variable 4** (IMPORTANT - IVOR needs GROQ API):
   - Name: `GROQ_API_KEY`
   - Value: **[You need to provide this - check ~/blkout-platform/apps/ivor-core/.env or GROQ_SETUP.md]**
   - Build Time: ✅

6. **Save** (don't deploy yet!)

---

#### Application #4: Comms Dashboard

**Coolify UI Steps**:

1. **Create Application**:
   - Click **"+ New"** → **"Application"**

2. **Source**:
   - Type: **GitHub**
   - Organization: **blkoutuk** (lowercase!)
   - Repository: **comms-blkout**
   - Branch: **main**

3. **Build Settings**:
   - Build Pack: **Dockerfile**
   - Port: **3000**

4. **Domain**:
   - Domain: **comms.blkoutuk.cloud**

5. **Environment Variables**:

   **Variable 1**:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://bgjengudzfickgomjqmz.supabase.co`
   - Build Time: ✅

   **Variable 2**:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTIyNzUsImV4cCI6MjA0ODQ4ODI3NX0.ZGVudWlhDWWsczN0Y0FHQVE5SzlHZGRyM2pqUkpNMDh6RGd1S19BUQ`
   - Build Time: ✅

6. **Save** (don't deploy yet!)

---

#### Application #5: CRM

**Coolify UI Steps**:

1. **Create Application**:
   - Click **"+ New"** → **"Application"**

2. **Source**:
   - Type: **GitHub**
   - Organization: **BLKOUTUK**
   - Repository: **blkout-crm**
   - Branch: **main**

3. **Build Settings**:
   - Build Pack: **Dockerfile**
   - Port: **3000**

4. **Domain**:
   - Domain: **crm.blkoutuk.cloud**

5. **Environment Variables**:

   **Variable 1**:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://bgjengudzfickgomjqmz.supabase.co`
   - Build Time: ✅

   **Variable 2**:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTIyNzUsImV4cCI6MjA0ODQ4ODI3NX0.ZGVudWlhDWWsczN0Y0FHQVE5SzlHZGRyM2pqUkpNMDh6RGd1S19BUQ`
   - Build Time: ✅

6. **Save** (don't deploy yet!)

---

### PHASE 2: Deploy All 5 Simultaneously! (2 minutes)

**Once all 5 applications are created and configured**:

1. **Go to Coolify dashboard** - you should see all 5 applications listed
2. **For each application**, click **"Deploy"** button
3. **Deploy in this order** (quick succession):
   - Click Deploy on **Newsroom**
   - Click Deploy on **Events**
   - Click Deploy on **IVOR**
   - Click Deploy on **Comms**
   - Click Deploy on **CRM**

4. **All 5 will build in parallel!**

---

### PHASE 3: Monitor Progress (10-15 minutes)

**Watch the builds**:

1. **In Coolify**, you'll see build logs for each service
2. **Look for**:
   - ✅ "Build successful"
   - ✅ "Container started"
   - ✅ "Service is running"
3. **Common build time**: 3-5 minutes per service
4. **All should complete** within 10-15 minutes

**What to watch for**:
- ❌ Build errors (TypeScript, missing deps)
- ❌ Port conflicts
- ❌ Missing environment variables
- ✅ Successful deployments

---

### PHASE 4: Verify All Services (5 minutes)

**After builds complete** (21:30-21:35):

#### Test Each Service Manually

```bash
# Quick curl test for all 5
curl -I https://news.blkoutuk.cloud
curl -I https://events.blkoutuk.cloud
curl -I https://ivor.blkoutuk.cloud
curl -I https://comms.blkoutuk.cloud
curl -I https://crm.blkoutuk.cloud

# All should return: HTTP/2 200
```

#### Check Health Dashboard

1. **Visit**: https://blkoutuk.com/health-dashboard
2. **Click**: "Refresh" button
3. **Watch services turn green**:
   - ✅ Main Website (already green)
   - ✅ Blog/Voices (already green)
   - 🟡 Newsroom (should turn green!)
   - 🟡 Events Calendar (should turn green!)
   - 🟡 IVOR AI (should turn green!)
   - 🟡 Comms Dashboard (should turn green!)
   - 🟡 CRM (should turn green!)

4. **Expected Result**: **7/7 Services Healthy!** 🎉

#### Export Victory Report

1. **Click**: "Troubleshooting Report" button
2. **Save as**: `blkout-troubleshooting-7-OF-7-HEALTHY.md`
3. **Expected content**:
   ```
   Overall Status: APPROVED ✅
   Services: 7/7 healthy (100%)
   Routes: 5/5 passing (100%)
   Database: 281/281 articles
   Mock Data: [Status after SQL cleanup]
   Checklist: 15-16/17 passed
   Critical Blockers: 0 or 1 (just mock data if not cleaned)
   ```

---

## 📝 Quick Reference: GitHub Repositories

**Copy these into Coolify** (Source → Repository field):

1. **Newsroom**: `BLKOUTUK/news-blkout`
2. **Events**: `BLKOUTUK/black-qtipoc-events-calendar`
3. **IVOR AI**: `BLKOUTUK/ivor-core`
4. **Comms**: `blkoutuk/comms-blkout` (lowercase org!)
5. **CRM**: `BLKOUTUK/blkout-crm`

---

## 📝 Quick Reference: Domains

1. **Newsroom**: `news.blkoutuk.cloud`
2. **Events**: `events.blkoutuk.cloud`
3. **IVOR AI**: `ivor.blkoutuk.cloud`
4. **Comms**: `comms.blkoutuk.cloud`
5. **CRM**: `crm.blkoutuk.cloud`

---

## 📝 Quick Reference: Environment Variables

**Copy-Paste Template** (Use for all 5 services):

```
VITE_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTIyNzUsImV4cCI6MjA0ODQ4ODI3NX0.ZGVudWlhDWWsczN0Y0FHQVE5SzlHZGRyM2pqUkpNMDh6RGd1S19BUQ
```

**IMPORTANT**: Mark both as **"Available at build time" ✅**

**For IVOR ONLY, add this third variable**:
```
GROQ_API_KEY=[your-groq-api-key]
```

**To find your GROQ API key**:
```bash
# Check IVOR's environment file
cat ~/blkout-platform/apps/ivor-core/.env 2>/dev/null | grep GROQ

# Or check GROQ_SETUP.md
cat ~/blkout-platform/apps/ivor-core/GROQ_SETUP.md | grep -A5 "API"
```

---

## ⏱️ Timeline

**21:15 - 21:30**: Setup all 5 applications in Coolify (15 min)
**21:30 - 21:45**: All 5 build in parallel (10-15 min)
**21:45 - 21:50**: Test and verify (5 min)
**21:50**: **CELEBRATION - 7/7 HEALTHY!** 🎉

---

## 🔧 Troubleshooting During Deployment

### If a Build Fails

**Check Build Logs**:
1. Click on the failed application in Coolify
2. View build logs
3. Look for errors:
   - TypeScript errors → Fix in code, redeploy
   - Missing dependencies → Check package.json
   - Docker errors → Check Dockerfile

**Common Fixes**:
```bash
# If TypeScript errors in a service:
cd ~/blkout-platform/apps/[service]
npm run build
# Fix errors shown
git add .
git commit -m "Fix TypeScript errors"
git push
# Then redeploy in Coolify
```

### If Service Shows "DOWN" After Deployment

**Diagnose**:
1. Check Coolify logs - is container running?
2. Check domain DNS - `dig [service].blkoutuk.cloud`
3. Test directly: `curl https://[service].blkoutuk.cloud`
4. Export troubleshooting report - will show specific diagnosis

**Common Causes**:
- DNS not propagated yet (wait 5-10 minutes)
- Port mismatch (check Dockerfile EXPOSE)
- Environment variables missing (check Coolify settings)

---

## 📊 Progress Tracking

**Use health dashboard to track progress**:

### Expected Progression

**21:30 (After setup, during builds)**:
```
Services: 2/7 healthy
Status: Building...
```

**21:35 (First services complete)**:
```
Services: 3-4/7 healthy
Newsroom: HEALTHY ✅
Events: HEALTHY ✅
```

**21:40 (More services complete)**:
```
Services: 5-6/7 healthy
IVOR: HEALTHY ✅
Comms: HEALTHY ✅
```

**21:45 (All complete)**:
```
Services: 7/7 healthy (100%) 🎉
Overall Status: APPROVED ✅
```

---

## 🎯 Final Verification Checklist

**After all 5 deploy, verify each**:

- [ ] Newsroom accessible: https://news.blkoutuk.cloud
  - [ ] Shows 125 news articles
  - [ ] Health dashboard shows HEALTHY

- [ ] Events accessible: https://events.blkoutuk.cloud
  - [ ] Shows events (after moderation approval)
  - [ ] Health dashboard shows HEALTHY

- [ ] IVOR accessible: https://ivor.blkoutuk.cloud
  - [ ] Chat interface loads
  - [ ] Health dashboard shows HEALTHY

- [ ] Comms accessible: https://comms.blkoutuk.cloud
  - [ ] Dashboard loads
  - [ ] Health dashboard shows HEALTHY

- [ ] CRM accessible: https://crm.blkoutuk.cloud
  - [ ] Interface loads
  - [ ] Health dashboard shows HEALTHY

---

## 🎊 Expected Final State

### Health Dashboard (After All Deployments)

```markdown
# BLKOUT Platform Troubleshooting Report

**Overall Status**: APPROVED ✅
**Services**: 7 healthy, 0 degraded, 0 down
**Database**: Connected, 281/281 articles
**Deployment Status**: APPROVED

## Service Health Details

✅ Main Website - 39ms - HEALTHY
✅ Blog/Voices - 67ms - HEALTHY
✅ Newsroom - XXms - HEALTHY
✅ Events Calendar - XXms - HEALTHY
✅ IVOR AI - XXms - HEALTHY
✅ Comms Dashboard - XXms - HEALTHY
✅ CRM - XXms - HEALTHY

## Pre-Deployment Checklist

**Overall Status**: APPROVED
**Passed**: 16-17/17
**Failed**: 0/17
**Critical Blockers**: 0
```

---

## 🚀 START NOW!

**Action Items** (Right Now):

1. **Open Coolify**: https://infra.blkoutuk.cloud
2. **Find GROQ API Key** (for IVOR):
   ```bash
   cat ~/blkout-platform/apps/ivor-core/.env | grep GROQ
   ```
3. **Start creating** Application #1 (Newsroom)
4. **Create** Applications #2-5
5. **Deploy all 5** when ready!

---

**I'm here to help!** Let me know:
- ✅ When you start deploying (I'll monitor with you)
- ❌ If any builds fail (I'll help troubleshoot)
- 🎉 When all 7 show HEALTHY! (We'll celebrate!)

**Timeline**: You're **30 minutes away** from 7/7 healthy status! 🚀
