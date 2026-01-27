-- BLKOUT Liberation Platform - Apply Performance Metrics Schema
-- Phase 3.1: Self-improving system - Performance metrics and feedback loop
-- Run this script to apply the content_performance and feedback loop schema

-- ============================================================================
-- PRE-REQUISITES CHECK
-- ============================================================================

-- Ensure the update_updated_at_column function exists (from previous migrations)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $func$ LANGUAGE plpgsql;
        RAISE NOTICE 'Created update_updated_at_column function';
    ELSE
        RAISE NOTICE 'update_updated_at_column function already exists';
    END IF;
END $$;

-- ============================================================================
-- APPLY MIGRATION
-- ============================================================================

-- Source the main migration file
\i 'migrations/003_content_performance_feedback_loop.sql'

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify tables were created
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'content_performance',
        'agent_quality_scores',
        'ivor_intelligence',
        'feedback_loop_events',
        'newsletter_performance'
    );

    IF table_count = 5 THEN
        RAISE NOTICE 'SUCCESS: All 5 performance metrics tables created';
    ELSE
        RAISE WARNING 'WARNING: Only % of 5 tables created', table_count;
    END IF;
END $$;

-- Verify functions were created
DO $$
DECLARE
    func_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN (
        'boost_content_relevance',
        'reduce_content_relevance',
        'update_agent_quality_score',
        'process_performance_feedback'
    );

    IF func_count = 4 THEN
        RAISE NOTICE 'SUCCESS: All 4 feedback loop functions created';
    ELSE
        RAISE WARNING 'WARNING: Only % of 4 functions created', func_count;
    END IF;
END $$;

-- Verify views were created
DO $$
DECLARE
    view_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_count
    FROM information_schema.views
    WHERE table_schema = 'public'
    AND table_name IN (
        'agent_performance_trends',
        'content_engagement_timeline',
        'newsletter_performance_history',
        'top_performing_content',
        'intelligence_adjustment_summary'
    );

    IF view_count = 5 THEN
        RAISE NOTICE 'SUCCESS: All 5 analytics views created';
    ELSE
        RAISE WARNING 'WARNING: Only % of 5 views created', view_count;
    END IF;
END $$;

-- ============================================================================
-- INSERT SAMPLE DATA FOR TESTING (Optional - Comment out for production)
-- ============================================================================

-- Sample IVOR intelligence data
INSERT INTO ivor_intelligence (content_type, content_id, relevance_score, quality_score, engagement_prediction, liberation_alignment, community_relevance, cultural_authenticity, content_tags, content_categories, is_active)
VALUES
    ('article', gen_random_uuid(), 0.85, 0.9, 0.7, 0.92, 0.88, 0.95, ARRAY['liberation', 'community', 'organizing'], ARRAY['Community Organizing'], true),
    ('article', gen_random_uuid(), 0.72, 0.8, 0.6, 0.85, 0.78, 0.82, ARRAY['health', 'wellness', 'healing'], ARRAY['Health & Wellness'], true),
    ('event', gen_random_uuid(), 0.88, 0.95, 0.8, 0.95, 0.92, 0.98, ARRAY['mutual-aid', 'community', 'action'], ARRAY['Community Events'], true),
    ('newsletter', gen_random_uuid(), 0.65, 0.75, 0.55, 0.78, 0.70, 0.72, ARRAY['news', 'update', 'community'], ARRAY['Newsletter'], true),
    ('resource', gen_random_uuid(), 0.92, 0.88, 0.75, 0.98, 0.95, 0.92, ARRAY['education', 'liberation', 'resources'], ARRAY['Education'], true)
ON CONFLICT DO NOTHING;

-- Sample agent quality scores
INSERT INTO agent_quality_scores (agent_id, agent_type, agent_name, approval_rate, rejection_rate, engagement_score, liberation_alignment_score, total_items_processed, performance_trend, score_period, period_start, period_end)
VALUES
    (gen_random_uuid(), 'newsletter_curator', 'Newsletter Curator v1', 0.85, 0.15, 0.78, 0.92, 150, 'improving', 'weekly', NOW() - INTERVAL '7 days', NOW()),
    (gen_random_uuid(), 'content_classifier', 'Content Classifier v2', 0.92, 0.08, 0.85, 0.88, 320, 'stable', 'weekly', NOW() - INTERVAL '7 days', NOW()),
    (gen_random_uuid(), 'trend_analyzer', 'Trend Analyzer v1', 0.78, 0.22, 0.72, 0.85, 85, 'stable', 'weekly', NOW() - INTERVAL '7 days', NOW())
ON CONFLICT DO NOTHING;

-- Sample newsletter performance
INSERT INTO newsletter_performance (newsletter_id, newsletter_name, send_date, total_sent, total_delivered, total_bounced, total_opens, unique_opens, total_clicks, unique_clicks, unsubscribes, liberation_content_engagement, community_action_clicks)
VALUES
    (gen_random_uuid(), 'BLKOUT Weekly - Jan Week 4', NOW() - INTERVAL '3 days', 1250, 1180, 70, 520, 380, 145, 98, 3, 0.75, 42),
    (gen_random_uuid(), 'BLKOUT Weekly - Jan Week 3', NOW() - INTERVAL '10 days', 1200, 1140, 60, 480, 350, 128, 85, 5, 0.72, 38),
    (gen_random_uuid(), 'BLKOUT Weekly - Jan Week 2', NOW() - INTERVAL '17 days', 1150, 1095, 55, 445, 320, 112, 78, 4, 0.68, 35)
ON CONFLICT DO NOTHING;

RAISE NOTICE 'Sample data inserted for testing';

-- ============================================================================
-- FINAL STATUS
-- ============================================================================

SELECT 'Performance Metrics Schema Applied Successfully' AS status,
       NOW() AS applied_at;
