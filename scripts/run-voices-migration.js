#!/usr/bin/env node

/**
 * BLKOUT Voices Migration Runner
 * Applies the voices system database migration to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials!');
  console.error('   Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration() {
  console.log('🚀 BLKOUT Voices Migration Runner');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  try {
    // Read migration file
    const migrationPath = join(__dirname, '../database/migrations/002_voices_system.sql');
    console.log(`📄 Reading migration file: ${migrationPath}`);
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('✅ Migration file loaded successfully');
    console.log('');

    // Check if tables already exist
    console.log('🔍 Checking existing tables...');
    const { data: existingTables } = await supabase
      .from('article_pitches')
      .select('id')
      .limit(1);

    if (existingTables !== null) {
      console.log('⚠️  Tables already exist!');
      console.log('');
      console.log('Options:');
      console.log('  1. Tables are already migrated - you can skip this');
      console.log('  2. Run migration manually via Supabase SQL Editor');
      console.log('  3. Drop existing tables first (destructive!)');
      console.log('');
      console.log('To run migration via Supabase Dashboard:');
      console.log('  1. Go to: https://app.supabase.com/project/bgjengudzfickgomjqmz/sql');
      console.log('  2. Copy contents of: database/migrations/002_voices_system.sql');
      console.log('  3. Click "Run"');
      console.log('');
      return;
    }

    console.log('✅ Tables do not exist yet - proceeding with migration');
    console.log('');

    // Note: Supabase JS client doesn't support running raw SQL directly
    // We need to use the SQL Editor in the dashboard or use pg client
    console.log('📝 Migration Instructions:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('⚠️  The Supabase JS client cannot run raw SQL migrations.');
    console.log('   Please run the migration via one of these methods:');
    console.log('');
    console.log('Method 1: Supabase Dashboard (Recommended)');
    console.log('  1. Go to: https://app.supabase.com/project/bgjengudzfickgomjqmz/sql');
    console.log('  2. Create a new query');
    console.log('  3. Copy and paste the contents of:');
    console.log('     database/migrations/002_voices_system.sql');
    console.log('  4. Click "Run" or press Cmd/Ctrl + Enter');
    console.log('');
    console.log('Method 2: Supabase CLI (if installed)');
    console.log('  $ supabase db push');
    console.log('');
    console.log('Method 3: PostgreSQL psql (if you have connection string)');
    console.log('  $ psql $DATABASE_URL -f database/migrations/002_voices_system.sql');
    console.log('');
    console.log('Migration file location:');
    console.log(`  ${migrationPath}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error during migration check:', error.message);
    console.error('');
    console.error('Stack trace:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
