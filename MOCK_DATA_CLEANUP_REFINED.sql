-- BLKOUT Mock Data Cleanup Script - REFINED
-- Generated: 2025-12-29 (Updated after review)
-- Purpose: Remove ONLY confirmed test/mock data, preserve real articles
-- SAFER: More targeted patterns to avoid false positives

-- ============================================================
-- STEP 1: REVIEW POTENTIAL MOCK DATA (MORE TARGETED)
-- ============================================================

-- Check for articles that are LIKELY mock data
-- These patterns are more specific to avoid false positives

-- Pattern 1: Articles with "Test Article" or "Mock Article" in title
SELECT
  id,
  title,
  status,
  created_at,
  'Pattern: Test/Mock Article' as reason
FROM legacy_articles
WHERE
  title ILIKE '%test article%'
  OR title ILIKE '%mock article%'
  OR title ILIKE '%sample article%'
  OR title ILIKE '%demo article%'
  OR title ILIKE '%example article%'
ORDER BY created_at DESC;

-- Pattern 2: Articles with placeholder content
SELECT
  id,
  title,
  status,
  created_at,
  'Pattern: Placeholder' as reason
FROM legacy_articles
WHERE
  title ILIKE 'test%'
  OR title ILIKE 'mock%'
  OR title = 'Sample'
  OR title = 'Demo'
  OR title ILIKE 'Lorem ipsum%'
  OR title ILIKE 'Placeholder%'
ORDER BY created_at DESC;

-- Pattern 3: Check by status (drafts that look like tests)
SELECT
  id,
  title,
  status,
  created_at,
  'Pattern: Draft with test keywords' as reason
FROM legacy_articles
WHERE
  status = 'draft'
  AND (
    title ILIKE '%test%'
    OR title ILIKE '%mock%'
    OR title ILIKE '%sample%'
  )
ORDER BY created_at DESC;

-- ============================================================
-- MANUAL REVIEW SECTION
-- ============================================================

-- Based on your findings:
-- - 3 draft articles found
-- - 2 published articles that are NOT mock data (real content!)

-- QUESTION: Can you share the titles of all 5 articles?
-- This will help us determine which are safe to delete.

-- For example:
-- ❌ "Test Article for Development" - DELETE (clearly mock)
-- ❌ "Sample Post 123" - DELETE (clearly mock)
-- ❌ "Mock Event Testing" - DELETE (clearly mock)
-- ✅ "Testing the Waters: A Story About..." - KEEP (real article about testing)
-- ✅ "Sample of Community Voices" - KEEP (real article about samples)

-- ============================================================
-- STEP 2: OPTION A - DELETE ONLY CONFIRMED MOCK DATA
-- ============================================================

-- Option A1: Delete specific articles by ID (SAFEST)
-- Replace these IDs with the IDs of CONFIRMED mock articles only

-- DELETE FROM legacy_articles
-- WHERE id IN (
--   'uuid-of-confirmed-mock-article-1',
--   'uuid-of-confirmed-mock-article-2',
--   'uuid-of-confirmed-mock-article-3'
-- );

-- Option A2: Delete ONLY drafts with obvious mock patterns (SAFER)
-- This preserves ALL published articles

-- DELETE FROM legacy_articles
-- WHERE
--   status = 'draft'
--   AND (
--     title ILIKE 'test article%'
--     OR title ILIKE 'mock article%'
--     OR title ILIKE 'sample article%'
--     OR title = 'Test'
--     OR title = 'Mock'
--     OR title = 'Sample'
--   );

-- ============================================================
-- STEP 2: OPTION B - SKIP CLEANUP (IF REAL ARTICLES)
-- ============================================================

-- If the 2 published articles are real and important:
-- 1. Do NOT delete them
-- 2. Keep the 3 drafts if they're real drafts (not test data)
-- 3. Accept that health dashboard will show warning
-- 4. Update mock data detection to be less aggressive

-- The health dashboard can still show APPROVED with mock data warning
-- as long as critical features work

-- ============================================================
-- STEP 3: VERIFY CLEANUP (RUN AFTER DELETE)
-- ============================================================

-- Verify legacy_articles count is STILL 281 published
SELECT
  'Legacy Articles (After Cleanup)' as check_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'published') as published_count
FROM legacy_articles;

-- CRITICAL: Published count MUST still be 281!
-- If it's less, you deleted real articles - restore from backup!

-- Verify no obvious mock data remains
SELECT
  'Remaining Obvious Mock Data' as check_name,
  COUNT(*) as count
FROM legacy_articles
WHERE
  title ILIKE 'test article%'
  OR title ILIKE 'mock article%'
  OR title = 'Test'
  OR title = 'Mock';

-- Should return 0 or only the legitimate articles

-- ============================================================
-- ALTERNATIVE: UPDATE MOCK DATA DETECTION
-- ============================================================

-- If the articles are legitimate, we should update the health
-- dashboard to use more specific mock data detection.

-- Current detection is too broad:
-- title ILIKE '%test%' catches "Testing the Waters" (real article)

-- Better detection would be:
-- title ILIKE 'test article%' (only catches "Test Article...")
-- title ILIKE 'mock%' (only catches "Mock...")
-- title = 'Test' (exact match only)

-- This would be updated in: src/services/databaseHealthCheck.ts

-- ============================================================
-- RECOMMENDATION
-- ============================================================

-- Based on your findings (2 published articles are real):

-- RECOMMENDED ACTION:
-- 1. Delete ONLY the 3 draft articles (if they're test data)
-- 2. Keep the 2 published articles (they're real content)
-- 3. Update databaseHealthCheck.ts to use stricter mock detection
-- 4. This way you preserve real content while removing actual test data

-- To delete only drafts with obvious mock patterns:
-- DELETE FROM legacy_articles
-- WHERE
--   status = 'draft'
--   AND (
--     title ILIKE 'test article%'
--     OR title ILIKE 'mock%'
--     OR title = 'Test'
--   );

-- Then verify:
-- SELECT COUNT(*) FROM legacy_articles WHERE status = 'published';
-- MUST return 281!

-- ============================================================
-- SHARE WITH ME
-- ============================================================

-- Please share the titles of all 5 articles found:
-- This will help me create a targeted DELETE statement that:
-- - Removes only actual test/mock data
-- - Preserves the 2 real published articles
-- - Safely removes the 3 draft articles (if they're test data)

-- Example output format:
-- ID | Title | Status | Created
-- uuid-1 | "Testing the Waters: Real Story" | published | 2024-01-15
-- uuid-2 | "Test Article 123" | draft | 2024-11-20
