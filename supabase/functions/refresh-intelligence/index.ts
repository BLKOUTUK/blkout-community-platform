// IVOR Intelligence Refresh Edge Function
// Scheduled to run 4x daily: 00:00, 06:00, 12:00, 18:00 UTC
// Triggers the database function to aggregate intelligence from community data

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RefreshResult {
  type: string;
  id: string | null;
  status: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();

    // Create Supabase client with service role for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Determine trigger source
    let triggeredBy = 'api';
    const authHeader = req.headers.get('authorization');
    const cronHeader = req.headers.get('x-cron-trigger');

    if (cronHeader === 'true') {
      triggeredBy = 'scheduled';
    } else if (authHeader) {
      triggeredBy = 'manual';
    }

    console.log(`[Intelligence Refresh] Starting refresh, triggered by: ${triggeredBy}`);

    // Call the database function to refresh all intelligence
    const { data: refreshResults, error: refreshError } = await supabase
      .rpc('refresh_all_ivor_intelligence');

    if (refreshError) {
      console.error('[Intelligence Refresh] Error:', refreshError);
      throw refreshError;
    }

    const endTime = Date.now();
    const durationMs = endTime - startTime;

    // Log the refresh
    const { error: logError } = await supabase
      .from('ivor_intelligence_refresh_log')
      .insert({
        triggered_by: triggeredBy,
        results: refreshResults || [],
        duration_ms: durationMs,
        success: true,
      });

    if (logError) {
      console.warn('[Intelligence Refresh] Failed to log refresh:', logError);
    }

    // Prepare response summary
    const successCount = (refreshResults as RefreshResult[])?.filter(
      (r: RefreshResult) => r.status === 'success'
    ).length ?? 0;
    const totalCount = (refreshResults as RefreshResult[])?.length ?? 0;

    console.log(
      `[Intelligence Refresh] Completed: ${successCount}/${totalCount} successful in ${durationMs}ms`
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: `Intelligence refresh completed: ${successCount}/${totalCount} types refreshed`,
        triggered_by: triggeredBy,
        duration_ms: durationMs,
        results: refreshResults,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[Intelligence Refresh] Failed:', error);

    // Try to log the failure
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase.from('ivor_intelligence_refresh_log').insert({
          triggered_by: 'api',
          results: [],
          success: false,
          error_message: error instanceof Error ? error.message : String(error),
        });
      }
    } catch (logError) {
      console.error('[Intelligence Refresh] Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});
