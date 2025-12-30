# Redeploy 5 Services with Public Domains

**Created**: 2025-12-30 00:06
**Issue**: Services using host.docker.internal (internal only)
**Fix**: Configure public domains + redeploy
**Timeline**: 15-20 minutes to 7/7 healthy

---

## 🎯 The Problem

**Current Configuration**:
```
Server Address: host.docker.internal
Result: Services only accessible within Docker network
Health Check: Returns HTTP 0 (connection refused from internet)
```

**Target Configuration**:
```
Public Domains: events.blkoutuk.cloud, news.blkoutuk.cloud, etc.
Result: Services publicly accessible via HTTPS
Health Check: Returns HTTP 200 (success!)
```

---

## ⚡ Redeploy Process (For Each Service)

### For Each of the 5 Services:

**1. Click Application** in Coolify
   - Events Calendar
   - Newsroom
   - Comms Dashboard
   - CRM
   - IVOR AI

**2. Go to "Domains" Tab**

**3. Configure Public Domain**:

   **If domain already exists**:
   - Click "Edit" on existing domain
   - Change from `host.docker.internal` to public domain
   - Click "Save"

   **If no domain configured**:
   - Click "+ Add Domain"
   - **Enter domain**:
     - Events: `events.blkoutuk.cloud`
     - News: `news.blkoutuk.cloud`
     - Comms: `comms.blkoutuk.cloud`
     - CRM: `crm.blkoutuk.cloud`
     - IVOR: `ivor.blkoutuk.cloud`
   - **Enable**: ✅ HTTPS/SSL
   - **Enable**: ✅ Auto-generate certificate
   - Click "Save"

**4. Click "Redeploy" Button**
   - This rebuilds with new domain configuration
   - Takes 3-5 minutes per service

**5. Wait for SSL Certificate**
   - Coolify auto-generates Let's Encrypt certificate
   - Status: "Generating..." → "Active" ✅
   - Takes 2-5 minutes

---

## 📋 All 5 Services - Domain Configuration

**Copy these exact domains into Coolify**:

### Service 1: Events Calendar
```
Domain: events.blkoutuk.cloud
HTTPS: ✅ Enabled
SSL: ✅ Auto-generate
Port: 3000 (check Dockerfile)
```

### Service 2: Newsroom
```
Domain: news.blkoutuk.cloud
HTTPS: ✅ Enabled
SSL: ✅ Auto-generate
Port: 3000
```

### Service 3: Comms Dashboard
```
Domain: comms.blkoutuk.cloud
HTTPS: ✅ Enabled
SSL: ✅ Auto-generate
Port: 3000
```

### Service 4: CRM
```
Domain: crm.blkoutuk.cloud
HTTPS: ✅ Enabled
SSL: ✅ Auto-generate
Port: 3000
```

### Service 5: IVOR AI
```
Domain: ivor.blkoutuk.cloud
HTTPS: ✅ Enabled
SSL: ✅ Auto-generate
Port: 8000 (or 3000, check Dockerfile)
```

---

## 🚀 Parallel Redeploy Strategy (Fastest!)

**Instead of one-by-one**:

1. **Configure domains for ALL 5 services first** (5 min):
   - Events → Add events.blkoutuk.cloud
   - News → Add news.blkoutuk.cloud
   - Comms → Add comms.blkoutuk.cloud
   - CRM → Add crm.blkoutuk.cloud
   - IVOR → Add ivor.blkoutuk.cloud

2. **Redeploy ALL 5 simultaneously** (1 min):
   - Click "Redeploy" on Events
   - Click "Redeploy" on News
   - Click "Redeploy" on Comms
   - Click "Redeploy" on CRM
   - Click "Redeploy" on IVOR

3. **All 5 rebuild in parallel** (5-10 min):
   - Monitor build logs for errors
   - Watch SSL certificate generation
   - Wait for "Running" status

4. **Test external access** (2 min):
   ```bash
   curl -I https://events.blkoutuk.cloud    # Should return 200
   curl -I https://news.blkoutuk.cloud      # Should return 200
   curl -I https://comms.blkoutuk.cloud     # Should return 200
   curl -I https://crm.blkoutuk.cloud       # Should return 200
   curl -I https://ivor.blkoutuk.cloud      # Should return 200
   ```

