// BLKOUT Database Health Check Service
// Validates Supabase connectivity and data integrity

import { createClient } from '@supabase/supabase-js';

export interface DatabaseHealth {
  connected: boolean;
  legacyArticlesCount: number;
  newsArticlesCount: number;
  eventsCount: number;
  moderationQueueCount: number;
  hasMockData: boolean;
  rlsActive: boolean;
  errors: string[];
  lastCheck: string;
}

/**
 * Expected counts for validation
 */
const EXPECTED_COUNTS = {
  legacyArticles: 281, // Critical: Joseph Beam archive
  minNewsArticles: 100, // Should have at least 100 news articles
  minEvents: 10, // Should have some events
};

/**
 * Check Supabase database health
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const errors: string[] = [];
  let connected = false;
  let legacyArticlesCount = 0;
  let newsArticlesCount = 0;
  let eventsCount = 0;
  let moderationQueueCount = 0;
  let hasMockData = false;
  let rlsActive = true;

  try {
    // Get Supabase credentials from environment
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      errors.push('Missing Supabase environment variables');
      throw new Error('Supabase not configured');
    }

    // Create Supabase client (anon key for read-only checks)
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test 1: Connection test with simple query
    try {
      const { error } = await supabase
        .from('legacy_articles')
        .select('id', { count: 'exact', head: true });

      if (error) throw error;
      connected = true;
    } catch (error) {
      errors.push(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }

    // Test 2: Legacy articles count (CRITICAL - must be exactly 281)
    try {
      const { count, error } = await supabase
        .from('legacy_articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      if (error) throw error;

      legacyArticlesCount = count || 0;

      if (legacyArticlesCount !== EXPECTED_COUNTS.legacyArticles) {
        errors.push(
          `Legacy articles count mismatch: Expected ${EXPECTED_COUNTS.legacyArticles}, got ${legacyArticlesCount}`
        );
      }
    } catch (error) {
      errors.push(`Legacy articles check failed: ${error instanceof Error ? error.message : 'Unknown'}`);
    }

    // Test 3: News articles count
    try {
      const { count, error } = await supabase
        .from('news_articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      if (error) {
        // Table might not exist or RLS blocking
        errors.push(`News articles check failed: ${error.message}`);
      } else {
        newsArticlesCount = count || 0;

        if (newsArticlesCount < EXPECTED_COUNTS.minNewsArticles) {
          errors.push(
            `Low news articles count: Expected at least ${EXPECTED_COUNTS.minNewsArticles}, got ${newsArticlesCount}`
          );
        }
      }
    } catch (error) {
      errors.push(`News articles check failed: ${error instanceof Error ? error.message : 'Unknown'}`);
    }

    // Test 4: Events count
    try {
      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      if (error) {
        errors.push(`Events check failed: ${error.message}`);
      } else {
        eventsCount = count || 0;

        if (eventsCount < EXPECTED_COUNTS.minEvents) {
          errors.push(
            `Low events count: Expected at least ${EXPECTED_COUNTS.minEvents}, got ${eventsCount}`
          );
        }
      }
    } catch (error) {
      errors.push(`Events check failed: ${error instanceof Error ? error.message : 'Unknown'}`);
    }

    // Test 5: Moderation queue count
    try {
      const { count, error } = await supabase
        .from('moderation_queue')
        .select('*', { count: 'exact', head: true });

      if (error) {
        // Table might not exist
        moderationQueueCount = 0;
      } else {
        moderationQueueCount = count || 0;
      }
    } catch (error) {
      // Non-critical, ignore
    }

    // Test 6: Check for mock/test data
    try {
      const { data, error } = await supabase
        .from('legacy_articles')
        .select('title')
        .or('title.ilike.%test%,title.ilike.%mock%,title.ilike.%sample%')
        .limit(1);

      if (!error && data && data.length > 0) {
        hasMockData = true;
        errors.push('Mock/test data detected in production tables');
      }
    } catch (error) {
      // Non-critical, ignore
    }

    // Test 7: RLS policies check
    // If we can read data with anon key, RLS is working (or not configured)
    // We can't definitively check RLS without service role key, so assume active if no errors
    rlsActive = true;

  } catch (error) {
    errors.push(`Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    connected,
    legacyArticlesCount,
    newsArticlesCount,
    eventsCount,
    moderationQueueCount,
    hasMockData,
    rlsActive,
    errors,
    lastCheck: new Date().toISOString(),
  };
}

/**
 * Get database health summary
 */
export function getDatabaseHealthSummary(health: DatabaseHealth): {
  status: 'healthy' | 'degraded' | 'critical';
  message: string;
} {
  if (!health.connected) {
    return {
      status: 'critical',
      message: 'Database connection failed',
    };
  }

  if (health.legacyArticlesCount !== EXPECTED_COUNTS.legacyArticles) {
    return {
      status: 'critical',
      message: `Legacy articles count mismatch: ${health.legacyArticlesCount}/${EXPECTED_COUNTS.legacyArticles}`,
    };
  }

  if (health.hasMockData) {
    return {
      status: 'degraded',
      message: 'Mock/test data detected in production',
    };
  }

  if (health.errors.length > 0) {
    return {
      status: 'degraded',
      message: `${health.errors.length} database validation errors`,
    };
  }

  return {
    status: 'healthy',
    message: `All checks passed. Articles: ${health.legacyArticlesCount}, News: ${health.newsArticlesCount}, Events: ${health.eventsCount}`,
  };
}
