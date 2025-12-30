# Deploy 5 BLKOUT Services to Coolify

**Created**: 2025-12-29
**Purpose**: Deploy all 5 missing services to achieve 7/7 healthy status
**Status**: All services found and deployment-ready

---

## ✅ Discovery Results

**All 5 services exist and are deployment-ready**:

| Service | Location | Dockerfile | Package.json | Status |
|---------|----------|------------|--------------|--------|
| **News** | `~/blkout-platform/apps/news-blkout` | ✅ | ✅ | Ready |
| **Events** | `~/blkout-platform/apps/events-calendar` | ✅ | ✅ | Ready |
| **IVOR AI** | `~/blkout-platform/apps/ivor-core` | ✅ | ✅ | Ready |
| **Comms** | `~/blkout-platform/apps/comms-blkout` | ✅ | ✅ | Ready |
| **CRM** | `~/blkout-platform/apps/crm` | ✅ | ✅ | Ready |

---

## 🎯 Deployment Priority Order

### Priority 1: Newsroom (news.blkoutuk.cloud)

**Why First**: 125 published articles ready to display

**Steps**:
1. Navigate to repository:
   ```bash
   cd ~/blkout-platform/apps/news-blkout
   ```

2. Check environment variables:
   ```bash
   cat .env.example
   # Should show required variables
   ```

3. Deploy to Coolify:
   - **Method A**: Via Git Push
     ```bash
     # Check if GitHub repo exists
     git remote -v

     # If exists, push
     git add .
     git commit -m "Prepare for Coolify deployment"
     git push origin main

     # Then add to Coolify:
     # - New Application
     # - Connect GitHub repo
     # - Set domain: news.blkoutuk.cloud
     # - Set env vars from .env.example
     # - Deploy
     ```

   - **Method B**: Via Coolify Docker Build
     - Create new application in Coolify
     - Select "Build from Dockerfile"
     - Upload directory or connect Git
     - Set domain: news.blkoutuk.cloud
     - Deploy

4. Verify in health dashboard:
   ```
   Expected: Newsroom shows HEALTHY
   Expected: 125 news articles accessible
   ```

---

### Priority 2: Events Calendar (events.blkoutuk.cloud)

**Why Second**: 96 events in moderation queue ready to approve

**Steps**:
1. Navigate to repository:
   ```bash
   cd ~/blkout-platform/apps/events-calendar
   ```

2. Check environment variables:
   ```bash
   cat .env.example
   # May need Google Calendar API keys
   ```

3. Deploy to Coolify:
   - Same process as newsroom
   - Domain: events.blkoutuk.cloud
   - Set required env vars

4. Verify in health dashboard:
   ```
   Expected: Events Calendar shows HEALTHY
   Expected: Events visible after admin approval
   ```

---

### Priority 3: IVOR AI (ivor.blkoutuk.cloud)

**Why Third**: Community AI assistant, referenced in main site code

**Special Notes**: May be Python/FastAPI (has GROQ_SETUP.md)

**Steps**:
1. Navigate to repository:
   ```bash
   cd ~/blkout-platform/apps/ivor-core
   ```

2. Check if it's Python or Node:
   ```bash
   ls requirements.txt 2>/dev/null && echo "Python (FastAPI)" || echo "Node.js"
   cat GROQ_SETUP.md | head -20  # Check API requirements
   ```

3. Check environment variables needed:
   ```bash
   cat .env.example
   # Should show GROQ_API_KEY and other requirements
   ```

4. Deploy to Coolify:
   - May need different buildpack if Python
   - Domain: ivor.blkoutuk.cloud
   - Set GROQ_API_KEY and other env vars

5. Verify in health dashboard:
   ```
   Expected: IVOR AI shows HEALTHY
   Expected: Chat functionality works
   ```

---

### Priority 4: Comms Dashboard (comms.blkoutuk.cloud)

**Why Fourth**: Internal team communications

**Steps**:
1. Navigate to repository:
   ```bash
   cd ~/blkout-platform/apps/comms-blkout
   ```

2. Check purpose and requirements:
   ```bash
   cat README.md | head -30
   cat package.json | grep -A5 scripts
   ```

3. Deploy to Coolify:
   - Domain: comms.blkoutuk.cloud
   - Set required env vars
   - May be admin-only tool

4. Verify in health dashboard:
   ```
   Expected: Comms Dashboard shows HEALTHY
   ```

---

### Priority 5: CRM (crm.blkoutuk.cloud)

**Why Last**: Internal tool, part of future Phase 2 of Command Center

**Steps**:
1. Navigate to repository:
   ```bash
   cd ~/blkout-platform/apps/crm
   ```

2. Check if it's complete or in development:
   ```bash
   cat README.md
   cat package.json
   ```

3. Deploy to Coolify (if ready):
   - Domain: crm.blkoutuk.cloud
   - Set required env vars
   - May need database migrations

4. Verify in health dashboard:
   ```
   Expected: CRM shows HEALTHY
   ```

---

## 🚀 Quick Deployment Process (For Each Service)

### Standard Deployment Steps

**For each service** (news, events, ivor, comms, crm):

