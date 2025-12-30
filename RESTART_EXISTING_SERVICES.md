# Restart Existing BLKOUT Services in Coolify

**Created**: 2025-12-29 21:15
**Discovery**: All 5 services already exist in Coolify!
**Action**: Restart or redeploy existing applications (MUCH faster!)

---

## 🎯 Situation

**Services already exist in Coolify** - they just need to be:
- ✅ Started (if stopped)
- ✅ Redeployed (if failed/stale)
- ✅ Environment variables checked (if misconfigured)

**This is MUCH faster than creating new!**

---

## ⚡ Quick Restart Process (10 Minutes Total!)

### Step 1: Check Application Status (2 minutes)

**Log into Coolify**: https://infra.blkoutuk.cloud

**For each service, check status**:

| Service | Expected Name in Coolify | Status to Check |
|---------|-------------------------|-----------------|
| Newsroom | news-blkout or newsroom | ⚪ Stopped / 🔴 Failed / 🟢 Running? |
| Events | events-calendar or events | ⚪ Stopped / 🔴 Failed / 🟢 Running? |
| IVOR | ivor-core or ivor | ⚪ Stopped / 🔴 Failed / 🟢 Running? |
| Comms | comms-blkout or comms | ⚪ Stopped / 🔴 Failed / 🟢 Running? |
| CRM | blkout-crm or crm | ⚪ Stopped / 🔴 Failed / 🟢 Running? |

---

### Step 2: Restart/Redeploy Based on Status (5 minutes)

**For Each Service**:

#### If Status = ⚪ STOPPED

**Action**: Just start it!
1. Click on the application
2. Click **"Start"** button
3. Wait 30 seconds
4. Should show 🟢 Running

**Quick!** This takes seconds, not minutes!

---

#### If Status = 🔴 FAILED or ❌ ERROR

**Action**: Redeploy it!
1. Click on the application
2. Check **"Deployment"** tab for error logs
3. Click **"Redeploy"** or **"Deploy"** button
4. Watch build logs
5. Wait 3-5 minutes for rebuild

**Common Causes**:
- Missing environment variables
- Build failed
- Container crashed

**Quick Fix**:
1. Check **"Environment Variables"** tab
2. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
3. Mark as **"Available at build time" ✅**
4. Click **"Redeploy"**

---

#### If Status = 🟢 RUNNING but Health Check Shows DOWN

**Action**: Check domain/DNS!
1. Service is running but health check can't reach it
2. Check **"Domains"** tab
3. Verify domain is correct: [service].blkoutuk.cloud
4. Check DNS: `dig [service].blkoutuk.cloud`
5. May just need to wait for DNS propagation

**Or Check Port**:
1. Click **"Configuration"** tab
2. Verify port is exposed (usually 3000 or 8000)
3. Match with Dockerfile EXPOSE command

---

### Step 3: Start/Redeploy ALL 5 (Parallel!)

**Instead of doing one at a time**:

