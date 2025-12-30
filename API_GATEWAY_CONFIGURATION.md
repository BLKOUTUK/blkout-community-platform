# API Gateway Configuration - api.blkoutuk.cloud

**Created**: 2025-12-30 01:42
**Change**: Network destination changed from host.docker.internal to api.blkoutuk.cloud
**Architecture**: API Gateway pattern (all services route through single endpoint)

---

## 🔍 What You Changed

**Before**:
```
Destinations Tab: host.docker.internal
Result: Internal Docker network only
Access: Not publicly accessible
```

**After**:
```
Destinations Tab: api.blkoutuk.cloud
Result: Routes through API gateway
Access: Potentially publicly accessible via gateway
```

---

## ⏱️ Wait for Redeploy (3-5 Minutes)

**Coolify is rebuilding Events Calendar with new network configuration**

**Monitor**:
1. Watch build logs in Coolify
2. Wait for "Build successful"
3. Wait for "Running" status

**ETA**: Service should be ready in 3-5 minutes

---

## 🧪 Test After Redeploy Completes

### Test 1: Check Events Calendar Directly

**Visit**: https://events.blkoutuk.cloud

**Expected outcomes**:

**Scenario A: Works via Individual Domain** ✅
- Events calendar UI loads (not blank!)
- Service is now publicly accessible
- **Action**: Repeat fix for other 4 services
- **Result**: Will achieve 7/7 healthy!

**Scenario B: Still Blank/Error** ❌
- Service routing through api.blkoutuk.cloud but not events.blkoutuk.cloud
- **Action**: Need to configure routing/reverse proxy
- **Or**: Change destination to `0.0.0.0` instead

**Scenario C: Works via API Gateway** 🤔
- Service accessible at api.blkoutuk.cloud/events
- But not at events.blkoutuk.cloud
- **Action**: Configure subdomain routing or use individual destinations

---

### Test 2: Check API Gateway

**If api.blkoutuk.cloud is an API gateway**:

**Try these URLs**:
```bash
curl -I https://api.blkoutuk.cloud
curl -I https://api.blkoutuk.cloud/events
curl -I https://api.blkoutuk.cloud/news
```

**If these work**:
- You have an API gateway setup
- May need to configure routing rules
- Or update health check to use api.blkoutuk.cloud endpoints

---

## 🎯 Two Possible Architectures

### Architecture A: Individual Subdomains (Recommended)

**Each service has its own domain**:
```
events.blkoutuk.cloud → Events Calendar service
news.blkoutuk.cloud → Newsroom service
comms.blkoutuk.cloud → Comms Dashboard service
crm.blkoutuk.cloud → CRM service
ivor.blkoutuk.cloud → IVOR AI service
```

**Network Destination Should Be**:
- `0.0.0.0` (listen on all interfaces)
- Or empty (use Coolify default)
- Each service independently exposed

---

### Architecture B: API Gateway (Centralized)

**All services route through api.blkoutuk.cloud**:
```
api.blkoutuk.cloud/events → Events Calendar
api.blkoutuk.cloud/news → Newsroom
api.blkoutuk.cloud/comms → Comms Dashboard
api.blkoutuk.cloud/crm → CRM
api.blkoutuk.cloud/ivor → IVOR AI
```

**Requires**:
- API gateway service running at api.blkoutuk.cloud
- Routing rules configured
- Health check updated to use gateway endpoints

---

## 🔧 Recommended Fix: Use 0.0.0.0

**Instead of api.blkoutuk.cloud, try this**:

### For Events Calendar (Test First)

1. **Go back to Destinations tab** in Coolify
2. **Change**: `api.blkoutuk.cloud` → **`0.0.0.0`**
3. **Or**: Delete the value entirely (leave empty)
4. **Save**
5. **Redeploy**
6. **Wait 3-5 minutes**
7. **Test**: https://events.blkoutuk.cloud
   - Should now load the UI! ✅

**Why 0.0.0.0**:
- Binds service to ALL network interfaces
- Allows Coolify reverse proxy to route correctly
- Individual subdomains work as expected

---

## ⏱️ Timeline

**01:42**: Changed to api.blkoutuk.cloud, redeploying
**01:45 - 01:47**: Redeploy completes
**01:47**: Test https://events.blkoutuk.cloud

**If blank page persists**:
- Change to `0.0.0.0` instead
- Redeploy again (3-5 min)
- Should work!

**If Events Calendar works**:
- Apply same fix to other 4
- 7/7 healthy in 20 minutes! 🎉

---

## 🎯 Next Steps

### In 3-5 Minutes (When Redeploy Completes)

**1. Test Events Calendar**:
```
Visit: https://events.blkoutuk.cloud
```

**2. Share what you see**:
- ✅ Events calendar UI loads?
- ❌ Still blank page?
- ❌ Different error?

**3a. If it works**:
- Repeat for other 4 services
- Change destinations to api.blkoutuk.cloud
- Redeploy all
- **7/7 healthy!**

**3b. If still blank**:
- Change destination to `0.0.0.0` instead
- Redeploy again
- Should work!

---

## 💡 Quick Diagnosis While Waiting

**Check in browser console** (F12):
- Visit: https://events.blkoutuk.cloud
- Look for errors
- Share any error messages

**Check Coolify logs**:
- Events Calendar → Logs tab
- Look for startup messages
- Any errors shown?

---

## 🚀 Update Me When Redeploy Completes

**In 3-5 minutes, tell me**:

1. Does https://events.blkoutuk.cloud load now?
2. Any errors in browser console?
3. Any errors in Coolify logs?

Then we'll either:
- ✅ Repeat for other 4 services (if it works!)
- 🔧 Try `0.0.0.0` destination (if still blank)

You're **very close** to getting all services working! 🎯