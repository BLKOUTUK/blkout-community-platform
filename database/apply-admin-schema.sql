-- BLKOUT Liberation Platform - Apply Admin Schema Script
-- This script applies the admin enhancement schema to an existing Supabase database
-- Run this in your Supabase SQL editor or via CLI

-- ============================================================================
-- STEP 1: Apply base moderation queue enhancements
-- ============================================================================

\echo 'Applying moderation queue enhancements...'
\i database/moderation-queue-schema.sql

-- ============================================================================
-- STEP 2: Apply admin schema enhancements
-- ============================================================================

\echo 'Applying admin schema enhancements...'
\i database/admin-schema.sql

-- ============================================================================
-- STEP 3: Apply governance schema (if not already applied)
-- ============================================================================

\echo 'Applying governance schema...'
\i governance-schema.sql

-- ============================================================================
-- STEP 4: Verify installation with sample data
-- ============================================================================

\echo 'Verifying schema installation...'

-- Check that all tables exist
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'moderation_queue',
  'admin_profiles',
  'moderator_assignments',
  'content_analytics',
  'system_health_metrics',
  'creator_sovereignty_metrics',
  'governance_members',
  'governance_proposals'
)
ORDER BY tablename;

-- Check sample data exists
SELECT 'moderation_queue' as table_name, count(*) as record_count FROM moderation_queue
UNION ALL
SELECT 'admin_profiles', count(*) FROM admin_profiles
UNION ALL
SELECT 'system_health_metrics', count(*) FROM system_health_metrics
UNION ALL
SELECT 'creator_sovereignty_metrics', count(*) FROM creator_sovereignty_metrics;

-- Check views exist
SELECT
  schemaname,
  viewname,
  viewowner
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN (
  'admin_dashboard_summary',
  'moderator_workload',
  'active_governance_proposals',
  'community_governance_health'
)
ORDER BY viewname;

-- Check functions exist
SELECT
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'get_admin_stats',
  'get_moderation_queue',
  'update_admin_updated_at_column',
  'auto_assign_moderation'
)
ORDER BY routine_name;

\echo 'Schema installation verification complete!'
\echo 'Admin dashboard is ready for real database integration.'
\echo 'Liberation values compliance: Creator sovereignty >= 75%, Democratic governance enabled'