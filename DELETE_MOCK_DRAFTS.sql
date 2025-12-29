-- BLKOUT Mock Data Cleanup - TARGETED DELETE
-- Generated: 2025-12-29 20:59
-- Purpose: Delete ONLY the 3 confirmed mock draft articles
-- Safe: Uses specific IDs, preserves 281 published articles

-- ============================================================
-- CONFIRMED MOCK DATA (3 drafts from Sept 2025)
-- ============================================================

-- These are clearly test articles created during development:
-- 1. "Extension Article Test" (draft, 2025-09-12)
-- 2. "Test Form Article" (draft, 2025-09-12)
-- 3. "Final Test Article" (draft, 2025-09-12)

-- REAL ARTICLES TO PRESERVE (2 published articles):
-- 1. "View: Best of the BLM LDN Protests" (published, 2020-06-08)
-- 2. "Read: Testing Testing" (published, 2018-06-15)

-- ============================================================
-- DELETE ONLY THE 3 MOCK DRAFTS
-- ============================================================

DELETE FROM legacy_articles
WHERE id IN (
  'da9a3960-01e1-41ad-afa2-ecb3f6c309d1',  -- Extension Article Test
  '6a2be42a-29b6-4acf-a101-18c5299c9578',  -- Test Form Article
  '8d1044d1-d06a-450f-9779-dd6dd06f10db'   -- Final Test Article
);

-- ============================================================
-- VERIFY DELETION
-- ============================================================

-- Should return 0 rows (articles deleted)
SELECT id, title, status
FROM legacy_articles
WHERE id IN (
  'da9a3960-01e1-41ad-afa2-ecb3f6c309d1',
  '6a2be42a-29b6-4acf-a101-18c5299c9578',
  '8d1044d1-d06a-450f-9779-dd6dd06f10db'
);

-- Should STILL return 281 (published articles unchanged)
SELECT COUNT(*) as published_count
FROM legacy_articles
WHERE status = 'published';

-- Verify the 2 real articles are still there
SELECT id, title, status, created_at
FROM legacy_articles
WHERE id IN (
  '9e35ff20-6fed-47b8-affc-34a7813e3ec9',  -- BLM LDN Protests
  'adcaad19-a1fe-4183-bfcb-44b75868320a'   -- Testing Testing
);

-- Should return 2 rows (real articles preserved)

-- ============================================================
-- CHECK FOR REMAINING MOCK DATA
-- ============================================================

-- Check if any other obvious mock data exists
SELECT id, title, status, created_at
FROM legacy_articles
WHERE
  status = 'draft'
  AND (
    title ILIKE 'test article%'
    OR title ILIKE 'mock article%'
    OR title ILIKE 'sample article%'
  )
ORDER BY created_at DESC;

-- Should return 0 rows after cleanup

-- ============================================================
-- FINAL VERIFICATION
-- ============================================================

SELECT
  'Final Database State' as summary,
  COUNT(*) as total_articles,
  COUNT(*) FILTER (WHERE status = 'published') as published_articles,
  COUNT(*) FILTER (WHERE status = 'draft') as draft_articles
FROM legacy_articles;

-- Expected:
-- total_articles: 278 (281 minus 3 deleted drafts)
-- published_articles: 281 (unchanged!)
-- draft_articles: X (reduced by 3)

-- ============================================================
-- WHAT HAPPENS NEXT
-- ============================================================

-- After running this SQL:
-- 1. Wait 30 seconds for changes to propagate
-- 2. Visit https://blkoutuk.com/health-dashboard
-- 3. Click "Refresh" button
-- 4. Expected results:
--    - Database tab: "Mock Data: ✓ None"
--    - Checklist: "Mock/test data" blocker REMOVED
--    - Overall status: BLOCKED → APPROVED or WARNING
--    - Checklist: 10/17 → 15-16/17 passed
-- 5. Export new troubleshooting report
-- 6. Status should be APPROVED! 🎉

-- ============================================================
-- SAFETY NOTES
-- ============================================================

-- ✅ Safe because:
-- 1. Deleting only drafts (not published articles)
-- 2. Using specific UUIDs (not pattern matching)
-- 3. Only 3 articles deleted
-- 4. Published count stays at 281
-- 5. Real articles ("BLM Protests", "Testing Testing") preserved

-- ✅ Rollback if needed:
-- If you accidentally delete wrong articles, contact Supabase support
-- or restore from most recent backup

-- ✅ Health dashboard will detect:
-- The updated mock data detection (deployed in next commit) will be
-- more specific and won't flag the 2 real published articles
