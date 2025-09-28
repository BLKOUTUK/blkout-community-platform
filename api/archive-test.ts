// Test endpoint to verify archived_articles access
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({
        error: 'Missing Supabase credentials',
        supabaseUrl: !!supabaseUrl,
        supabaseServiceKey: !!supabaseServiceKey
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error, count } = await supabase
      .from('archived_articles')
      .select('id, title, excerpt', { count: 'exact' })
      .limit(5);

    return res.status(200).json({
      success: !error,
      error: error?.message,
      count,
      data: data?.slice(0, 3) || []
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}