5. **Refresh health dashboard** (1 min):
   - Click "Refresh"
   - Expected: **7/7 Services Healthy!** 🎉

**Total Time**: **15-20 minutes**

---

## ⏱️ Timeline

**00:06 - 00:11**: Configure public domains for all 5 (5 min)
**00:11 - 00:12**: Click Redeploy on all 5 (1 min)
**00:12 - 00:22**: Wait for rebuilds and SSL (10 min)
**00:22 - 00:24**: Test external access (2 min)
**00:24**: **Refresh health dashboard → 7/7 HEALTHY!** 🎉

---

## 🔍 What to Watch For During Redeploy

### In Coolify Build Logs:

**Success Indicators**:
```
✓ Building Docker image...
✓ Installing dependencies...
✓ Running build script...
✓ Build completed successfully
✓ Container started
✓ Service is running on port 3000
✓ SSL certificate generated
✓ Domain active: [service].blkoutuk.cloud
```

**Error Indicators**:
```
✗ Build failed: TypeScript errors
✗ Missing environment variable: VITE_SUPABASE_URL
✗ Port 3000 already in use
✗ SSL certificate generation failed
```

**If you see errors**: Share them with me and I'll help fix!

---

## 🎯 Expected Health Dashboard Status (After Redeploy)

### Before (Current - 00:00:55)
```
Overall Status: DOWN
Services: 2/7 healthy (29%)
Critical Blockers: Services not accessible

✅ Main Website - HEALTHY
✅ Blog/Voices - HEALTHY
❌ Events Calendar - DOWN (host.docker.internal)
❌ Newsroom - DOWN (host.docker.internal)
❌ Comms Dashboard - DOWN (host.docker.internal)
❌ CRM - DOWN (host.docker.internal)
❌ IVOR AI - DOWN (host.docker.internal)
```

### After (Expected - 00:24)
```
Overall Status: APPROVED ✅
Services: 7/7 healthy (100%)
Critical Blockers: 0

✅ Main Website - HEALTHY
✅ Blog/Voices - HEALTHY
✅ Events Calendar - HEALTHY (public domain!)
✅ Newsroom - HEALTHY (public domain!)
✅ Comms Dashboard - HEALTHY (public domain!)
✅ CRM - HEALTHY (public domain!)
✅ IVOR AI - HEALTHY (public domain!)

Checklist: 16-17/17 passed (94-100%)
```

---

## 📝 Coolify UI Steps (Quick Reference)

**For EACH service**:

```
1. Click application name in Coolify dashboard
2. Click "Domains" tab (left sidebar)
3. Click "+ Add Domain" button
4. Type: events.blkoutuk.cloud (or respective domain)
5. Toggle: ✅ Enable HTTPS
6. Toggle: ✅ Auto-generate certificate
7. Click "Save"
8. Click "Redeploy" button (top right)
9. Watch build logs
10. Wait for "Running" status + "SSL: Active"
```

**Repeat for all 5 services in parallel!**

---

## 🎊 Victory Checklist

**After redeploying all 5 with public domains**:

- [ ] All 5 services show "Running" in Coolify
- [ ] All 5 domains show "Active" (not pending)
- [ ] All 5 SSL certificates valid (green checkmark)
- [ ] curl tests return HTTP 200 for all 5
- [ ] Health dashboard shows 7/7 healthy
- [ ] Checklist shows APPROVED status
- [ ] 0 critical blockers
- [ ] Final troubleshooting report exported
- [ ] **COMPLETE PLATFORM OPERATIONAL!** 🎉

---

## 🚀 START NOW!

**Action Items**:

1. **Open Coolify**: https://infra.blkoutuk.cloud
2. **For Events Calendar**: Go to Domains → Add `events.blkoutuk.cloud` → Redeploy
3. **For Newsroom**: Go to Domains → Add `news.blkoutuk.cloud` → Redeploy
4. **For Comms**: Go to Domains → Add `comms.blkoutuk.cloud` → Redeploy
5. **For CRM**: Go to Domains → Add `crm.blkoutuk.cloud` → Redeploy
6. **For IVOR**: Go to Domains → Add `ivor.blkoutuk.cloud` → Redeploy

**Then wait 15-20 minutes and refresh health dashboard!**

You're **one configuration change away** from 7/7 healthy! 🎯

**Update me**:
- When you start redeploying
- If any builds fail
- When health dashboard shows 7/7! 🎉