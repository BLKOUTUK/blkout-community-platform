// Simple test to verify events query works
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey,
      urlPrefix: supabaseUrl?.substring(0, 30)
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.json({ error: 'Missing env vars', hasUrl: !!supabaseUrl, hasKey: !!supabaseServiceKey });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Simple query to test connection
    const { data, error, count } = await supabase
      .from('events')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .limit(5);

    console.log('Query result:', {
      success: !error,
      count,
      eventCount: data?.length,
      error: error?.message
    });

    return res.json({
      success: !error,
      error: error?.message,
      count,
      eventCount: data?.length,
      sampleEvents: data?.slice(0, 2).map(e => ({
        id: e.id,
        title: e.title,
        date: e.date,
        status: e.status
      }))
    });

  } catch (error: any) {
    console.error('Test API error:', error);
    return res.json({ error: error.message });
  }
}