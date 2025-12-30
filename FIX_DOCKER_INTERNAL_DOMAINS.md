# Fix Coolify Domain Configuration - host.docker.internal Issue

**Created**: 2025-12-30 00:05
**Issue**: Services running but using internal Docker address instead of public domains
**Impact**: Services unreachable from internet (HTTP Status 0)

---

## 🔍 Root Cause Identified

**Problem**: Services configured with `host.docker.internal` instead of public domains

**What this means**:
- ✅ Services ARE running in Coolify (containers up)
- ✅ Services ARE accessible within Docker network
- ❌ Services NOT accessible from internet
- ❌ Health check can't reach them (external check)

**Technical Explanation**:
- `host.docker.internal` is a special Docker hostname
- Resolves to host machine from INSIDE containers
- Not routable from external internet
- Used for inter-container communication only

---

## 🎯 The Fix: Configure Public Domains

For **EACH of the 5 services** in Coolify:

### Step-by-Step Fix (Per Service)

1. **Click on the application** (e.g., Events Calendar)

2. **Go to "Domains" tab**

3. **Current domain shows**: `host.docker.internal` or similar

4. **Action: Replace with public domain**:
   - Click "Edit" or "Remove" on existing domain
   - Click "+ Add Domain"
   - **Enter public domain**: `events.blkoutuk.cloud`
   - **Enable**: ✅ HTTPS/SSL
   - **Enable**: ✅ Auto-generate certificate
   - Click "Save"

5. **Wait for SSL certificate** (2-5 minutes)
   - Status will show "Generating certificate..."
   - Then change to "Active" with green checkmark

6. **Service becomes publicly accessible!**

---

## 📋 Domain Configuration for All 5 Services

**Replace `host.docker.internal` with these public domains**:

| Service | Current (Internal) | Replace With (Public) |
|---------|-------------------|----------------------|
| Events Calendar | host.docker.internal | `events.blkoutuk.cloud` |
| Newsroom | host.docker.internal | `news.blkoutuk.cloud` |
| Comms Dashboard | host.docker.internal | `comms.blkoutuk.cloud` |
| CRM | host.docker.internal | `crm.blkoutuk.cloud` |
| IVOR AI | host.docker.internal | `ivor.blkoutuk.cloud` |

---

## ⚡ Parallel Fix Process (10 Minutes Total)

### Phase 1: Configure All 5 Domains (5 minutes)

**For each service in Coolify**:

1. **Events Calendar**:
   - Click application → Domains tab
   - Remove host.docker.internal (if shown)
   - Add: `events.blkoutuk.cloud`
   - Enable HTTPS ✅

2. **Newsroom**:
   - Click application → Domains tab
   - Remove host.docker.internal
   - Add: `news.blkoutuk.cloud`
   - Enable HTTPS ✅

3. **Comms Dashboard**:
   - Click application → Domains tab
   - Remove host.docker.internal
   - Add: `comms.blkoutuk.cloud`
   - Enable HTTPS ✅

4. **CRM**:
   - Click application → Domains tab
   - Remove host.docker.internal
   - Add: `crm.blkoutuk.cloud`
   - Enable HTTPS ✅

5. **IVOR AI**:
   - Click application → Domains tab
   - Remove host.docker.internal
   - Add: `ivor.blkoutuk.cloud`
   - Enable HTTPS ✅

---

### Phase 2: Wait for SSL Certificates (5 minutes)

**Coolify will**:
- Generate SSL certificates for all 5 domains
- Configure reverse proxy routing
- Bind services to public domains

**You'll see**:
- Status: "Generating certificate..." → "Active" ✅
- Takes 2-5 minutes per domain
- Can happen in parallel

---

### Phase 3: Verify External Access (2 minutes)

**Test each domain**:
```bash
curl -I https://events.blkoutuk.cloud
curl -I https://news.blkoutuk.cloud
curl -I https://comms.blkoutuk.cloud
curl -I https://crm.blkoutuk.cloud
curl -I https://ivor.blkoutuk.cloud

# All should return: HTTP/2 200
# Instead of: connection refused
```

**Or test in browser**:
- Visit each URL
- Should load the service UI
- Not connection refused

---

### Phase 4: Refresh Health Dashboard (1 minute)

1. **Visit**: https://blkoutuk.com/health-dashboard
2. **Click**: "Refresh" button
3. **Watch services turn green**:
   - Events Calendar: DOWN → HEALTHY ✅
   - Newsroom: DOWN → HEALTHY ✅
   - Comms Dashboard: DOWN → HEALTHY ✅
   - CRM: DOWN → HEALTHY ✅
   - IVOR AI: DOWN → HEALTHY ✅

4. **Expected Result**: **7/7 Services Healthy!** 🎉

---

## 🔧 Alternative: Check Domain Tab in Coolify

**What you might see in "Domains" tab**:

### Scenario A: No Domains Configured
```
Domains: (empty)
```
**Fix**: Add the public domain as shown above

### Scenario B: host.docker.internal Shown
```
Domains:
- host.docker.internal (internal only)
```
**Fix**: Remove and add public domain

### Scenario C: Public Domain Configured but Pending
```
Domains:
- events.blkoutuk.cloud (⏳ Generating certificate...)
```
**Fix**: Just wait 5 minutes for SSL

### Scenario D: Public Domain Active
```
Domains:
- events.blkoutuk.cloud (✅ Active)
```
**Should work!** If health check still fails, different issue.

---

## 📊 Expected Timeline

**00:05 - 00:10**: Configure domains for all 5 services (5 min)
**00:10 - 00:15**: Wait for SSL certificates (5 min)
**00:15 - 00:17**: Test all services with curl (2 min)
**00:17**: Refresh health dashboard → **7/7 HEALTHY!** 🎉

**Total**: **12 minutes from now!**

---

## 🎯 Quick Action Items

**Right now in Coolify**:

1. **Click on Events Calendar** application
2. **Go to "Domains" tab**
3. **Tell me what you see**:
   - Is there a domain configured?
   - Does it say `host.docker.internal`?
   - Does it say `events.blkoutuk.cloud`?
   - What's the status?

**This will tell us the exact fix needed!**

---

## 💡 Why This Happened

**Likely scenario**:
- Services were initially configured for internal Docker network testing
- Using `host.docker.internal` for development
- Never updated to use public domains for production
- Services work internally but not externally

**The fix is simple**:
- Replace internal domains with public domains
- Enable SSL/HTTPS
- Wait for certificates
- Services become publicly accessible!

---

## 🚀 Next Step

**Check the "Domains" tab in Coolify for one service** (like Events Calendar) and share what you see. Based on that, I'll give you the exact steps to fix all 5 in parallel! 🔧