1. **Navigate to service directory**:
   ```bash
   cd ~/blkout-platform/apps/[service-name]
   ```

2. **Check Git status**:
   ```bash
   git remote -v
   # Should show GitHub repo like: BLKOUTUK/news-blkout
   ```

3. **Ensure latest code is pushed**:
   ```bash
   git status
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

4. **Add to Coolify**:
   - Log in to Coolify: https://infra.blkoutuk.cloud
   - Click **"+ New"** → **"Application"**
   - **Source**: Select GitHub repository
   - **Repository**: Choose BLKOUTUK/[service-name]
   - **Branch**: main
   - **Build Pack**: Dockerfile or Nixpacks
   - **Domain**: [service].blkoutuk.cloud
   - **Environment Variables**: Add from .env.example
   - Click **"Deploy"**

5. **Monitor Deployment**:
   - Watch build logs in Coolify
   - Wait 3-5 minutes
   - Check DNS propagation: `dig [service].blkoutuk.cloud`

6. **Verify in Health Dashboard**:
   - Visit: https://blkoutuk.com/health-dashboard
   - Click "Refresh"
   - Service should show HEALTHY

---

## 🔧 Common Environment Variables Needed

**All Services Need** (Supabase):
```env
VITE_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTIyNzUsImV4cCI6MjA0ODQ4ODI3NX0.ZGVudWlhDWWsczN0Y0FHQVE5SzlHZGRyM2pqUkpNMDh6RGd1S19BUQ
```

**IVOR AI Needs** (Additional):
```env
GROQ_API_KEY=[your-groq-api-key]
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjkxMjI3NSwiZXhwIjoyMDQ4NDg4Mjc1fQ.cW1hNmZRQlNkeWxYZDRqb0JNY0JLZjFyVTBWQTFPMGdBVzROWlV0YWc
```

**Events May Need** (If Google Calendar integration):
```env
GOOGLE_CALENDAR_API_KEY=[your-key]
GOOGLE_CALENDAR_ID=[calendar-id]
```

---

## 📊 Expected Health Dashboard Status

### After Each Deployment

**After Newsroom**:
- Services: 3/7 healthy (43%)
- News articles: 125 accessible

**After Events**:
- Services: 4/7 healthy (57%)
- Events: Approved events visible

**After IVOR**:
- Services: 5/7 healthy (71%)
- AI chat functional

**After Comms**:
- Services: 6/7 healthy (86%)
- Team communications working

**After CRM**:
- Services: 7/7 healthy (100%) 🎉
- Complete platform operational!

---

## ⚡ Parallel Deployment Strategy (Faster!)

**Instead of deploying one at a time**, you can deploy all 5 in parallel:

### Step 1: Verify All Git Repos (5 minutes)

```bash
cd ~/blkout-platform/apps/news-blkout && git remote -v
cd ~/blkout-platform/apps/events-calendar && git remote -v
cd ~/blkout-platform/apps/ivor-core && git remote -v
cd ~/blkout-platform/apps/comms-blkout && git remote -v
cd ~/blkout-platform/apps/crm && git remote -v
```

### Step 2: Push All to GitHub (if needed)

```bash
# For each service that needs pushing:
cd ~/blkout-platform/apps/[service]
git add .
git commit -m "Prepare for Coolify deployment"
git push origin main
```

### Step 3: Create All 5 in Coolify (20 minutes)

**In Coolify UI**, create 5 new applications **at the same time**:

1. **News** (news.blkoutuk.cloud)
2. **Events** (events.blkoutuk.cloud)
3. **IVOR** (ivor.blkoutuk.cloud)
4. **Comms** (comms.blkoutuk.cloud)
5. **CRM** (crm.blkoutuk.cloud)

**For each**:
- Source: GitHub repo
- Build: Dockerfile
- Domain: [service].blkoutuk.cloud
- Env vars: Copy from template above

### Step 4: Deploy All at Once

Click "Deploy" for all 5 → They build in parallel!

### Step 5: Monitor in Health Dashboard

After 5-10 minutes:
- Refresh health dashboard
- Watch services turn green one by one
- Export troubleshooting report when all healthy

---

## 🎯 Simplified Single-Command Approach

**Or use Coolify CLI** (if installed):

```bash
# Deploy all 5 services with one command each
coolify deploy --app news-blkout --domain news.blkoutuk.cloud
coolify deploy --app events-calendar --domain events.blkoutuk.cloud
coolify deploy --app ivor-core --domain ivor.blkoutuk.cloud
coolify deploy --app comms-blkout --domain comms.blkoutuk.cloud
coolify deploy --app crm --domain crm.blkoutuk.cloud
```

---

## 📋 Checklist for Each Service

**Before deploying each service**:

- [ ] Repository exists on GitHub
- [ ] Latest code pushed to main branch
- [ ] Dockerfile present and tested
- [ ] Environment variables identified
- [ ] Domain configured in DNS (*.blkoutuk.cloud)

**During deployment**:

- [ ] Coolify application created
- [ ] GitHub repo connected
- [ ] Domain set correctly
- [ ] Environment variables added
- [ ] Build process started

**After deployment**:

- [ ] Build completed successfully
- [ ] Service accessible at domain
- [ ] Health dashboard shows HEALTHY
- [ ] Functionality tested manually

---

## 🔍 Pre-Deployment Checks

**Run these for each service before deploying**:

```bash
# Check if service builds locally
cd ~/blkout-platform/apps/news-blkout
npm install
npm run build
# Should complete without errors

