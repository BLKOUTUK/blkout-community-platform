# BLKOUT Platform Remediation Plan

**Created**: 2025-12-29
**Context**: Health Dashboard revealed platform issues
**Status**: This is SUCCESS - we now have visibility before community impact

---

## 🎯 Why This Is Actually Good News

**The health dashboard is working perfectly.** It's doing exactly what it was designed to do:
- ✅ Exposing issues BEFORE they cause event cancellations
- ✅ Showing the truth about platform health
- ✅ Preventing community-facing failures
- ✅ Providing actionable diagnostics

**Previous state**: "Everything seems fine" → Event cancelled due to unknown failures
**Current state**: "Dashboard shows 3/7 services degraded" → We can fix BEFORE community impact

---

## 📊 Current Platform Status (From SESSION_HANDOFF.md)

### ✅ What Works

1. **Main Website** - https://blkoutuk.com
   - Homepage functional
   - Navigation working
   - Server running (Express on port 80)

2. **Stories Archive** - https://blkoutuk.com/stories
   - 281 legacy articles accessible
   - Joseph Beam articles present
   - Database connection working

3. **Health Dashboard** - https://blkoutuk.com/health-dashboard
   - NOW WORKING (just deployed!)
   - Real-time monitoring active
   - Showing accurate status

### ❌ What Doesn't Work

1. **Newsroom** (`/newsroom`)
   - Shows empty/no articles
   - Database has 125 published articles
   - Environment variables not reaching code

2. **Events Page** (`/events`)
   - Blank page or unstable
   - Database has 43 pending + 25 in moderation queue
   - Needs event approval workflow

3. **Admin Dashboard** (`/admin`)
   - Approve buttons don't work
   - Error: "not valid JSON" when clicking approve
   - Needs SERVICE_ROLE_KEY for database writes

4. **External Services** (events.blkoutuk.cloud, news.blkoutuk.cloud, etc.)
   - May be down or misconfigured
   - Health dashboard will show exact status

---

## 🔧 Root Cause Analysis

### Primary Issue: Environment Variables Not Working

**Problem**: VITE_ environment variables hardcoded in Dockerfile but not reaching JavaScript

**Evidence**:
- Newsroom empty despite 125 articles in database
- Events page blank despite 43 events
- Admin buttons failing (SERVICE_ROLE_KEY missing)

**Location**: Lines 27-38 in Dockerfile

**Why it matters**: All database-connected features fail without these variables

### Secondary Issues

1. **Admin moderation workflow** - Buttons call wrong endpoint or wrong Supabase client
2. **Event approval system** - Not implemented or not accessible
3. **External service connectivity** - May be down or DNS issues

---

## 📋 Systematic Remediation Plan

### Phase 1: Fix Environment Variables (CRITICAL - DO FIRST)

**Goal**: Get VITE_ environment variables working in production

**Steps**:

1. **Verify current state**:
   ```bash
   # SSH into Coolify container
   docker exec [container-id] env | grep VITE
   ```

2. **Check Vite build process**:
   - Environment variables must be available at BUILD time (not runtime)
   - Vite replaces `import.meta.env.VITE_*` during build
   - If build happens before ENV vars are set, they won't be included

3. **Fix options** (try in order):

   **Option A: Verify Dockerfile ENV commands execute**
   ```dockerfile
   # Lines 27-38 should be setting these
   ENV VITE_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
   ENV VITE_SUPABASE_ANON_KEY=...
   # etc.
   ```
   - Check build logs for ENV commands
   - Verify they execute BEFORE `npm run build`

   **Option B: Create .env file in container**
   ```bash
   # After build, create .env
   cat > .env <<EOF
   VITE_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
   VITE_SUPABASE_ANON_KEY=...
   EOF
   ```
   - Requires rebuild to pick up variables

   **Option C: Use runtime environment injection**
   ```javascript
   // Create config.js that reads from window
   window.RUNTIME_CONFIG = {
     SUPABASE_URL: 'https://bgjengudzfickgomjqmz.supabase.co',
     // ...
   };
   ```
   - Inject via server.cjs before serving HTML
   - Not ideal but guaranteed to work

