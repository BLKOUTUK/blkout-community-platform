-- ============================================================================
-- APPLY LEARNING PLATFORM SCHEMA TO PRODUCTION
-- ============================================================================
-- Run this script to deploy the learning platform to production database
-- Usage: psql -h <host> -U <user> -d <database> -f apply-learning-schema.sql
-- ============================================================================

\echo '================================================'
\echo 'BLKOUT Learning Platform - Schema Deployment'
\echo '================================================'
\echo ''
\echo 'This script will:'
\echo '  1. Create learning platform tables'
\echo '  2. Insert 5 sample learning modules'
\echo '  3. Set up RLS policies'
\echo '  4. Create API functions'
\echo '  5. Grant permissions'
\echo ''
\echo 'Starting deployment...'
\echo ''

-- Load the main schema file
\i learning-platform-schema.sql

\echo ''
\echo '================================================'
\echo 'Deployment Complete!'
\echo '================================================'
\echo ''
\echo 'Next steps:'
\echo '  1. Verify tables: SELECT table_name FROM information_schema.tables WHERE table_schema = '\''public'\'' AND table_name LIKE '\''learning_%'\'';'
\echo '  2. Check modules: SELECT id, title, category FROM learning_modules;'
\echo '  3. Test enrollment: SELECT enroll_in_module('\''<module_id>'\'');'
\echo '  4. Update IVOR server: Add learning routes to api/server.ts'
\echo '  5. Deploy frontend: Update App.tsx with learning routes'
\echo ''
\echo 'Learning Platform is ready! 🎓'
\echo ''
