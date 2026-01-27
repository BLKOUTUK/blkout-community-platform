-- IVOR Intelligence Table Migration
-- Date: January 27, 2026
-- Description: Creates the ivor_intelligence table for self-improving IVOR system
-- Aggregates community data from multiple sources for AI agent consumption

-- ============================================================================
-- 1. IVOR INTELLIGENCE TABLE
-- Core table for aggregated community intelligence
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ivor_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Intelligence classification
  intelligence_type VARCHAR(50) NOT NULL CHECK (intelligence_type IN (
    'member_activity',      -- Governance member participation and engagement
    'resource_trends',      -- Popular resources, categories, access patterns
    'content_performance',  -- Articles, events, content engagement metrics
    'conversation_themes',  -- IVOR conversation patterns and trending topics
    'governance_updates'    -- Proposals, votes, decisions, board activity
  )),

  -- Source tracking
  ivor_service VARCHAR(50) NOT NULL DEFAULT 'community-platform',
  ivor_endpoint VARCHAR(200),
  source_tables TEXT[], -- Which tables contributed to this intelligence

  -- Intelligence payload
  intelligence_data JSONB NOT NULL DEFAULT '{}', -- Raw aggregated data
  summary TEXT NOT NULL, -- Human-readable summary
  key_insights TEXT[], -- Array of specific insights
  actionable_items TEXT[], -- Suggested actions for agents

  -- Scoring and prioritization
  relevance_score INTEGER CHECK (relevance_score >= 0 AND relevance_score <= 100),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  urgency VARCHAR(20) DEFAULT 'normal' CHECK (urgency IN ('immediate', 'elevated', 'normal', 'deferred')),

  -- Lifecycle management
  data_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When the underlying data was current
  expires_at TIMESTAMPTZ, -- When this intelligence becomes stale
  is_stale BOOLEAN DEFAULT FALSE,

  -- Usage tracking
  times_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  used_in_content_ids UUID[], -- References to content that used this intelligence

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_ivor_intelligence_type ON public.ivor_intelligence(intelligence_type);
CREATE INDEX IF NOT EXISTS idx_ivor_intelligence_priority ON public.ivor_intelligence(priority);
CREATE INDEX IF NOT EXISTS idx_ivor_intelligence_relevance ON public.ivor_intelligence(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_ivor_intelligence_expires ON public.ivor_intelligence(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ivor_intelligence_stale ON public.ivor_intelligence(is_stale) WHERE is_stale = FALSE;
CREATE INDEX IF NOT EXISTS idx_ivor_intelligence_created ON public.ivor_intelligence(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ivor_intelligence_tags ON public.ivor_intelligence USING GIN(tags);

-- Enable RLS
ALTER TABLE public.ivor_intelligence ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role full access to ivor_intelligence"
  ON public.ivor_intelligence FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can read ivor_intelligence"
  ON public.ivor_intelligence FOR SELECT
  TO authenticated
  USING (TRUE);

-- ============================================================================
-- 2. INTELLIGENCE AGGREGATION FUNCTIONS
-- Functions to gather and refresh intelligence from source tables
-- ============================================================================

-- Function: Aggregate Member Activity Intelligence
CREATE OR REPLACE FUNCTION aggregate_member_activity_intelligence()
RETURNS UUID AS $$
DECLARE
  new_id UUID;
  active_count INTEGER;
  voting_count INTEGER;
  proposer_count INTEGER;
  recent_votes INTEGER;
  recent_proposals INTEGER;
  insights TEXT[];
  actions TEXT[];
  data_json JSONB;
BEGIN
  -- Count active governance members
  SELECT COUNT(*) INTO active_count
  FROM governance_members
  WHERE membership_status = 'active';

  -- Count members who can vote
  SELECT COUNT(*) INTO voting_count
  FROM governance_members
  WHERE membership_status = 'active' AND can_vote = TRUE;

  -- Count members who can propose
  SELECT COUNT(*) INTO proposer_count
  FROM governance_members
  WHERE membership_status = 'active' AND can_propose = TRUE;

  -- Count votes in last 7 days
  SELECT COUNT(*) INTO recent_votes
  FROM governance_votes
  WHERE voted_at > NOW() - INTERVAL '7 days';

  -- Count proposals in last 30 days
  SELECT COUNT(*) INTO recent_proposals
  FROM governance_proposals
  WHERE created_at > NOW() - INTERVAL '30 days';

  -- Build insights array
  insights := ARRAY[
    format('Currently %s active governance members', active_count),
    format('%s members have voting rights, %s can propose', voting_count, proposer_count),
    format('%s votes cast in the past week', recent_votes),
    format('%s new proposals in the past month', recent_proposals)
  ];

  -- Build actionable items
  actions := ARRAY[
    CASE WHEN recent_votes < 5 THEN 'Low voting activity - consider governance engagement reminder' ELSE NULL END,
    CASE WHEN active_count < 10 THEN 'Low active member count - prioritize member activation' ELSE NULL END,
    CASE WHEN proposer_count < 3 THEN 'Few proposers available - consider expanding proposal rights' ELSE NULL END
  ];
  actions := array_remove(actions, NULL);

  -- Build data JSON
  data_json := jsonb_build_object(
    'active_members', active_count,
    'voting_members', voting_count,
    'proposer_members', proposer_count,
    'recent_votes_7d', recent_votes,
    'recent_proposals_30d', recent_proposals,
    'participation_rate', CASE WHEN active_count > 0
      THEN ROUND((recent_votes::NUMERIC / active_count * 100), 1)
      ELSE 0 END
  );

  -- Insert intelligence record
  INSERT INTO ivor_intelligence (
    intelligence_type,
    ivor_service,
    ivor_endpoint,
    source_tables,
    intelligence_data,
    summary,
    key_insights,
    actionable_items,
    relevance_score,
    priority,
    urgency,
    expires_at,
    tags
  ) VALUES (
    'member_activity',
    'community-platform',
    '/api/governance/members',
    ARRAY['governance_members', 'governance_votes', 'governance_proposals'],
    data_json,
    format('Member activity: %s active members, %s votes this week, %s proposals this month',
           active_count, recent_votes, recent_proposals),
    insights,
    actions,
    CASE
      WHEN recent_votes > 10 THEN 90
      WHEN recent_votes > 5 THEN 75
      ELSE 60
    END,
    CASE WHEN recent_votes < 3 THEN 'high' ELSE 'medium' END,
    'normal',
    NOW() + INTERVAL '6 hours',
    ARRAY['member-activity', 'governance', 'participation', 'weekly']
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Aggregate Resource Trends Intelligence
CREATE OR REPLACE FUNCTION aggregate_resource_trends_intelligence()
RETURNS UUID AS $$
DECLARE
  new_id UUID;
  total_resources INTEGER;
  recent_additions INTEGER;
  top_category TEXT;
  avg_trust_score NUMERIC;
  insights TEXT[];
  actions TEXT[];
  data_json JSONB;
BEGIN
  -- Note: These queries depend on tables that may or may not exist
  -- Using safe defaults if tables don't exist

  -- Try to get resource counts from knowledge_entries or ivor_resources
  BEGIN
    SELECT COUNT(*) INTO total_resources FROM knowledge_entries;
    SELECT COUNT(*) INTO recent_additions FROM knowledge_entries
    WHERE created_at > NOW() - INTERVAL '7 days';
    SELECT AVG(trust_score) INTO avg_trust_score FROM knowledge_entries;
    top_category := 'General Resources';
  EXCEPTION WHEN undefined_table THEN
    total_resources := 0;
    recent_additions := 0;
    avg_trust_score := 0.5;
    top_category := 'Not Available';
  END;

  -- Build insights
  insights := ARRAY[
    format('%s total knowledge resources available', total_resources),
    format('%s new resources added in the past week', recent_additions),
    format('Average trust score: %s', COALESCE(ROUND(avg_trust_score::NUMERIC, 2), 0.5))
  ];

  -- Build actions
  actions := ARRAY[
    CASE WHEN recent_additions = 0 THEN 'No new resources this week - review resource curation' ELSE NULL END,
    CASE WHEN avg_trust_score < 0.6 THEN 'Average trust score low - prioritize verification' ELSE NULL END
  ];
  actions := array_remove(actions, NULL);

  -- Build data JSON
  data_json := jsonb_build_object(
    'total_resources', total_resources,
    'recent_additions_7d', recent_additions,
    'top_category', top_category,
    'avg_trust_score', COALESCE(ROUND(avg_trust_score::NUMERIC, 2), 0.5)
  );

  -- Insert intelligence record
  INSERT INTO ivor_intelligence (
    intelligence_type,
    ivor_service,
    ivor_endpoint,
    source_tables,
    intelligence_data,
    summary,
    key_insights,
    actionable_items,
    relevance_score,
    priority,
    expires_at,
    tags
  ) VALUES (
    'resource_trends',
    'ivor-core',
    '/api/resources/trends',
    ARRAY['knowledge_entries', 'knowledge_ratings'],
    data_json,
    format('Resource trends: %s total resources, %s added this week, trust score %s',
           total_resources, recent_additions, COALESCE(ROUND(avg_trust_score::NUMERIC, 2), 0.5)),
    insights,
    actions,
    CASE WHEN recent_additions > 5 THEN 85 ELSE 65 END,
    'medium',
    NOW() + INTERVAL '6 hours',
    ARRAY['resources', 'knowledge', 'trending', 'trust']
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Aggregate Content Performance Intelligence
CREATE OR REPLACE FUNCTION aggregate_content_performance_intelligence()
RETURNS UUID AS $$
DECLARE
  new_id UUID;
  articles_count INTEGER;
  published_count INTEGER;
  featured_count INTEGER;
  events_count INTEGER;
  upcoming_events INTEGER;
  top_category TEXT;
  insights TEXT[];
  actions TEXT[];
  data_json JSONB;
BEGIN
  -- Count articles from voices_articles
  SELECT COUNT(*) INTO articles_count FROM voices_articles;
  SELECT COUNT(*) INTO published_count FROM voices_articles WHERE published = TRUE;
  SELECT COUNT(*) INTO featured_count FROM voices_articles WHERE featured = TRUE;

  -- Get top category
  SELECT category INTO top_category FROM voices_articles
  WHERE published = TRUE
  GROUP BY category
  ORDER BY COUNT(*) DESC
  LIMIT 1;

  -- Count events
  BEGIN
    SELECT COUNT(*) INTO events_count FROM events WHERE status = 'approved';
    SELECT COUNT(*) INTO upcoming_events FROM events
    WHERE status = 'approved' AND date >= CURRENT_DATE;
  EXCEPTION WHEN undefined_table THEN
    events_count := 0;
    upcoming_events := 0;
  END;

  -- Build insights
  insights := ARRAY[
    format('%s published articles, %s featured', published_count, featured_count),
    format('Top performing category: %s', COALESCE(top_category, 'None')),
    format('%s approved events, %s upcoming', events_count, upcoming_events)
  ];

  -- Build actions
  actions := ARRAY[
    CASE WHEN featured_count = 0 THEN 'No featured content - curate featured articles' ELSE NULL END,
    CASE WHEN upcoming_events < 3 THEN 'Few upcoming events - boost event discovery' ELSE NULL END
  ];
  actions := array_remove(actions, NULL);

  -- Build data JSON
  data_json := jsonb_build_object(
    'total_articles', articles_count,
    'published_articles', published_count,
    'featured_articles', featured_count,
    'top_category', COALESCE(top_category, 'None'),
    'total_events', events_count,
    'upcoming_events', upcoming_events
  );

  -- Insert intelligence record
  INSERT INTO ivor_intelligence (
    intelligence_type,
    ivor_service,
    ivor_endpoint,
    source_tables,
    intelligence_data,
    summary,
    key_insights,
    actionable_items,
    relevance_score,
    priority,
    expires_at,
    tags
  ) VALUES (
    'content_performance',
    'community-platform',
    '/api/content/performance',
    ARRAY['voices_articles', 'events', 'moderation_queue'],
    data_json,
    format('Content performance: %s published articles, %s upcoming events, top category: %s',
           published_count, upcoming_events, COALESCE(top_category, 'None')),
    insights,
    actions,
    CASE WHEN published_count > 10 THEN 80 ELSE 60 END,
    'medium',
    NOW() + INTERVAL '6 hours',
    ARRAY['content', 'articles', 'events', 'performance']
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Aggregate Conversation Themes Intelligence
CREATE OR REPLACE FUNCTION aggregate_conversation_themes_intelligence()
RETURNS UUID AS $$
DECLARE
  new_id UUID;
  total_feedback INTEGER;
  positive_feedback INTEGER;
  avg_rating NUMERIC;
  recent_sessions INTEGER;
  insights TEXT[];
  actions TEXT[];
  data_json JSONB;
BEGIN
  -- Get feedback stats from ivor_feedback
  BEGIN
    SELECT COUNT(*) INTO total_feedback FROM ivor_feedback;
    SELECT COUNT(*) INTO positive_feedback FROM ivor_feedback WHERE user_rating >= 4;
    SELECT AVG(user_rating) INTO avg_rating FROM ivor_feedback WHERE user_rating IS NOT NULL;
    SELECT COUNT(DISTINCT session_id) INTO recent_sessions FROM ivor_feedback
    WHERE created_at > NOW() - INTERVAL '7 days';
  EXCEPTION WHEN undefined_table THEN
    total_feedback := 0;
    positive_feedback := 0;
    avg_rating := 0;
    recent_sessions := 0;
  END;

  -- Build insights
  insights := ARRAY[
    format('%s total IVOR conversations recorded', total_feedback),
    format('%s sessions in the past week', recent_sessions),
    format('Average user rating: %s/5', COALESCE(ROUND(avg_rating, 1), 0)),
    format('Positive feedback rate: %s%%',
           CASE WHEN total_feedback > 0
             THEN ROUND((positive_feedback::NUMERIC / total_feedback * 100), 1)
             ELSE 0 END)
  ];

  -- Build actions
  actions := ARRAY[
    CASE WHEN avg_rating < 3.5 THEN 'User satisfaction below target - review IVOR responses' ELSE NULL END,
    CASE WHEN recent_sessions < 5 THEN 'Low IVOR usage - promote chatbot features' ELSE NULL END
  ];
  actions := array_remove(actions, NULL);

  -- Build data JSON
  data_json := jsonb_build_object(
    'total_conversations', total_feedback,
    'recent_sessions_7d', recent_sessions,
    'average_rating', COALESCE(ROUND(avg_rating, 2), 0),
    'positive_feedback_count', positive_feedback,
    'satisfaction_rate', CASE WHEN total_feedback > 0
      THEN ROUND((positive_feedback::NUMERIC / total_feedback * 100), 1)
      ELSE 0 END
  );

  -- Insert intelligence record
  INSERT INTO ivor_intelligence (
    intelligence_type,
    ivor_service,
    ivor_endpoint,
    source_tables,
    intelligence_data,
    summary,
    key_insights,
    actionable_items,
    relevance_score,
    priority,
    expires_at,
    tags
  ) VALUES (
    'conversation_themes',
    'ivor-core',
    '/api/conversations/themes',
    ARRAY['ivor_feedback', 'ivor_conversations'],
    data_json,
    format('Conversation themes: %s sessions this week, %s avg rating, %s%% positive',
           recent_sessions, COALESCE(ROUND(avg_rating, 1), 0),
           CASE WHEN total_feedback > 0
             THEN ROUND((positive_feedback::NUMERIC / total_feedback * 100), 1)
             ELSE 0 END),
    insights,
    actions,
    CASE WHEN recent_sessions > 10 THEN 85 ELSE 55 END,
    'medium',
    NOW() + INTERVAL '6 hours',
    ARRAY['conversations', 'ivor', 'feedback', 'themes']
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Aggregate Governance Updates Intelligence
CREATE OR REPLACE FUNCTION aggregate_governance_updates_intelligence()
RETURNS UUID AS $$
DECLARE
  new_id UUID;
  active_proposals INTEGER;
  passed_proposals INTEGER;
  pending_votes INTEGER;
  board_members INTEGER;
  recent_decisions INTEGER;
  urgent_deadlines TEXT[];
  insights TEXT[];
  actions TEXT[];
  data_json JSONB;
BEGIN
  -- Get governance stats
  SELECT COUNT(*) INTO active_proposals FROM governance_proposals WHERE status = 'active';
  SELECT COUNT(*) INTO passed_proposals FROM governance_proposals WHERE passed = TRUE;

  -- Get pending votes (proposals open for voting)
  SELECT COUNT(*) INTO pending_votes FROM governance_proposals
  WHERE status = 'active' AND voting_deadline > NOW();

  -- Get board members count
  BEGIN
    SELECT COUNT(*) INTO board_members FROM board_members WHERE is_active = TRUE;
    SELECT COUNT(*) INTO recent_decisions FROM board_decisions
    WHERE decision_date > NOW() - INTERVAL '30 days';
  EXCEPTION WHEN undefined_table THEN
    board_members := 0;
    recent_decisions := 0;
  END;

  -- Find urgent deadlines (voting ends within 48 hours)
  SELECT ARRAY_AGG(title) INTO urgent_deadlines
  FROM governance_proposals
  WHERE status = 'active'
    AND voting_deadline BETWEEN NOW() AND NOW() + INTERVAL '48 hours';

  -- Build insights
  insights := ARRAY[
    format('%s active proposals, %s passed historically', active_proposals, passed_proposals),
    format('%s proposals currently open for voting', pending_votes),
    format('%s active board members', board_members),
    format('%s board decisions in the past 30 days', recent_decisions)
  ];

  IF urgent_deadlines IS NOT NULL AND array_length(urgent_deadlines, 1) > 0 THEN
    insights := insights || format('URGENT: %s proposals closing within 48 hours', array_length(urgent_deadlines, 1));
  END IF;

  -- Build actions
  actions := ARRAY[
    CASE WHEN pending_votes > 0 THEN format('Remind community: %s proposals need votes', pending_votes) ELSE NULL END,
    CASE WHEN urgent_deadlines IS NOT NULL AND array_length(urgent_deadlines, 1) > 0
      THEN 'Send urgent voting deadline reminder' ELSE NULL END,
    CASE WHEN active_proposals = 0 THEN 'No active proposals - encourage community proposals' ELSE NULL END
  ];
  actions := array_remove(actions, NULL);

  -- Build data JSON
  data_json := jsonb_build_object(
    'active_proposals', active_proposals,
    'passed_proposals', passed_proposals,
    'pending_votes', pending_votes,
    'board_members', board_members,
    'recent_decisions_30d', recent_decisions,
    'urgent_deadlines', COALESCE(urgent_deadlines, ARRAY[]::TEXT[])
  );

  -- Insert intelligence record
  INSERT INTO ivor_intelligence (
    intelligence_type,
    ivor_service,
    ivor_endpoint,
    source_tables,
    intelligence_data,
    summary,
    key_insights,
    actionable_items,
    relevance_score,
    priority,
    urgency,
    expires_at,
    tags
  ) VALUES (
    'governance_updates',
    'community-platform',
    '/api/governance/updates',
    ARRAY['governance_proposals', 'governance_votes', 'board_members', 'board_decisions'],
    data_json,
    format('Governance: %s active proposals, %s open for voting, %s board members',
           active_proposals, pending_votes, board_members),
    insights,
    actions,
    CASE
      WHEN urgent_deadlines IS NOT NULL AND array_length(urgent_deadlines, 1) > 0 THEN 95
      WHEN pending_votes > 0 THEN 80
      ELSE 60
    END,
    CASE
      WHEN urgent_deadlines IS NOT NULL AND array_length(urgent_deadlines, 1) > 0 THEN 'critical'
      WHEN pending_votes > 3 THEN 'high'
      ELSE 'medium'
    END,
    CASE
      WHEN urgent_deadlines IS NOT NULL AND array_length(urgent_deadlines, 1) > 0 THEN 'immediate'
      ELSE 'normal'
    END,
    NOW() + INTERVAL '6 hours',
    ARRAY['governance', 'proposals', 'voting', 'board', 'democracy']
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. MASTER REFRESH FUNCTION
-- Orchestrates all intelligence aggregation
-- ============================================================================

CREATE OR REPLACE FUNCTION refresh_all_ivor_intelligence()
RETURNS TABLE (
  intelligence_type TEXT,
  new_id UUID,
  status TEXT
) AS $$
DECLARE
  member_id UUID;
  resource_id UUID;
  content_id UUID;
  conversation_id UUID;
  governance_id UUID;
BEGIN
  -- Mark existing intelligence as stale before refresh
  UPDATE ivor_intelligence
  SET is_stale = TRUE, updated_at = NOW()
  WHERE is_stale = FALSE AND expires_at < NOW();

  -- Aggregate each intelligence type
  BEGIN
    SELECT aggregate_member_activity_intelligence() INTO member_id;
    RETURN QUERY SELECT 'member_activity'::TEXT, member_id, 'success'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'member_activity'::TEXT, NULL::UUID, format('error: %s', SQLERRM)::TEXT;
  END;

  BEGIN
    SELECT aggregate_resource_trends_intelligence() INTO resource_id;
    RETURN QUERY SELECT 'resource_trends'::TEXT, resource_id, 'success'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'resource_trends'::TEXT, NULL::UUID, format('error: %s', SQLERRM)::TEXT;
  END;

  BEGIN
    SELECT aggregate_content_performance_intelligence() INTO content_id;
    RETURN QUERY SELECT 'content_performance'::TEXT, content_id, 'success'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'content_performance'::TEXT, NULL::UUID, format('error: %s', SQLERRM)::TEXT;
  END;

  BEGIN
    SELECT aggregate_conversation_themes_intelligence() INTO conversation_id;
    RETURN QUERY SELECT 'conversation_themes'::TEXT, conversation_id, 'success'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'conversation_themes'::TEXT, NULL::UUID, format('error: %s', SQLERRM)::TEXT;
  END;

  BEGIN
    SELECT aggregate_governance_updates_intelligence() INTO governance_id;
    RETURN QUERY SELECT 'governance_updates'::TEXT, governance_id, 'success'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'governance_updates'::TEXT, NULL::UUID, format('error: %s', SQLERRM)::TEXT;
  END;

  -- Cleanup old stale intelligence (older than 7 days)
  DELETE FROM ivor_intelligence
  WHERE is_stale = TRUE AND updated_at < NOW() - INTERVAL '7 days';

  RETURN;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. REFRESH LOG TABLE
-- Track intelligence refresh executions
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ivor_intelligence_refresh_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  refresh_timestamp TIMESTAMPTZ DEFAULT NOW(),
  triggered_by VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'manual', 'api'
  results JSONB NOT NULL DEFAULT '{}',
  duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intelligence_refresh_log_timestamp
  ON public.ivor_intelligence_refresh_log(refresh_timestamp DESC);

-- Enable RLS
ALTER TABLE public.ivor_intelligence_refresh_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to refresh_log"
  ON public.ivor_intelligence_refresh_log FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can read refresh_log"
  ON public.ivor_intelligence_refresh_log FOR SELECT
  TO authenticated
  USING (TRUE);

-- ============================================================================
-- 5. SCHEDULED REFRESH FUNCTION (for pg_cron or external scheduler)
-- Designed to be called 4x daily at 00:00, 06:00, 12:00, 18:00 UTC
-- ============================================================================

CREATE OR REPLACE FUNCTION scheduled_intelligence_refresh()
RETURNS VOID AS $$
DECLARE
  start_time TIMESTAMPTZ;
  end_time TIMESTAMPTZ;
  refresh_results JSONB;
  duration INTEGER;
BEGIN
  start_time := NOW();

  -- Run the refresh
  SELECT jsonb_agg(jsonb_build_object(
    'type', intelligence_type,
    'id', new_id::TEXT,
    'status', status
  ))
  INTO refresh_results
  FROM refresh_all_ivor_intelligence();

  end_time := NOW();
  duration := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;

  -- Log the refresh
  INSERT INTO ivor_intelligence_refresh_log (
    triggered_by,
    results,
    duration_ms,
    success
  ) VALUES (
    'scheduled',
    COALESCE(refresh_results, '[]'::JSONB),
    duration,
    TRUE
  );

EXCEPTION WHEN OTHERS THEN
  -- Log the error
  INSERT INTO ivor_intelligence_refresh_log (
    triggered_by,
    results,
    success,
    error_message
  ) VALUES (
    'scheduled',
    '[]'::JSONB,
    FALSE,
    SQLERRM
  );
  RAISE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. USEFUL VIEWS
-- ============================================================================

-- View: Current (non-stale) intelligence feed
CREATE OR REPLACE VIEW current_ivor_intelligence AS
SELECT
  id,
  intelligence_type,
  summary,
  key_insights,
  actionable_items,
  relevance_score,
  priority,
  urgency,
  data_timestamp,
  expires_at,
  times_used,
  tags,
  created_at
FROM ivor_intelligence
WHERE is_stale = FALSE
  AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY
  CASE priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  relevance_score DESC,
  created_at DESC;

-- View: Intelligence summary by type
CREATE OR REPLACE VIEW ivor_intelligence_summary AS
SELECT
  intelligence_type,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE is_stale = FALSE) as active_records,
  AVG(relevance_score) as avg_relevance,
  MAX(created_at) as latest_refresh,
  SUM(times_used) as total_usage
FROM ivor_intelligence
GROUP BY intelligence_type
ORDER BY total_records DESC;

-- ============================================================================
-- 7. INITIAL DATA POPULATION
-- Run the first refresh to populate with current data
-- ============================================================================

-- Run initial refresh
SELECT * FROM refresh_all_ivor_intelligence();

-- ============================================================================
-- 8. TRIGGER FOR updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_ivor_intelligence_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ivor_intelligence_updated_at
  BEFORE UPDATE ON public.ivor_intelligence
  FOR EACH ROW
  EXECUTE FUNCTION update_ivor_intelligence_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.ivor_intelligence IS
'Aggregated community intelligence for IVOR AI assistant.
Refreshed 4x daily (00:00, 06:00, 12:00, 18:00 UTC).
Contains: member_activity, resource_trends, content_performance,
conversation_themes, governance_updates.';

COMMENT ON FUNCTION refresh_all_ivor_intelligence IS
'Master function to refresh all intelligence types.
Returns status for each type. Should be called by scheduler 4x daily.';

COMMENT ON FUNCTION scheduled_intelligence_refresh IS
'Wrapper for scheduled refresh with logging.
Designed for pg_cron: SELECT cron.schedule(''intelligence-refresh'', ''0 0,6,12,18 * * *'', $$SELECT scheduled_intelligence_refresh()$$);';

COMMENT ON TABLE public.ivor_intelligence_refresh_log IS
'Audit log for intelligence refresh operations.
Tracks timing, success/failure, and results.';
