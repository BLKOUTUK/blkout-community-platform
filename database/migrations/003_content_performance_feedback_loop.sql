-- BLKOUT Liberation Platform - Content Performance & Feedback Loop Schema
-- Phase 3.1: Self-improving system metrics and intelligence adjustment
-- Tracks content performance to optimize IVOR recommendations

-- ============================================================================
-- CONTENT PERFORMANCE METRICS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Content identification
    content_type TEXT NOT NULL CHECK (content_type IN ('newsletter', 'article', 'social', 'event', 'resource', 'announcement')),
    content_id UUID NOT NULL,

    -- Performance metrics
    metric_type TEXT NOT NULL CHECK (metric_type IN (
        'opens', 'clicks', 'approvals', 'rejections', 'engagement',
        'shares', 'views', 'time_spent', 'completions', 'feedback_positive',
        'feedback_negative', 'ivor_recommendations', 'conversions'
    )),
    metric_value NUMERIC NOT NULL DEFAULT 0,

    -- Tracking metadata
    measured_at TIMESTAMPTZ DEFAULT NOW(),
    measurement_period TEXT CHECK (measurement_period IN ('hourly', 'daily', 'weekly', 'monthly')),

    -- Extended metadata (flexible JSON for additional context)
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Attribution tracking
    source TEXT, -- Where the metric came from (email, social, direct, ivor)
    campaign_id UUID, -- If part of a campaign
    agent_id UUID, -- Which agent/system generated this content

    -- Indexes for common queries
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Composite uniqueness for time-series metrics
    UNIQUE(content_type, content_id, metric_type, measurement_period, measured_at)
);

-- ============================================================================
-- AGENT QUALITY SCORES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_quality_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Agent identification
    agent_id UUID NOT NULL,
    agent_type TEXT NOT NULL CHECK (agent_type IN (
        'newsletter_curator', 'social_media_manager', 'content_classifier',
        'trend_analyzer', 'event_recommender', 'ivor_responder', 'moderation_reviewer'
    )),
    agent_name TEXT,

    -- Quality metrics
    approval_rate NUMERIC CHECK (approval_rate >= 0 AND approval_rate <= 1),
    rejection_rate NUMERIC CHECK (rejection_rate >= 0 AND rejection_rate <= 1),
    engagement_score NUMERIC CHECK (engagement_score >= 0 AND engagement_score <= 1),
    accuracy_score NUMERIC CHECK (accuracy_score >= 0 AND accuracy_score <= 1),
    liberation_alignment_score NUMERIC CHECK (liberation_alignment_score >= 0 AND liberation_alignment_score <= 1),
    cultural_sensitivity_score NUMERIC CHECK (cultural_sensitivity_score >= 0 AND cultural_sensitivity_score <= 1),

    -- Performance tracking
    total_items_processed INTEGER DEFAULT 0,
    total_approvals INTEGER DEFAULT 0,
    total_rejections INTEGER DEFAULT 0,
    total_modifications INTEGER DEFAULT 0,

    -- Trend analysis
    performance_trend TEXT CHECK (performance_trend IN ('improving', 'stable', 'declining', 'volatile')),
    trend_confidence NUMERIC CHECK (trend_confidence >= 0 AND trend_confidence <= 1),

    -- Learning metadata
    last_retrained_at TIMESTAMPTZ,
    training_data_size INTEGER,
    model_version TEXT,

    -- Period tracking
    score_period TEXT CHECK (score_period IN ('daily', 'weekly', 'monthly', 'all_time')) DEFAULT 'weekly',
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Unique constraint for agent scores per period
    UNIQUE(agent_id, agent_type, score_period, period_start)
);

