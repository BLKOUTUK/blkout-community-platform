# Fix Coolify Network Endpoint Configuration

**Created**: 2025-12-30 01:40
**Root Cause**: Network Endpoint set to `host.docker.internal` (internal only)
**Fix**: Change to public exposure or remove to use default
**Impact**: Makes services publicly accessible

---

## 🎯 The Problem - IDENTIFIED!

**Coolify Network Endpoint Setting**: `host.docker.internal`

**What this means**:
- Service bound to internal Docker network only
- NOT exposed to public internet
- Only accessible from within Docker network
- Results in "connection refused" from external health checks

**Why you see blank page**:
- Initial connection succeeds (DNS works)
- But service can't respond properly (network restriction)
- Browser gets partial response or timeout → blank page

---

## ✅ The Fix: Change Network Endpoint

### For EACH of the 5 Services (Events, News, Comms, CRM, IVOR):

**In Coolify**:

1. **Click application** (e.g., Events Calendar)

2. **Go to "Configuration" or "Network" tab**

3. **Find "Network Endpoint" setting**:
   - Current value: `host.docker.internal`

4. **Change to one of these** (depending on Coolify UI options):

   **Option A: Set to Public/External**
   - Change: `host.docker.internal` → `0.0.0.0` (listen on all interfaces)
   - Or select: "Public" or "External" from dropdown
   - This exposes service to internet

   **Option B: Remove/Clear the Setting**
   - Delete the `host.docker.internal` value
   - Leave empty (uses Coolify default)
   - Default is usually public exposure

   **Option C: Set to Server IP**
   - Change to Coolify server's public IP
   - Service binds to public interface

5. **Click "Save"**

6. **Click "Redeploy"** (IMPORTANT - configuration change requires redeploy!)

7. **Wait 3-5 minutes** for rebuild

8. **Test**: `curl -I https://events.blkoutuk.cloud`
   - Should now return **HTTP 200** ✅

---

## 🚀 Parallel Fix for All 5 Services

### Step 1: Update Network Endpoint for All 5 (5 minutes)

**For each service in Coolify**:

**Events Calendar**:
- Configuration/Network tab
- Network Endpoint: `host.docker.internal` → **Remove or set to `0.0.0.0`**
- Save

**Newsroom**:
- Configuration/Network tab
- Network Endpoint: `host.docker.internal` → **Remove or set to `0.0.0.0`**
- Save

**Comms Dashboard**:
- Configuration/Network tab
- Network Endpoint: `host.docker.internal` → **Remove or set to `0.0.0.0`**
- Save

**CRM**:
- Configuration/Network tab
- Network Endpoint: `host.docker.internal` → **Remove or set to `0.0.0.0`**
- Save

**IVOR AI**:
- Configuration/Network tab
- Network Endpoint: `host.docker.internal` → **Remove or set to `0.0.0.0`**
- Save

---

### Step 2: Redeploy All 5 (1 minute)

**After updating all network endpoints**:

- Click **"Redeploy"** on Events
- Click **"Redeploy"** on News
- Click **"Redeploy"** on Comms
- Click **"Redeploy"** on CRM
- Click **"Redeploy"** on IVOR

**All rebuild in parallel!**

---

### Step 3: Wait for Builds (10 minutes)

**Watch for**:
- Build logs show "Success"
- Services show "Running"
- No errors in logs

---

### Step 4: Test External Access (2 minutes)

**After rebuilds complete**:

```bash
curl -I https://events.blkoutuk.cloud    # Should return 200
curl -I https://news.blkoutuk.cloud      # Should return 200
curl -I https://comms.blkoutuk.cloud     # Should return 200
curl -I https://crm.blkoutuk.cloud       # Should return 200
curl -I https://ivor.blkoutuk.cloud      # Should return 200
```

**Or test in browser**:
- Visit each URL
- Should load the service UI (not blank page!)

---

### Step 5: Refresh Health Dashboard (1 minute)

1. Visit: https://blkoutuk.com/health-dashboard
2. Click "Refresh"
3. **Expected**: **7/7 Services Healthy!** 🎉

---

## 🔧 Alternative: Coolify Network Mode

**If "Network Endpoint" setting isn't obvious**, look for:

### "Network Mode" Setting

May have options like:
- **Internal** (host.docker.internal) ← Current setting ❌
- **Bridge** (isolated Docker network) ← Try this ✓
- **Host** (direct host networking) ← Or this ✓
- **Public** (exposed to internet) ← Best option ✓

**Change from "Internal" to "Public" or "Host"**

---

## 📋 Expected Behavior After Fix

### Before Fix (Current):
```
Network Endpoint: host.docker.internal
Accessibility: Internal only
Browser Test: Blank white page (timeout)
Health Check: HTTP 0 (connection refused)
curl Test: Connection refused
```

### After Fix (Expected):
```
Network Endpoint: 0.0.0.0 or Public
Accessibility: Public internet
Browser Test: Service UI loads! ✅
Health Check: HTTP 200 ✅
curl Test: HTTP/2 200 ✅
```

---

## ⏱️ Timeline

**01:40 - 01:45**: Update network endpoint for all 5 (5 min)
**01:45 - 01:46**: Click Redeploy on all 5 (1 min)
**01:46 - 01:56**: Wait for rebuilds (10 min)
**01:56 - 01:58**: Test external access (2 min)
**01:58**: **Refresh health dashboard → 7/7 HEALTHY!** 🎉

**Total**: **18 minutes from now!**

---

## 🎯 Exact Steps (Do This Now!)

**In Coolify, for Events Calendar**:

1. **Click "Events Calendar"** application
2. **Find "Network Endpoint" setting** (might be in):
   - "Configuration" tab
   - "Network" tab
   - "Settings" tab
3. **Current value**: `host.docker.internal`
4. **Change to**:
   - Delete/clear the value (use default)
   - OR set to: `0.0.0.0`
   - OR select: "Public" if dropdown option
5. **Click "Save"**
6. **Click "Redeploy"**

**Repeat for all 5 services!**

---

## 💡 Why This Fixes Everything

**Current State**:
- Service listens on: `host.docker.internal:3000`
- Only Docker containers can reach it
- External requests can't connect
- Blank page = partial connection timeout

**After Fix**:
- Service listens on: `0.0.0.0:3000` (all interfaces)
- Internet can reach it via reverse proxy
- Full response delivered
- Service works! ✅

---

## 🚀 Action Plan

**RIGHT NOW**:

1. **In Coolify, click Events Calendar**
2. **Find where it says** `host.docker.internal`
3. **Change or remove it**
4. **Click "Redeploy"**
5. **Wait 3-5 minutes**
6. **Test**: Visit https://events.blkoutuk.cloud again
   - Should show the events calendar UI (not blank!)

**If Events Calendar works after this**:
- ✅ Do the same for the other 4 services
- ✅ All 5 will work
- ✅ Health dashboard shows 7/7! 🎉

**Where exactly in the Coolify UI do you see the "host.docker.internal" setting?** (Which tab?) I'll give you the exact steps to change it! 🔧