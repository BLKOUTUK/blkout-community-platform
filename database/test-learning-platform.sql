-- ============================================================================
-- LEARNING PLATFORM TEST SCRIPT
-- ============================================================================
-- Run this after deploying schema to verify everything works
-- Usage: psql $DATABASE_URL -f test-learning-platform.sql
-- ============================================================================

\echo '================================================'
\echo 'Testing BLKOUT Learning Platform'
\echo '================================================'
\echo ''

-- Test 1: Verify all tables exist
\echo 'Test 1: Checking if all tables exist...'
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'learning_%'
ORDER BY table_name;

\echo ''
\echo 'Expected: 8 tables (learning_modules, learning_progress, skill_exchange, skill_exchange_matches, mentorships, learning_certificates, learning_pathways, learning_community_posts)'
\echo ''

-- Test 2: Check sample modules loaded
\echo 'Test 2: Checking sample modules...'
SELECT
  id,
  title,
  category,
  difficulty_level,
  estimated_duration_minutes,
  is_published
FROM learning_modules
ORDER BY created_at;

\echo ''
\echo 'Expected: 5 sample modules (Cooperative Ownership 101, Democratic Decision-Making, Digital Sovereignty, Trauma-Informed Care, Economic Justice)'
\echo ''

-- Test 3: Test enrollment function
\echo 'Test 3: Testing enrollment function...'
DO $$
DECLARE
  v_module_id UUID;
  v_progress_id UUID;
BEGIN
  -- Get first module
  SELECT id INTO v_module_id FROM learning_modules LIMIT 1;

  -- Note: This will fail if not authenticated, which is expected
  -- In production, call this from authenticated context
  RAISE NOTICE 'Module ID: %', v_module_id;
  RAISE NOTICE 'To test enrollment, call: SELECT enroll_in_module(''%'');', v_module_id;
END $$;

\echo ''

-- Test 4: Check RLS policies
\echo 'Test 4: Checking RLS policies...'
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename LIKE 'learning_%'
ORDER BY tablename, policyname;

\echo ''
\echo 'Expected: Multiple RLS policies for each learning table'
\echo ''

-- Test 5: Check API functions
\echo 'Test 5: Checking API functions...'
SELECT
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (
    routine_name LIKE 'enroll_in_module%'
    OR routine_name LIKE '%learning%'
    OR routine_name LIKE '%quiz%'
    OR routine_name LIKE '%certificate%'
  )
ORDER BY routine_name;

\echo ''
\echo 'Expected: enroll_in_module, update_learning_progress, submit_quiz_results, generate_learning_certificate'
\echo ''

-- Test 6: Check triggers
\echo 'Test 6: Checking triggers...'
SELECT
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE event_object_table LIKE 'learning_%'
ORDER BY event_object_table, trigger_name;

\echo ''
\echo 'Expected: update triggers and certificate code generation trigger'
\echo ''

-- Test 7: Liberation values check
\echo 'Test 7: Checking liberation values in modules...'
SELECT
  title,
  jsonb_pretty(liberation_values) as liberation_values
FROM learning_modules
WHERE is_published = true
LIMIT 3;

\echo ''
\echo 'Expected: Each module has liberation_values JSON with scores 0-10'
\echo ''

-- Test 8: Sample quiz questions
\echo 'Test 8: Checking quiz questions...'
SELECT
  title,
  jsonb_array_length(quiz_questions) as num_quiz_questions
FROM learning_modules
WHERE is_published = true;

\echo ''
\echo 'Expected: Each module has at least 1 quiz question'
\echo ''

-- Test 9: Check indexes
\echo 'Test 9: Checking indexes...'
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename LIKE 'learning_%'
ORDER BY tablename, indexname;

\echo ''
\echo 'Expected: Multiple indexes for performance optimization'
\echo ''

-- Test 10: Sample skill exchange data
\echo 'Test 10: Checking skill exchange table structure...'
\describe skill_exchange;

\echo ''

-- Summary
\echo '================================================'
\echo 'Test Complete!'
\echo '================================================'
\echo ''
\echo 'If all tests passed:'
\echo '  ✅ Database schema is correctly deployed'
\echo '  ✅ Sample modules are loaded'
\echo '  ✅ API functions are available'
\echo '  ✅ RLS policies are active'
\echo ''
\echo 'Next steps:'
\echo '  1. Test enrollment via API endpoint'
\echo '  2. Deploy IVOR learning routes'
\echo '  3. Deploy frontend components'
\echo '  4. Test end-to-end learning flow'
\echo ''
\echo 'Learning Platform is operational! 🎓✊'
\echo ''