-- ============================================================================
-- IVOR INTELLIGENCE TABLE (for feedback loop adjustments)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivor_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Content reference
    content_type TEXT NOT NULL,
    content_id UUID NOT NULL,

    -- Intelligence scores
    relevance_score NUMERIC NOT NULL DEFAULT 0.5 CHECK (relevance_score >= 0 AND relevance_score <= 1),
    quality_score NUMERIC DEFAULT 0.5 CHECK (quality_score >= 0 AND quality_score <= 1),
    engagement_prediction NUMERIC DEFAULT 0.5 CHECK (engagement_prediction >= 0 AND engagement_prediction <= 1),

    -- Liberation values alignment
    liberation_alignment NUMERIC DEFAULT 0.5 CHECK (liberation_alignment >= 0 AND liberation_alignment <= 1),
    community_relevance NUMERIC DEFAULT 0.5 CHECK (community_relevance >= 0 AND community_relevance <= 1),
    cultural_authenticity NUMERIC DEFAULT 0.5 CHECK (cultural_authenticity >= 0 AND cultural_authenticity <= 1),

    -- Recommendation tracking
    times_recommended INTEGER DEFAULT 0,
    times_clicked INTEGER DEFAULT 0,
    times_shared INTEGER DEFAULT 0,
    times_engaged INTEGER DEFAULT 0,

    -- Feedback loop data
    user_feedback_score NUMERIC CHECK (user_feedback_score >= -1 AND user_feedback_score <= 1),
    feedback_count INTEGER DEFAULT 0,
    last_feedback_at TIMESTAMPTZ,

    -- Auto-adjustment tracking
    score_adjustments INTEGER DEFAULT 0,
    last_adjustment_at TIMESTAMPTZ,
    adjustment_history JSONB DEFAULT '[]'::jsonb,

    -- Content metadata
    content_tags TEXT[],
    content_categories TEXT[],
    target_audiences TEXT[],

    -- Status
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Unique constraint
    UNIQUE(content_type, content_id)
);