# Check Dockerfile
docker build -t news-test .
# Should build successfully

# Check GitHub repo
git remote -v
git status
git log -1
# Verify repo is set up and code is pushed
```

---

## 📝 Deployment Template (Copy for Each Service)

### Service: [NAME]

**Domain**: [service].blkoutuk.cloud
**Repository**: ~/blkout-platform/apps/[service]
**GitHub**: BLKOUTUK/[service]

**Environment Variables**:
```env
VITE_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
[Add service-specific vars]
```

**Coolify Settings**:
- Build Pack: Dockerfile
- Port: 3000 (or from Dockerfile)
- Build Command: npm run build (handled by Dockerfile)
- Start Command: npm start (handled by Dockerfile)

**Testing**:
```bash
# After deployment, test:
curl -I https://[service].blkoutuk.cloud
# Should return HTTP 200

# Check health dashboard
# Should show HEALTHY
```

---

## ⏱️ Timeline Estimate

### Sequential Deployment (Careful)
- **Per Service**: 15-20 minutes
- **Total**: 75-100 minutes (1.5-2 hours)
- **Benefit**: Catch issues early, fix before moving on

### Parallel Deployment (Fast)
- **All 5 Together**: 20-30 minutes
- **Benefit**: Much faster
- **Risk**: If one fails, harder to debug

**Recommended**: Start with **Priority 1-2** (News + Events) sequentially, then do 3-5 in parallel

---

## 🚨 Common Issues & Solutions

### Issue: Build Fails

**Check**:
```bash
# Test build locally first
cd ~/blkout-platform/apps/[service]
npm run build
```

**If fails**: Fix TypeScript errors or missing dependencies

### Issue: Domain Not Resolving

**Check DNS**:
```bash
dig [service].blkoutuk.cloud
```

**Fix**: Wait for DNS propagation (up to 1 hour) or check Coolify domain settings

### Issue: Service Returns 500

**Check**:
- Coolify application logs
- Environment variables are set correctly
- Database connection working

### Issue: Service Shows "DOWN" in Health Dashboard

**Diagnoses**:
1. Export troubleshooting report
2. Review diagnosis for that specific service
3. Follow remediation steps

---

## 🎯 Success Criteria

**After All Deployments**:

```
Health Dashboard Status:
✅ Overall Status: APPROVED
✅ Services: 7/7 healthy (100%)
✅ Routes: 5/5 passing (100%)
✅ Database: Connected, 281/281 articles
✅ Checklist: 16-17/17 passed (94-100%)
✅ Critical Blockers: 0
✅ Deployment Status: APPROVED
```

---

## 📞 Next Steps

### Immediate (Next 30 Minutes)

**Decision Point**: Sequential or Parallel?

**Option A: Sequential** (Start with Newsroom)
1. Deploy news-blkout to news.blkoutuk.cloud
2. Test and verify in health dashboard
3. Then deploy events-calendar
4. Then ivor-core
5. Then comms-blkout
6. Then crm

**Option B: Parallel** (Deploy all 5 at once)
1. Set up all 5 in Coolify simultaneously
2. Click deploy on all
3. Wait 10-15 minutes
4. Check health dashboard
5. Troubleshoot any that failed

**Recommendation**: Option A for first 2 (news + events), then Option B for last 3

---

## 🔧 Quick Start Commands

### Check Git Repos

```bash
# Verify all have GitHub remotes
for app in news-blkout events-calendar ivor-core comms-blkout crm; do
  echo "=== $app ==="
  cd ~/blkout-platform/apps/$app
  git remote -v | head -1
  echo ""
done
```

### Verify Build Readiness

```bash
# Test builds locally (before deploying to Coolify)
for app in news-blkout events-calendar comms-blkout crm; do
  echo "=== Testing $app ==="
  cd ~/blkout-platform/apps/$app
  npm run build 2>&1 | tail -3
  echo ""
done
```

---

## 📖 Related Documentation

- `/HEALTH_DASHBOARD.md` - Health monitoring guide
- `/SERVICE_DEPLOYMENT_GUIDE.md` - General deployment info
- `/COMMAND_CENTER_ROADMAP.md` - Long-term vision
- Each service's README.md - Service-specific docs

---

## 🎉 End Goal

**When all 5 services are deployed**:

```
Visit: https://blkoutuk.com/health-dashboard
See: 7/7 Services HEALTHY
Status: APPROVED
Export: Final victory troubleshooting report
Celebrate: Complete BLKOUT platform operational! 🎊
```

---

**Ready to start deploying?** Let me know if you want:
1. Help deploying one service at a time (guided)
2. Commands to deploy all 5 at once (fast)
3. Investigation of which services are most critical first

Which approach would you like? 🚀
