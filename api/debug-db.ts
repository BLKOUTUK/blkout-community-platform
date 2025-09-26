// Debug endpoint to test database connectivity
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('🔍 Debug DB Connection:');
    console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.log('- SUPABASE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing Supabase configuration',
        debug: {
          supabaseUrl: !!supabaseUrl,
          supabaseKey: !!supabaseKey,
          env: process.env.NODE_ENV
        }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Basic connection
    console.log('🔍 Testing basic Supabase connection...');

    // Test 2: List tables (if possible)
    console.log('🔍 Testing moderation_log table access...');
    const { data: tableData, error: tableError } = await supabase
      .from('moderation_log')
      .select('id, created_at, action')
      .limit(5);

    if (tableError) {
      console.error('❌ Table access error:', tableError);
      return res.status(500).json({
        success: false,
        error: 'Database table access failed',
        supabaseError: tableError,
        debug: {
          supabaseUrl: !!supabaseUrl,
          supabaseKey: !!supabaseKey,
          tableName: 'moderation_log'
        }
      });
    }

    console.log('✅ Database connection successful!');
    console.log('✅ Found', tableData?.length || 0, 'records in moderation_log');

    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      data: {
        recordCount: tableData?.length || 0,
        records: tableData || [],
        timestamp: new Date().toISOString()
      },
      debug: {
        supabaseConfigured: true,
        tableAccessible: true
      }
    });

  } catch (error) {
    console.error('❌ Debug DB error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        stack: error instanceof Error ? error.stack : undefined
      }
    });
  }
}