-- BLKOUT Mock Data Cleanup Script
-- Generated: 2025-12-29
-- Purpose: Remove test/mock/sample data from production database
-- IMPORTANT: Review results before running DELETE commands!

-- ============================================================
-- STEP 1: REVIEW WHAT WILL BE DELETED (RUN THIS FIRST!)
-- ============================================================

-- Check legacy_articles for mock data
SELECT
  id,
  title,
  status,
  created_at
FROM legacy_articles
WHERE
  title ILIKE '%test%'
  OR title ILIKE '%mock%'
  OR title ILIKE '%sample%'
  OR title ILIKE '%demo%'
  OR title ILIKE '%example%'
ORDER BY created_at DESC;

-- Current count should be 281 published
SELECT
  'Legacy Articles (Before Cleanup)' as check_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'published') as published_count
FROM legacy_articles;

-- Check news_articles for mock data
SELECT
  id,
  title,
  status,
  created_at
FROM news_articles
WHERE
  title ILIKE '%test%'
  OR title ILIKE '%mock%'
  OR title ILIKE '%sample%'
  OR title ILIKE '%demo%'
  OR title ILIKE '%example%'
ORDER BY created_at DESC;

-- Current count should be 125 published
SELECT
  'News Articles (Before Cleanup)' as check_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'published') as published_count
FROM news_articles;

-- Check events for mock data
SELECT
  id,
  title,
  status,
  created_at
FROM events
WHERE
  title ILIKE '%test%'
  OR title ILIKE '%mock%'
  OR title ILIKE '%sample%'
  OR title ILIKE '%demo%'
  OR title ILIKE '%example%'
ORDER BY created_at DESC;

-- ============================================================
-- STEP 2: DELETE MOCK DATA (RUN ONLY AFTER REVIEWING STEP 1!)
-- ============================================================

-- UNCOMMENT AND RUN THESE ONLY IF YOU'VE REVIEWED THE DATA ABOVE!

-- Delete mock data from legacy_articles
-- DELETE FROM legacy_articles
-- WHERE
--   title ILIKE '%test%'
--   OR title ILIKE '%mock%'
--   OR title ILIKE '%sample%'
--   OR title ILIKE '%demo%'
--   OR title ILIKE '%example%';

-- Delete mock data from news_articles
-- DELETE FROM news_articles
-- WHERE
--   title ILIKE '%test%'
--   OR title ILIKE '%mock%'
--   OR title ILIKE '%sample%'
--   OR title ILIKE '%demo%'
--   OR title ILIKE '%example%';

-- Delete mock data from events
-- DELETE FROM events
-- WHERE
--   title ILIKE '%test%'
--   OR title ILIKE '%mock%'
--   OR title ILIKE '%sample%'
--   OR title ILIKE '%demo%'
--   OR title ILIKE '%example%';

-- ============================================================
-- STEP 3: VERIFY CLEANUP (RUN AFTER DELETE COMMANDS)
-- ============================================================

-- Verify legacy_articles count is still 281
SELECT
  'Legacy Articles (After Cleanup)' as check_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'published') as published_count
FROM legacy_articles;

-- Should still be 281 published articles!
-- If count is less than 281, you may have deleted real articles!

-- Verify no mock data remains
SELECT
  'Remaining Mock Data Check' as check_name,
  COUNT(*) as mock_count
FROM legacy_articles
WHERE
  title ILIKE '%test%'
  OR title ILIKE '%mock%'
  OR title ILIKE '%sample%'
  OR title ILIKE '%demo%'
  OR title ILIKE '%example%';

-- Should return 0 rows

-- Final counts
SELECT
  'Final Counts' as summary,
  (SELECT COUNT(*) FROM legacy_articles WHERE status = 'published') as legacy_articles,
  (SELECT COUNT(*) FROM news_articles WHERE status = 'published') as news_articles,
  (SELECT COUNT(*) FROM events WHERE status = 'published') as published_events,
  (SELECT COUNT(*) FROM events) as total_events;

-- ============================================================
-- NOTES
-- ============================================================

-- IMPORTANT SAFEGUARDS:
-- 1. Always run STEP 1 (SELECT) before STEP 2 (DELETE)
-- 2. Review every row that will be deleted
-- 3. Verify legacy_articles count stays at 281 after cleanup
-- 4. If you accidentally delete real data, restore from backup immediately
-- 5. Export health dashboard troubleshooting report before and after cleanup

-- EXPECTED RESULTS:
-- - Mock data removed from all tables
-- - legacy_articles still has 281 published articles
-- - news_articles count unchanged (unless mock data was removed)
-- - Health dashboard no longer shows "Mock data detected" warning
-- - Deployment status changes from BLOCKED to APPROVED or WARNING

-- NEXT STEPS AFTER CLEANUP:
-- 1. Wait 30 seconds for database changes to propagate
-- 2. Visit https://blkoutuk.com/health-dashboard
-- 3. Click "Refresh" button
-- 4. Verify Database tab shows "Mock Data: ✓ None"
-- 5. Export new troubleshooting report to confirm improvement