1. **Open all 5 applications** in separate tabs
2. **For each stopped service**: Click "Start"
3. **For each failed service**: Click "Redeploy"
4. **Do this for all 5 quickly** (they'll all process in parallel)
5. **Wait 5-10 minutes** for any rebuilds to complete

---

### Step 4: Monitor in Health Dashboard (3 minutes)

**After restarting/redeploying**:

1. **Wait 2-3 minutes** for services to start
2. **Visit**: https://blkoutuk.com/health-dashboard
3. **Click**: "Refresh" button
4. **Watch services turn green**:
   - Services: 2/7 → 3/7 → 4/7 → 5/7 → 6/7 → 7/7 ✅

**Expected timing**:
- Stopped services: Green immediately (30 seconds)
- Redeployed services: Green after build (3-5 minutes each)

---

## 🔧 Quick Fixes for Common Issues

### Issue: Service Won't Start

**Check**:
1. View application logs in Coolify
2. Look for error messages
3. Common causes:
   - Port already in use → Change port
   - Missing env vars → Add them
   - Build failed → Check build logs

**Fix**:
1. Click "Configuration" → Fix issue
2. Click "Redeploy"
3. Watch build logs

---

### Issue: Service Shows "DOWN" After Starting

**Wait First**:
- DNS propagation can take 5-10 minutes
- Health check may fail initially

**Then Check**:
```bash
# Test the service directly
curl -I https://[service].blkoutuk.cloud

# If connection refused: Service not started yet, wait
# If 404: Domain not configured, check Coolify
# If 200: SUCCESS! Health check will catch it soon
```

---

### Issue: Environment Variables Missing

**For each service that fails**:
1. Click application in Coolify
2. Go to **"Environment Variables"** tab
3. **Add if missing**:
   - `VITE_SUPABASE_URL` = `https://bgjengudzfickgomjqmz.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. **Mark as "Build Time" ✅**
5. Click **"Redeploy"**

---

## ⏱️ Optimistic Timeline

**21:15 - 21:20**: Check status of all 5 in Coolify (5 min)
**21:20 - 21:25**: Start/redeploy all 5 (5 min)
**21:25 - 21:30**: Wait for builds/starts (5 min)
**21:30**: Check health dashboard → Expected: **6-7/7 healthy!** 🎉

**Total**: **15 minutes** from now!

---

## 🎯 Action Plan

### Immediate (RIGHT NOW)

1. **Log into Coolify**: https://infra.blkoutuk.cloud
2. **Find these applications**:
   - Look for: news, newsroom, news-blkout
   - Look for: events, events-calendar
   - Look for: ivor, ivor-core
   - Look for: comms, comms-blkout
   - Look for: crm, blkout-crm

3. **For each application, note status**:
   - Is it ⚪ Stopped? → Just click "Start"
   - Is it 🔴 Failed? → Click "Redeploy"
   - Is it 🟢 Running but health check fails? → Check domain/DNS

4. **Start/Redeploy all that aren't running**

5. **Wait 5-10 minutes**

6. **Refresh health dashboard** → Should see services turning green!

---

## 📊 Expected Results

### Before (Current)
```
Services: 2/7 healthy (29%)
- ✅ Main Website
- ✅ Blog/Voices
- ❌ Newsroom (exists but not running)
- ❌ Events (exists but not running)
- ❌ IVOR (exists but not running)
- ❌ Comms (exists but not running)
- ❌ CRM (exists but not running)
```

### After Restart (21:30)
```
Services: 7/7 healthy (100%) 🎉
- ✅ Main Website
- ✅ Blog/Voices
- ✅ Newsroom (restarted!)
- ✅ Events (restarted!)
- ✅ IVOR (restarted!)
- ✅ Comms (restarted!)
- ✅ CRM (restarted!)

Overall Status: APPROVED ✅
```

---

## 💡 Pro Tip: Bulk Actions

**If Coolify supports it**:
- Select all 5 stopped services
- Click "Start All" or "Restart All"
- Even faster!

---

## 🎊 Success Indicators

**You'll know it's working when**:

1. **In Coolify**:
   - All 5 show 🟢 "Running" status
   - No red error indicators
   - Build logs show "Success"

2. **In Terminal** (optional test):
   ```bash
   curl -I https://news.blkoutuk.cloud        # HTTP 200
   curl -I https://events.blkoutuk.cloud      # HTTP 200
   curl -I https://ivor.blkoutuk.cloud        # HTTP 200
   curl -I https://comms.blkoutuk.cloud       # HTTP 200
   curl -I https://crm.blkoutuk.cloud         # HTTP 200
   ```

3. **In Health Dashboard**:
   - Services: 7/7 healthy
   - All service cards green
   - Overall status: APPROVED
   - 0 critical blockers

---

## 🚀 START NOW!

**You're literally 10-15 minutes from 7/7 healthy status!**

Since they already exist:
- ✅ No need to create applications
- ✅ No need to configure from scratch
- ✅ Just start/restart them
- ✅ Much faster than we thought!

**Steps**:
1. Open Coolify
2. Find all 5 applications
3. Check which are stopped
4. Start/restart all 5
5. Wait for them to come online
6. Refresh health dashboard
7. **VICTORY!** 🎉

**Let me know**:
- What status they're showing in Coolify (stopped, failed, or running?)
- I'll help troubleshoot any that won't start
- Or celebrate when all 7 show healthy! 🎊