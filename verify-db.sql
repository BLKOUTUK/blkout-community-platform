-- Verify Learning Platform Database Deployment

-- Check all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'learning_%'
ORDER BY table_name;

-- Check sample modules loaded
SELECT id, title, category, difficulty_level, estimated_duration_minutes, is_published
FROM learning_modules
ORDER BY created_at;

-- Check functions created
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%learning%'
ORDER BY routine_name;
