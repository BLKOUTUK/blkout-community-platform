-- BLKOUT Liberation Platform - RLS Policy Configuration for Chrome Extension
-- Allow the Chrome extension API to insert moderation log entries

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'moderation_log';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'moderation_log';

-- Option 1: Allow all operations for service role (recommended for API)
-- This allows the API (using service role key) to perform all operations
CREATE POLICY "Allow service role full access" ON public.moderation_log
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Option 2: Allow anonymous inserts (if using anon key)
-- This allows inserts from the Chrome extension using anonymous key
CREATE POLICY "Allow anonymous inserts" ON public.moderation_log
FOR INSERT
TO anon
WITH CHECK (true);

-- Option 3: Allow authenticated users to insert (if using auth)
-- This would require user authentication in the Chrome extension
CREATE POLICY "Allow authenticated inserts" ON public.moderation_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Option 4: Temporary disable RLS for testing (NOT recommended for production)
-- ALTER TABLE public.moderation_log DISABLE ROW LEVEL SECURITY;

-- Check if policies were created successfully
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'moderation_log';