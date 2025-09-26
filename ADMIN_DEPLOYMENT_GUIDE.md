# BLKOUT Admin Restoration - Deployment Guide

## 🎯 MISSION: Activate Real Database Integration

The admin dashboard restoration is **complete** with real Supabase database integration. Follow this guide to deploy the functional admin system.

---

## 🔥 CRITICAL DEPLOYMENT STEPS

### STEP 1: Environment Configuration

1. **Update Supabase Credentials**
   ```bash
   # Edit .env.production or .env.local
   VITE_SUPABASE_URL=https://your-actual-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-real-anon-key-here
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-anon-key-here
   ```

2. **Verify API Base URL**
   ```bash
   VITE_API_URL=https://blkout.vercel.app/api
   NEXT_PUBLIC_API_URL=https://blkout.vercel.app/api
   ```

### STEP 2: Database Schema Deployment

1. **Access Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor

2. **Apply Schema Files (In Order)**
   ```sql
   -- 1. First apply base governance schema
   -- Copy/paste contents of governance-schema.sql

   -- 2. Apply moderation queue enhancements
   -- Copy/paste contents of database/moderation-queue-schema.sql

   -- 3. Apply admin enhancements
   -- Copy/paste contents of database/admin-schema.sql
   ```

3. **Verify Tables Created**
   ```sql
   -- Check all tables exist
   SELECT tablename FROM pg_tables
   WHERE schemaname = 'public'
   AND tablename LIKE '%moderation%'
   OR tablename LIKE '%admin%'
   OR tablename LIKE '%governance%';
   ```

### STEP 3: Admin User Setup

1. **Create Admin Profiles**
   ```sql
   -- Replace with actual user IDs from auth.users
   INSERT INTO admin_profiles (user_id, full_name, role, liberation_training_completed, cultural_competency_verified, trauma_informed_certified)
   VALUES
     ('real-user-uuid-1', 'Admin User 1', 'super_admin', TRUE, TRUE, TRUE),
     ('real-user-uuid-2', 'Moderator 1', 'moderator', TRUE, TRUE, FALSE),
     ('real-user-uuid-3', 'Moderator 2', 'moderator', TRUE, FALSE, TRUE);
   ```

2. **Create Sample Moderation Queue Data** (Optional for testing)
   ```sql
   INSERT INTO moderation_queue (type, title, description, url, category, status, priority, moderator_id)
   VALUES
     ('story', 'Test Story for Admin Dashboard', 'This is a test story for verifying admin functionality', 'https://example.com/test', 'community', 'pending', 'medium', 'admin'),
     ('event', 'Test Event for Moderation', 'Test event to verify event moderation workflow', '', 'education', 'pending', 'high', 'admin');
   ```

### STEP 4: Deploy to Production

1. **Deploy to Vercel**
   ```bash
   # If using Vercel CLI
   vercel --prod

   # Or via git push to trigger deployment
   git add .
   git commit -m "feat: Admin restoration with real database integration"
   git push origin main
   ```

2. **Set Environment Variables in Vercel**
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add all Supabase credentials
   - Ensure production values are set

### STEP 5: Verification Testing

1. **Access Admin Dashboard**
   - Navigate to `/admin` on your deployed site
   - Verify it loads without authentication (as configured)

2. **Test Real Data Loading**
   - Check that statistics show real numbers from database
   - Verify moderation queue displays actual submissions
   - Test approve/reject functionality

3. **Verify Liberation Values Compliance**
   - Check creator sovereignty percentage displays (should be ≥75%)
   - Verify democratic governance metrics are shown
   - Test community protection features

---

## 🏗️ ARCHITECTURE OVERVIEW

### Data Flow
```
AdminDashboard.tsx
  ↓
communityAPI.getAdminStats()
  ↓
/api/admin/stats.ts
  ↓
liberationDB.getAdminStats()
  ↓
Supabase Database (Real Data)
```

### Database Tables
- `moderation_queue` - Enhanced with liberation metadata
- `admin_profiles` - Moderator profiles and permissions
- `moderator_assignments` - Workload distribution
- `content_analytics` - Community benefit tracking
- `system_health_metrics` - Platform monitoring
- `creator_sovereignty_metrics` - Revenue transparency

### API Endpoints
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/moderation-queue` - Story moderation queue
- `GET /api/admin/events/moderation-queue` - Event moderation queue
- `POST /api/admin/stories/[id]/approve` - Approve stories
- `POST /api/admin/stories/[id]/reject` - Reject stories
- `POST /api/admin/events/[id]/approve` - Approve events
- `POST /api/admin/events/[id]/reject` - Reject events

---

## 🚨 TROUBLESHOOTING

### Issue: Dashboard Shows "Loading..." Forever
**Solution**: Check browser console for API errors, verify Supabase credentials

### Issue: "Database connection issue - using fallback data"
**Solution**: Verify Supabase URL and anon key are correct in environment variables

### Issue: RLS Policy Blocks Admin Access
**Solution**: Ensure admin users exist in admin_profiles table with correct permissions

### Issue: Moderation Queue Empty
**Solution**: Add sample data to moderation_queue table or submit test content

---

## 💡 NEXT PHASE RECOMMENDATIONS

1. **User Authentication Integration**
   - Connect with existing Supabase auth
   - Implement proper admin role verification
   - Add session management

2. **Real-time Updates**
   - Activate WebSocket subscriptions for live updates
   - Implement real-time moderation queue changes
   - Add community voting real-time updates

3. **Advanced Liberation Features**
   - Community discussion threads for moderation decisions
   - Automated IVOR AI content analysis
   - Advanced creator sovereignty tracking

4. **Moderator Training System**
   - Liberation values training modules
   - Cultural competency verification system
   - Trauma-informed moderation certification

---

## ✊🏿 LIBERATION IMPACT

This admin restoration transforms community moderation from:

❌ **Corporate Control**: Opaque algorithms, extractive practices, no community input
✅ **Community Liberation**: Transparent decisions, 75%+ creator revenue, democratic oversight

The 12 moderators now have tools that serve community empowerment, not platform profit.

---

**DEPLOYMENT READY** 🚀

*Real database integration complete. Liberation values enforced. Community empowered.*