-- ============================================================================
-- FEEDBACK LOOP EVENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS feedback_loop_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Event type
    event_type TEXT NOT NULL CHECK (event_type IN (
        'relevance_boost', 'relevance_reduction', 'quality_update',
        'agent_retrain_trigger', 'threshold_alert', 'performance_milestone',
        'content_expiry', 'trend_detected', 'anomaly_detected'
    )),

    -- Event details
    source_table TEXT NOT NULL,
    source_id UUID NOT NULL,
    previous_value NUMERIC,
    new_value NUMERIC,
    change_amount NUMERIC,
    change_reason TEXT,

    -- Trigger information
    triggered_by TEXT, -- 'system', 'admin', 'scheduled', 'metric_threshold'
    trigger_metric TEXT,
    trigger_threshold NUMERIC,

    -- Context
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NEWSLETTER PERFORMANCE TRACKING TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS newsletter_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Newsletter identification
    newsletter_id UUID NOT NULL,
    newsletter_name TEXT,
    send_date TIMESTAMPTZ,

    -- Delivery metrics
    total_sent INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,
    total_bounced INTEGER DEFAULT 0,
    delivery_rate NUMERIC GENERATED ALWAYS AS (
        CASE WHEN total_sent > 0
        THEN (total_delivered::NUMERIC / total_sent)
        ELSE 0 END
    ) STORED,

    -- Engagement metrics
    total_opens INTEGER DEFAULT 0,
    unique_opens INTEGER DEFAULT 0,
    open_rate NUMERIC GENERATED ALWAYS AS (
        CASE WHEN total_delivered > 0
        THEN (unique_opens::NUMERIC / total_delivered)
        ELSE 0 END
    ) STORED,

    total_clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    click_rate NUMERIC GENERATED ALWAYS AS (
        CASE WHEN total_delivered > 0
        THEN (unique_clicks::NUMERIC / total_delivered)
        ELSE 0 END
    ) STORED,

    click_to_open_rate NUMERIC GENERATED ALWAYS AS (
        CASE WHEN unique_opens > 0
        THEN (unique_clicks::NUMERIC / unique_opens)
        ELSE 0 END
    ) STORED,

    -- Content performance
    top_clicked_links JSONB DEFAULT '[]'::jsonb,
    content_engagement_scores JSONB DEFAULT '{}'::jsonb,

    -- Subscriber behavior
    unsubscribes INTEGER DEFAULT 0,
    spam_reports INTEGER DEFAULT 0,

    -- Time-based metrics
    avg_time_to_open INTERVAL,
    peak_open_hour INTEGER,

    -- Liberation metrics
    liberation_content_engagement NUMERIC,
    community_action_clicks INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(newsletter_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Content performance indexes
CREATE INDEX IF NOT EXISTS idx_content_performance_type_id ON content_performance(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_metric ON content_performance(metric_type, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_performance_agent ON content_performance(agent_id) WHERE agent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_content_performance_period ON content_performance(measurement_period, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_performance_source ON content_performance(source) WHERE source IS NOT NULL;

-- Agent quality indexes
CREATE INDEX IF NOT EXISTS idx_agent_quality_type ON agent_quality_scores(agent_type, score_period);
CREATE INDEX IF NOT EXISTS idx_agent_quality_trend ON agent_quality_scores(performance_trend, approval_rate DESC);
CREATE INDEX IF NOT EXISTS idx_agent_quality_period ON agent_quality_scores(period_start DESC, period_end DESC);

-- IVOR intelligence indexes
CREATE INDEX IF NOT EXISTS idx_ivor_intelligence_relevance ON ivor_intelligence(relevance_score DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_ivor_intelligence_type ON ivor_intelligence(content_type, is_active);
CREATE INDEX IF NOT EXISTS idx_ivor_intelligence_engagement ON ivor_intelligence(engagement_prediction DESC);
CREATE INDEX IF NOT EXISTS idx_ivor_intelligence_liberation ON ivor_intelligence(liberation_alignment DESC);
CREATE INDEX IF NOT EXISTS idx_ivor_intelligence_tags ON ivor_intelligence USING GIN(content_tags);

-- Feedback loop indexes
CREATE INDEX IF NOT EXISTS idx_feedback_events_type ON feedback_loop_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_events_source ON feedback_loop_events(source_table, source_id);

-- Newsletter performance indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_performance_date ON newsletter_performance(send_date DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_performance_open_rate ON newsletter_performance(open_rate DESC);

-- ============================================================================
-- FUNCTIONS FOR FEEDBACK LOOP
-- ============================================================================

-- Function to boost content relevance
CREATE OR REPLACE FUNCTION boost_content_relevance(
    p_content_ids UUID[],
    p_boost_amount NUMERIC,
    p_reason TEXT DEFAULT 'high_engagement'
)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
    content_id UUID;
BEGIN
    updated_count := 0;

    FOREACH content_id IN ARRAY p_content_ids
    LOOP
        UPDATE ivor_intelligence
        SET
            relevance_score = LEAST(1.0, relevance_score + (p_boost_amount / 100)),
            score_adjustments = score_adjustments + 1,
            last_adjustment_at = NOW(),
            adjustment_history = adjustment_history || jsonb_build_object(
                'timestamp', NOW(),
                'adjustment', p_boost_amount,
                'reason', p_reason,
                'previous_score', relevance_score
            ),
            updated_at = NOW()
        WHERE content_id = boost_content_relevance.content_id
          AND is_active = true;

        IF FOUND THEN
            -- Log the event
            INSERT INTO feedback_loop_events (
                event_type, source_table, source_id,
                previous_value, change_amount, change_reason,
                triggered_by
            )
            SELECT
                'relevance_boost', 'ivor_intelligence', id,
                relevance_score - (p_boost_amount / 100), p_boost_amount, p_reason,
                'system'
            FROM ivor_intelligence
            WHERE content_id = boost_content_relevance.content_id;

            updated_count := updated_count + 1;
        END IF;
    END LOOP;

    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to reduce content relevance
CREATE OR REPLACE FUNCTION reduce_content_relevance(
    p_content_ids UUID[],
    p_reduction_amount NUMERIC,
    p_reason TEXT DEFAULT 'low_engagement'
)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
    content_id UUID;
BEGIN
    updated_count := 0;

    FOREACH content_id IN ARRAY p_content_ids
    LOOP
        UPDATE ivor_intelligence
        SET
            relevance_score = GREATEST(0.0, relevance_score - (p_reduction_amount / 100)),
            score_adjustments = score_adjustments + 1,
            last_adjustment_at = NOW(),
            adjustment_history = adjustment_history || jsonb_build_object(
                'timestamp', NOW(),
                'adjustment', -p_reduction_amount,
                'reason', p_reason,
                'previous_score', relevance_score
            ),
            updated_at = NOW()
        WHERE content_id = reduce_content_relevance.content_id
          AND is_active = true;

        IF FOUND THEN
            -- Log the event
            INSERT INTO feedback_loop_events (
                event_type, source_table, source_id,
                previous_value, change_amount, change_reason,
                triggered_by
            )
            SELECT
                'relevance_reduction', 'ivor_intelligence', id,
                relevance_score + (p_reduction_amount / 100), -p_reduction_amount, p_reason,
                'system'
            FROM ivor_intelligence
            WHERE content_id = reduce_content_relevance.content_id;

            updated_count := updated_count + 1;
        END IF;
    END LOOP;

    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update agent quality score
CREATE OR REPLACE FUNCTION update_agent_quality_score(
    p_agent_id UUID,
    p_agent_type TEXT,
    p_approval_rate NUMERIC
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO agent_quality_scores (
        agent_id, agent_type, approval_rate, rejection_rate,
        score_period, period_start, period_end
    )
    VALUES (
        p_agent_id, p_agent_type, p_approval_rate, 1 - p_approval_rate,
        'weekly', date_trunc('week', NOW()), date_trunc('week', NOW()) + INTERVAL '1 week'
    )
    ON CONFLICT (agent_id, agent_type, score_period, period_start)
    DO UPDATE SET
        approval_rate = p_approval_rate,
        rejection_rate = 1 - p_approval_rate,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to process performance metrics and trigger feedback loop
CREATE OR REPLACE FUNCTION process_performance_feedback()
RETURNS TRIGGER AS $$
DECLARE
    high_engagement_threshold NUMERIC := 0.4;
    low_engagement_threshold NUMERIC := 0.1;
    engagement_rate NUMERIC;
BEGIN
    -- Calculate engagement rate from metrics
    IF NEW.metric_type = 'engagement' THEN
        engagement_rate := NEW.metric_value;

        -- High engagement: boost relevance
        IF engagement_rate > high_engagement_threshold THEN
            PERFORM boost_content_relevance(
                ARRAY[NEW.content_id],
                10, -- boost by 10%
                'high_engagement_trigger'
            );
        -- Low engagement: reduce relevance
        ELSIF engagement_rate < low_engagement_threshold THEN
            PERFORM reduce_content_relevance(
                ARRAY[NEW.content_id],
                5, -- reduce by 5%
                'low_engagement_trigger'
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic feedback loop processing
DROP TRIGGER IF EXISTS trigger_performance_feedback ON content_performance;
CREATE TRIGGER trigger_performance_feedback
    AFTER INSERT ON content_performance
    FOR EACH ROW
    EXECUTE FUNCTION process_performance_feedback();

-- ============================================================================
-- VIEWS FOR ANALYTICS DASHBOARD
-- ============================================================================

-- Agent performance trends view
CREATE OR REPLACE VIEW agent_performance_trends AS
SELECT
    aq.agent_type,
    aq.agent_name,
    aq.score_period,
    aq.period_start,
    aq.approval_rate,
    aq.rejection_rate,
    aq.engagement_score,
    aq.liberation_alignment_score,
    aq.total_items_processed,
    aq.performance_trend,
    -- Calculate moving average
    AVG(aq.approval_rate) OVER (
        PARTITION BY aq.agent_type
        ORDER BY aq.period_start
        ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
    ) as moving_avg_approval,
    -- Calculate week-over-week change
    aq.approval_rate - LAG(aq.approval_rate, 1) OVER (
        PARTITION BY aq.agent_type
        ORDER BY aq.period_start
    ) as wow_change
FROM agent_quality_scores aq
WHERE aq.period_start >= NOW() - INTERVAL '90 days'
ORDER BY aq.agent_type, aq.period_start DESC;

-- Content engagement over time view
CREATE OR REPLACE VIEW content_engagement_timeline AS
SELECT
    cp.content_type,
    date_trunc('day', cp.measured_at) as measurement_date,
    cp.metric_type,
    SUM(cp.metric_value) as total_value,
    AVG(cp.metric_value) as avg_value,
    COUNT(DISTINCT cp.content_id) as unique_content_count,
    cp.source
FROM content_performance cp
WHERE cp.measured_at >= NOW() - INTERVAL '30 days'
GROUP BY
    cp.content_type,
    date_trunc('day', cp.measured_at),
    cp.metric_type,
    cp.source
ORDER BY measurement_date DESC, cp.content_type, cp.metric_type;

-- Newsletter performance history view
CREATE OR REPLACE VIEW newsletter_performance_history AS
SELECT
    np.newsletter_name,
    np.send_date,
    np.total_sent,
    np.total_delivered,
    np.delivery_rate,
    np.unique_opens,
    np.open_rate,
    np.unique_clicks,
    np.click_rate,
    np.click_to_open_rate,
    np.unsubscribes,
    np.liberation_content_engagement,
    np.community_action_clicks,
    -- Performance ranking
    RANK() OVER (ORDER BY np.open_rate DESC) as open_rate_rank,
    RANK() OVER (ORDER BY np.click_rate DESC) as click_rate_rank,
    -- Rolling averages
    AVG(np.open_rate) OVER (
        ORDER BY np.send_date
        ROWS BETWEEN 4 PRECEDING AND CURRENT ROW
    ) as rolling_avg_open_rate,
    AVG(np.click_rate) OVER (
        ORDER BY np.send_date
        ROWS BETWEEN 4 PRECEDING AND CURRENT ROW
    ) as rolling_avg_click_rate
FROM newsletter_performance np
WHERE np.send_date >= NOW() - INTERVAL '180 days'
ORDER BY np.send_date DESC;

-- Top performing content types view
CREATE OR REPLACE VIEW top_performing_content AS
SELECT
    ii.content_type,
    COUNT(*) as total_content,
    AVG(ii.relevance_score) as avg_relevance,
    AVG(ii.engagement_prediction) as avg_engagement_prediction,
    AVG(ii.liberation_alignment) as avg_liberation_alignment,
    SUM(ii.times_recommended) as total_recommendations,
    SUM(ii.times_clicked) as total_clicks,
    SUM(ii.times_engaged) as total_engagements,
    CASE
        WHEN SUM(ii.times_recommended) > 0
        THEN SUM(ii.times_clicked)::NUMERIC / SUM(ii.times_recommended)
        ELSE 0
    END as click_through_rate,
    CASE
        WHEN SUM(ii.times_clicked) > 0
        THEN SUM(ii.times_engaged)::NUMERIC / SUM(ii.times_clicked)
        ELSE 0
    END as engagement_conversion_rate
FROM ivor_intelligence ii
WHERE ii.is_active = true
GROUP BY ii.content_type
ORDER BY avg_relevance DESC, total_engagements DESC;

-- Intelligence adjustment summary view
CREATE OR REPLACE VIEW intelligence_adjustment_summary AS
SELECT
    fl.event_type,
    date_trunc('day', fl.created_at) as event_date,
    COUNT(*) as event_count,
    AVG(fl.change_amount) as avg_change,
    SUM(CASE WHEN fl.change_amount > 0 THEN 1 ELSE 0 END) as positive_adjustments,
    SUM(CASE WHEN fl.change_amount < 0 THEN 1 ELSE 0 END) as negative_adjustments,
    fl.trigger_metric
FROM feedback_loop_events fl
WHERE fl.created_at >= NOW() - INTERVAL '30 days'
  AND fl.event_type IN ('relevance_boost', 'relevance_reduction')
GROUP BY fl.event_type, date_trunc('day', fl.created_at), fl.trigger_metric
ORDER BY event_date DESC, fl.event_type;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_quality_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ivor_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_loop_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_performance ENABLE ROW LEVEL SECURITY;

-- Admin access policies
CREATE POLICY "Admins can manage content performance" ON content_performance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM governance_members
            WHERE user_id = auth.uid()
            AND participation_level IN ('facilitator', 'admin')
        )
    );

CREATE POLICY "Admins can manage agent quality scores" ON agent_quality_scores
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM governance_members
            WHERE user_id = auth.uid()
            AND participation_level = 'admin'
        )
    );

CREATE POLICY "Community can view intelligence scores" ON ivor_intelligence
    FOR SELECT USING (
        is_active = true OR
        EXISTS (
            SELECT 1 FROM governance_members
            WHERE user_id = auth.uid()
            AND participation_level IN ('facilitator', 'admin')
        )
    );

CREATE POLICY "System can update intelligence" ON ivor_intelligence
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM governance_members
            WHERE user_id = auth.uid()
            AND participation_level = 'admin'
        )
    );

CREATE POLICY "Admins can view feedback events" ON feedback_loop_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM governance_members
            WHERE user_id = auth.uid()
            AND participation_level IN ('facilitator', 'admin')
        )
    );