4. **Test after each fix**:
   - Visit `/newsroom` - should show 125 articles
   - Visit `/events` - should show 43 events
   - Visit `/admin` - buttons should work

**Success Criteria**:
- ✅ Newsroom shows 125 published articles
- ✅ Events page shows 43 pending events
- ✅ Admin approve buttons work
- ✅ Health dashboard shows all database checks passing

---

### Phase 2: Fix Admin Dashboard (HIGH PRIORITY)

**Goal**: Enable content moderation workflow

**Current Issue**: "not valid JSON" error when approving content

**Root Cause Analysis**:

1. **Wrong endpoint** - Button calls endpoint that doesn't exist
2. **Wrong Supabase client** - Using anon key instead of service role key
3. **Malformed request** - JSON structure incorrect

**Fix Steps**:

1. **Check browser console** in `/admin`:
   ```javascript
   // Look for actual error
   // Expected: Network error or JSON parse error
   ```

2. **Verify SERVICE_ROLE_KEY is set**:
   ```typescript
   // In liberationDB or admin code
   const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY // Must be service role, not anon
   );
   ```

3. **Test approve endpoint**:
   ```bash
   # Manually test the approve API
   curl -X POST https://blkoutuk.com/api/admin/approve \
     -H "Content-Type: application/json" \
     -d '{"id": "test-id", "type": "event"}'
   ```

4. **Fix the approve handler**:
   ```typescript
   // Ensure proper error handling
   try {
     const { data, error } = await supabase
       .from('moderation_queue')
       .update({ status: 'approved' })
       .eq('id', itemId);

     if (error) throw error;
     return { success: true, data };
   } catch (error) {
     console.error('Approve failed:', error);
     return { success: false, error: error.message };
   }
   ```

**Success Criteria**:
- ✅ Approve button works without errors
- ✅ Items move from moderation queue to published
- ✅ Events appear on events page after approval
- ✅ Health dashboard shows moderation queue count decreasing

---

### Phase 3: Fix Newsroom Page (MEDIUM PRIORITY)

**Goal**: Show 125 published news articles

**Current Issue**: Page shows empty despite 125 articles in database

**Likely Causes**:

1. **Environment variables** (from Phase 1)
2. **Wrong table name** - Querying wrong table
3. **RLS policies** - Row Level Security blocking access
4. **Component error** - JavaScript error preventing render

**Fix Steps**:

1. **Check if Phase 1 fixed it**:
   - If env vars working, newsroom might just work
   - Test: Visit `/newsroom` after env var fix

2. **If still broken, check API endpoint**:
   ```bash
   # Test news API directly
   curl https://blkoutuk.com/api/news
   # Should return 125 articles
   ```

3. **Check component console errors**:
   ```javascript
   // Look for:
   // - Network errors (API not responding)
   // - Database errors (RLS blocking)
   // - JavaScript errors (component crash)
   ```

4. **Verify table and query**:
   ```typescript
   // Should be querying news_articles table
   const { data, error } = await supabase
     .from('news_articles')
     .select('*')
     .eq('status', 'published')
     .order('created_at', { ascending: false });
   ```

**Success Criteria**:
- ✅ `/newsroom` shows 125 published articles
- ✅ Articles load within 3 seconds
- ✅ Pagination works
- ✅ Health dashboard shows news_articles count = 125

---

### Phase 4: Fix Events Page (MEDIUM PRIORITY)

**Goal**: Show 43 pending events (or approved events if workflow implemented)

**Current Issue**: Blank page

**Likely Causes**:

1. **Environment variables** (from Phase 1)
2. **No approved events** - All 43 are pending moderation
3. **Events API misconfigured** - VITE_EVENTS_API_URL wrong
4. **Component crash** - JavaScript error

**Fix Steps**:

1. **Check if Phase 1 fixed it**:
   - Test: Visit `/events` after env var fix

