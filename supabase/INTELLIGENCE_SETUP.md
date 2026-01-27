# IVOR Intelligence System Setup

## Overview

The IVOR Intelligence system aggregates community data from multiple sources into the `ivor_intelligence` table for consumption by AI agents.

## Intelligence Types

1. **member_activity** - Governance member participation and engagement
2. **resource_trends** - Popular resources, categories, access patterns
3. **content_performance** - Articles, events, content engagement metrics
4. **conversation_themes** - IVOR conversation patterns and trending topics
5. **governance_updates** - Proposals, votes, decisions, board activity

## Database Objects Created

### Tables
- `ivor_intelligence` - Main intelligence storage
- `ivor_intelligence_refresh_log` - Audit log for refresh operations

### Functions
- `aggregate_member_activity_intelligence()` - Aggregates governance member data
- `aggregate_resource_trends_intelligence()` - Aggregates resource/knowledge data
- `aggregate_content_performance_intelligence()` - Aggregates content metrics
- `aggregate_conversation_themes_intelligence()` - Aggregates IVOR conversation data
- `aggregate_governance_updates_intelligence()` - Aggregates governance activity
- `refresh_all_ivor_intelligence()` - Master refresh function
- `scheduled_intelligence_refresh()` - Wrapper for scheduled refresh with logging

### Views
- `current_ivor_intelligence` - Non-stale, non-expired intelligence feed
- `ivor_intelligence_summary` - Summary statistics by intelligence type

## Scheduled Refresh (4x Daily)

The system is designed to refresh at: **00:00, 06:00, 12:00, 18:00 UTC**

### Option 1: Supabase Edge Function + External Cron (Recommended)

1. Deploy the Edge Function:
```bash
cd apps/community-platform/supabase
supabase functions deploy refresh-intelligence --project-ref <your-project-ref>
```

2. Set up external cron (e.g., cron-job.org, EasyCron, or Vercel Cron):
```
Schedule: 0 0,6,12,18 * * *
URL: https://<project-ref>.supabase.co/functions/v1/refresh-intelligence
Headers:
  - Authorization: Bearer <SUPABASE_ANON_KEY>
  - x-cron-trigger: true
```

### Option 2: Vercel Cron (if using Vercel)

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/refresh-intelligence",
      "schedule": "0 0,6,12,18 * * *"
    }
  ]
}
```

Create `/api/cron/refresh-intelligence.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.rpc('refresh_all_ivor_intelligence');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, results: data }));
}
```

### Option 3: pg_cron (if enabled on Supabase)

Run this SQL (requires pg_cron extension):
```sql
SELECT cron.schedule(
  'intelligence-refresh-00',
  '0 0 * * *',
  $$SELECT scheduled_intelligence_refresh()$$
);

SELECT cron.schedule(
  'intelligence-refresh-06',
  '0 6 * * *',
  $$SELECT scheduled_intelligence_refresh()$$
);

SELECT cron.schedule(
  'intelligence-refresh-12',
  '0 12 * * *',
  $$SELECT scheduled_intelligence_refresh()$$
);

SELECT cron.schedule(
  'intelligence-refresh-18',
  '0 18 * * *',
  $$SELECT scheduled_intelligence_refresh()$$
);
```

## Manual Refresh

To manually trigger a refresh:

### Via SQL
```sql
SELECT * FROM refresh_all_ivor_intelligence();
```

### Via Edge Function
```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/refresh-intelligence \
  -H "Authorization: Bearer <SUPABASE_ANON_KEY>" \
  -H "Content-Type: application/json"
```

## Querying Intelligence

### Get current intelligence feed
```sql
SELECT * FROM current_ivor_intelligence;
```

### Get intelligence by type
```sql
SELECT * FROM ivor_intelligence
WHERE intelligence_type = 'governance_updates'
  AND is_stale = FALSE
ORDER BY created_at DESC
LIMIT 1;
```

### Get high priority intelligence
```sql
SELECT * FROM current_ivor_intelligence
WHERE priority IN ('critical', 'high')
ORDER BY relevance_score DESC;
```

### Check refresh history
```sql
SELECT * FROM ivor_intelligence_refresh_log
ORDER BY refresh_timestamp DESC
LIMIT 10;
```

## Source Tables

The intelligence system aggregates data from:

| Intelligence Type | Source Tables |
|-------------------|---------------|
| member_activity | governance_members, governance_votes, governance_proposals |
| resource_trends | knowledge_entries, knowledge_ratings |
| content_performance | voices_articles, events, moderation_queue |
| conversation_themes | ivor_feedback, ivor_conversations |
| governance_updates | governance_proposals, governance_votes, board_members, board_decisions |

## Lifecycle

1. Intelligence records expire after 6 hours (`expires_at`)
2. Expired records are marked as stale (`is_stale = TRUE`)
3. Stale records older than 7 days are automatically deleted
4. Each refresh creates new records rather than updating existing ones

## Monitoring

Check the refresh log for issues:
```sql
SELECT
  DATE(refresh_timestamp) as date,
  COUNT(*) as refresh_count,
  COUNT(*) FILTER (WHERE success = TRUE) as successful,
  AVG(duration_ms) as avg_duration_ms
FROM ivor_intelligence_refresh_log
GROUP BY DATE(refresh_timestamp)
ORDER BY date DESC;
```

## Troubleshooting

### No intelligence data
1. Check if source tables exist and have data
2. Run manual refresh: `SELECT * FROM refresh_all_ivor_intelligence();`
3. Check for errors in refresh log

### Stale data
1. Check refresh schedule is running
2. Verify Edge Function is deployed
3. Check refresh log for failed refreshes

### Performance issues
1. Add indexes on source tables if missing
2. Consider reducing refresh frequency
3. Archive old intelligence records more aggressively