CREATE POLICY "Admins can view newsletter performance" ON newsletter_performance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM governance_members
            WHERE user_id = auth.uid()
            AND participation_level IN ('facilitator', 'admin')
        )
    );

-- ============================================================================
-- TRIGGERS FOR TIMESTAMPS
-- ============================================================================

CREATE TRIGGER update_content_performance_timestamp
    BEFORE UPDATE ON content_performance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_quality_timestamp
    BEFORE UPDATE ON agent_quality_scores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ivor_intelligence_timestamp
    BEFORE UPDATE ON ivor_intelligence
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_performance_timestamp
    BEFORE UPDATE ON newsletter_performance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE content_performance IS 'Tracks performance metrics for all content types across the platform';
COMMENT ON TABLE agent_quality_scores IS 'Tracks quality and performance scores for automated agents/systems';
COMMENT ON TABLE ivor_intelligence IS 'Stores relevance and engagement scores for IVOR recommendations';
COMMENT ON TABLE feedback_loop_events IS 'Logs all feedback loop adjustments for audit and analysis';
COMMENT ON TABLE newsletter_performance IS 'Detailed newsletter delivery and engagement metrics';

COMMENT ON FUNCTION boost_content_relevance IS 'Increases relevance score for high-performing content';
COMMENT ON FUNCTION reduce_content_relevance IS 'Decreases relevance score for low-performing content';
COMMENT ON FUNCTION update_agent_quality_score IS 'Updates or inserts agent quality score for tracking period';
COMMENT ON FUNCTION process_performance_feedback IS 'Trigger function that processes performance metrics and adjusts intelligence';

COMMENT ON VIEW agent_performance_trends IS 'Shows agent performance over time with moving averages and week-over-week changes';
COMMENT ON VIEW content_engagement_timeline IS 'Time-series view of content engagement metrics';
COMMENT ON VIEW newsletter_performance_history IS 'Newsletter performance with rolling averages and rankings';
COMMENT ON VIEW top_performing_content IS 'Summary of top performing content by type';
COMMENT ON VIEW intelligence_adjustment_summary IS 'Summary of feedback loop adjustments over time';
