-- IVOR Intelligence Verification Queries
-- Run these after applying the main migration to verify data population

-- ============================================================================
-- 1. VERIFY TABLE CREATION
-- ============================================================================

-- Check ivor_intelligence table exists
SELECT
  'ivor_intelligence' as table_name,
  COUNT(*) as record_count,
  COUNT(*) FILTER (WHERE is_stale = FALSE) as active_records
FROM ivor_intelligence;

-- Check refresh log table exists
SELECT
  'ivor_intelligence_refresh_log' as table_name,
  COUNT(*) as record_count
FROM ivor_intelligence_refresh_log;

-- ============================================================================
-- 2. VERIFY INTELLIGENCE DATA
-- ============================================================================

-- Show all intelligence types and their latest data
SELECT
  intelligence_type,
  summary,
  relevance_score,
  priority,
  created_at,
  expires_at
FROM ivor_intelligence
WHERE is_stale = FALSE
ORDER BY
  CASE priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  created_at DESC;

-- ============================================================================
-- 3. VERIFY KEY INSIGHTS
-- ============================================================================

-- Show key insights from each intelligence type
SELECT
  intelligence_type,
  unnest(key_insights) as insight
FROM ivor_intelligence
WHERE is_stale = FALSE
ORDER BY intelligence_type;

-- ============================================================================
-- 4. VERIFY ACTIONABLE ITEMS
-- ============================================================================

-- Show actionable items requiring attention
SELECT
  intelligence_type,
  unnest(actionable_items) as action_required
FROM ivor_intelligence
WHERE is_stale = FALSE
  AND array_length(actionable_items, 1) > 0
ORDER BY priority, intelligence_type;

-- ============================================================================
-- 5. VERIFY VIEWS WORK
-- ============================================================================

-- Test current_ivor_intelligence view
SELECT COUNT(*) as current_intelligence_count FROM current_ivor_intelligence;

-- Test ivor_intelligence_summary view
SELECT * FROM ivor_intelligence_summary;

-- ============================================================================
-- 6. VERIFY FUNCTIONS WORK
-- ============================================================================

-- Test individual aggregation functions (uncomment to run)
-- SELECT aggregate_member_activity_intelligence();
-- SELECT aggregate_resource_trends_intelligence();
-- SELECT aggregate_content_performance_intelligence();
-- SELECT aggregate_conversation_themes_intelligence();
-- SELECT aggregate_governance_updates_intelligence();

-- Test master refresh function
-- SELECT * FROM refresh_all_ivor_intelligence();

-- ============================================================================
-- 7. VERIFY SOURCE DATA EXISTS
-- ============================================================================

-- Check source tables have data
SELECT 'governance_members' as source_table, COUNT(*) as record_count FROM governance_members
UNION ALL
SELECT 'governance_proposals', COUNT(*) FROM governance_proposals
UNION ALL
SELECT 'governance_votes', COUNT(*) FROM governance_votes
UNION ALL
SELECT 'voices_articles', COUNT(*) FROM voices_articles;

-- ============================================================================
-- SUCCESS CRITERIA
-- ============================================================================
-- 1. ivor_intelligence table has at least 5 records (one per type)
-- 2. All records have is_stale = FALSE
-- 3. All records have relevance_score > 0
-- 4. current_ivor_intelligence view returns data
-- 5. Source tables have data to aggregate