2. **Determine what to show**:
   - Should show: Approved events only? Or pending events for review?
   - Decision: Show approved events to public, pending to admins

3. **Implement approval workflow** (if needed):
   ```typescript
   // After Phase 2 admin fix, approve some events
   // Then they'll appear on events page
   ```

4. **Check events API**:
   ```bash
   # Test events API
   curl https://events.blkoutuk.cloud/api/events
   # Or
   curl https://blkoutuk.com/api/events
   ```

5. **Fix component if needed**:
   ```typescript
   // Ensure events component handles empty state
   if (!events || events.length === 0) {
     return <EmptyState message="No upcoming events" />;
   }
   ```

**Success Criteria**:
- ✅ `/events` shows approved events (or friendly empty state)
- ✅ Events can be approved via admin dashboard
- ✅ Approved events appear within 60 seconds
- ✅ Health dashboard shows events count > 0

---

### Phase 5: Verify External Services (LOW PRIORITY)

**Goal**: Confirm all 7 services are healthy

**Services to Check**:

1. **Main Website** - https://blkoutuk.com (likely working)
2. **Events Calendar** - https://events.blkoutuk.cloud
3. **Newsroom** - https://news.blkoutuk.cloud
4. **Blog/Voices** - https://blog.blkoutuk.cloud
5. **Comms Dashboard** - https://comms.blkoutuk.cloud
6. **CRM** - https://crm.blkoutuk.cloud
7. **IVOR AI** - https://ivor.blkoutuk.cloud

**Fix Steps**:

1. **Check health dashboard**:
   - Go to Overview tab
   - Note which services show "down" or "degraded"

2. **For each failing service**:
   ```bash
   # Test manually
   curl -I https://[service-url]

   # Check DNS
   dig [service-domain]

   # Check Coolify
   # - Is service deployed?
   # - Is domain configured?
   # - Are logs showing errors?
   ```

3. **Common fixes**:
   - **Service not deployed**: Deploy via Coolify
   - **DNS not configured**: Add domain in Coolify settings
   - **Service crashed**: Restart in Coolify
   - **Port not exposed**: Fix Dockerfile/Coolify port mapping

**Success Criteria**:
- ✅ Health dashboard shows 7/7 services healthy
- ✅ All services return HTTP 200
- ✅ Response times < 3000ms
- ✅ SSL certificates valid

---

## 🎯 Prioritized Action Plan

### Immediate (Today)

**1. Access Health Dashboard** ✅ DONE
   - URL: https://blkoutuk.com/health-dashboard
   - Screenshot failing services
   - Export JSON report for documentation

**2. Document Exact Failures**
   - Which services show "down"?
   - Which services show "degraded"?
   - What specific errors in Database tab?
   - What fails in Checklist tab?

**3. Fix Environment Variables** (CRITICAL)
   - This likely fixes 50%+ of issues
   - Follow Phase 1 steps above
   - Test newsroom/events after

### This Week

**4. Fix Admin Dashboard** (HIGH)
   - Enable content moderation
   - Approve pending events
   - Clear moderation queue

**5. Fix Newsroom** (MEDIUM)
   - Show 125 articles
   - Test pagination
   - Verify performance

**6. Fix Events Page** (MEDIUM)
   - Show approved events
   - Test calendar functionality
   - Verify date formatting

### Next Week

**7. Verify External Services** (LOW)
   - Test all 7 service URLs
   - Fix DNS/deployment issues
   - Achieve 7/7 healthy status

**8. Run Pre-Deployment Checklist**
   - Use health dashboard checklist tab
   - Achieve "APPROVED" status
   - Export and save report

---

## 📊 Success Metrics

### Platform Health Target

**Before Health Dashboard**:
- ❓ Unknown service status
- ❓ Unknown database integrity
- ❓ Discovered failures after community impact

**After Remediation**:
- ✅ 7/7 services healthy
- ✅ 281/281 legacy articles present
- ✅ 125/125 news articles accessible
- ✅ 43+ approved events visible
- ✅ 0 items in moderation queue
- ✅ Health dashboard shows "APPROVED" status

### Community Trust Target

**Before**:
- ❌ Event cancelled due to platform failure
- ❌ Loss of community trust

**After**:
- ✅ Proactive issue detection
- ✅ Transparent status monitoring
- ✅ Zero community-facing failures
- ✅ Reliable platform for events/content

---

## 🔄 Continuous Improvement Process

### Daily Health Checks

1. **Morning routine**:
   - Visit https://blkoutuk.com/health-dashboard
   - Check Overview tab (7/7 healthy?)
   - Check Database tab (281 articles?)
   - Export daily report

2. **Before any deployment**:
   - Run health check
   - Check Checklist tab
   - Only deploy if "APPROVED"
   - Export pre-deployment report

3. **After any changes**:
   - Wait 5 minutes for changes to propagate
   - Run health check
   - Verify no regressions
   - Export post-change report

### Weekly Reviews

1. **Team review**:
   - Review week's health reports
   - Identify trends (degrading services?)
   - Plan preventive maintenance
   - Update documentation

2. **Community transparency**:
   - Share uptime metrics
   - Explain any outages
   - Show improvements
   - Build trust through honesty

---

## 💡 Key Insights

### What The Health Dashboard Revealed

**The Good**:
- ✅ Stories archive works (281 articles)
- ✅ Database connection solid (Supabase)
- ✅ Core infrastructure stable (Coolify/Hostinger)
- ✅ Health monitoring now in place

**The Bad**:
- ❌ Environment variables not reaching code
- ❌ Multiple features non-functional
- ❌ External services possibly down

**The Important**:
- 🎯 We now SEE these issues before community impact
- 🎯 We have actionable diagnostics for each failure
- 🎯 We can systematically fix and verify
- 🎯 We prevent future event cancellations

### Why This Is Progress

**Old Process**:
1. Deploy changes
2. Hope everything works
3. Discover failures when community complains
4. Emergency fixes under pressure
5. Loss of trust

**New Process**:
1. Deploy changes
2. Check health dashboard
3. See failures immediately
4. Fix systematically before community impact
5. Build trust through reliability

---

## 📝 Next Steps

### Immediate Actions

1. **Take screenshots** of current health dashboard
   - Overview tab (service status)
   - Database tab (article counts)
   - Checklist tab (BLOCKED status)

2. **Export baseline report**
   - Click "Export JSON"
   - Save as `health-baseline-2025-12-29.json`
   - Document current state

3. **Start with Phase 1** (Environment Variables)
   - Highest impact fix
   - Likely resolves 50%+ of issues
   - Test newsroom/events after

4. **Re-run health check** after each fix
   - See improvements in real-time
   - Track progress
   - Export updated reports

### Communication

**To BLKOUT Team**:
> "Good news: Health dashboard is working! It's showing us issues we need to fix BEFORE they impact the community. This is exactly what we wanted - visibility before failures. We have a systematic plan to fix everything."

**To Community** (after fixes):
> "We've implemented a new health monitoring system that helps us catch issues before they affect your experience. Thanks for your patience as we make BLKOUT more reliable."

---

## 🎯 Final Note

**The health dashboard revealing problems is SUCCESS, not failure.**

You now have:
- ✅ Real-time visibility into platform health
- ✅ Actionable diagnostics for each issue
- ✅ Systematic remediation plan
- ✅ Tools to prevent future failures
- ✅ Foundation for organizational trust

**Next milestone**: All 7 services healthy, 281 articles validated, "APPROVED" status

Let's systematically work through the fixes. Start with Phase 1 (environment variables) and we'll see immediate improvements! 🚀

---

**Related Documentation**:
- `/HEALTH_DASHBOARD.md` - How to use the dashboard
- `/SESSION_HANDOFF.md` - Current deployment status
- `/COMMAND_CENTER_ROADMAP.md` - Long-term vision
- `/DEPLOYMENT-PLAN.md` - Infrastructure architecture
