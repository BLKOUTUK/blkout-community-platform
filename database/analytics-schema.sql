-- BLKOUT Liberation Platform - Analytics Database Schema
-- Community-owned analytics with liberation values enforcement
-- Privacy-preserving insights for democratic decision-making

-- ============================================================================
-- CONTENT ANALYTICS & CLASSIFICATION TABLES
-- ============================================================================

-- Content Analytics with Liberation Alignment
CREATE TABLE content_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('article', 'event', 'story', 'discussion', 'proposal', 'multimedia')),
    published_date DATE NOT NULL,

    -- Community Engagement Metrics (Liberation-Focused)
    view_count INTEGER DEFAULT 0,
    engagement_score FLOAT DEFAULT 0, -- Community empowerment focus
    community_rating FLOAT CHECK (community_rating BETWEEN 0 AND 5),
    total_ratings INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    discussion_count INTEGER DEFAULT 0,

    -- Liberation Values Scoring (Core Analytics)
    liberation_alignment_score FLOAT NOT NULL CHECK (liberation_alignment_score BETWEEN 0 AND 1),
    creator_sovereignty_score FLOAT CHECK (creator_sovereignty_score BETWEEN 0 AND 1),
    community_safety_score FLOAT CHECK (community_safety_score BETWEEN 0 AND 1),
    cultural_authenticity_score FLOAT CHECK (cultural_authenticity_score BETWEEN 0 AND 1),
    democratic_participation_score FLOAT CHECK (democratic_participation_score BETWEEN 0 AND 1),

    -- Automated Content Classification
    primary_category VARCHAR(100),
    secondary_categories TEXT[], -- Array of additional categories
    topic_tags TEXT[], -- ML-generated topic tags
    sentiment_score FLOAT CHECK (sentiment_score BETWEEN -1 AND 1),
    complexity_level VARCHAR(20) CHECK (complexity_level IN ('beginner', 'intermediate', 'advanced')),

    -- Community Impact Metrics
    healing_impact_score FLOAT CHECK (healing_impact_score BETWEEN 0 AND 1),
    organizing_potential_score FLOAT CHECK (organizing_potential_score BETWEEN 0 AND 1),
    educational_value_score FLOAT CHECK (educational_value_score BETWEEN 0 AND 1),
    joy_celebration_score FLOAT CHECK (joy_celebration_score BETWEEN 0 AND 1),

    -- Quality and Safety Assessment
    quality_score FLOAT CHECK (quality_score BETWEEN 0 AND 1),
    trauma_informed_score FLOAT CHECK (trauma_informed_score BETWEEN 0 AND 1),
    accessibility_score FLOAT CHECK (accessibility_score BETWEEN 0 AND 1),

    -- ML Model Performance Tracking
    classification_confidence FLOAT CHECK (classification_confidence BETWEEN 0 AND 1),
    model_version VARCHAR(50),
    classification_timestamp TIMESTAMPTZ DEFAULT NOW(),
    human_validation_status VARCHAR(20) CHECK (human_validation_status IN ('pending', 'validated', 'corrected', 'flagged')),

    -- Privacy and Consent
    analytics_consent_given BOOLEAN DEFAULT FALSE,
    anonymized_data BOOLEAN DEFAULT TRUE,

    -- Trend Analysis Data
    trend_data JSONB, -- Flexible storage for trend metrics
    engagement_patterns JSONB, -- Temporal engagement patterns
    demographic_insights JSONB, -- Anonymized demographic patterns

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Trend Analysis
CREATE TABLE community_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trend_period DATE NOT NULL,
    period_type VARCHAR(20) CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly')) DEFAULT 'weekly',

    -- Trend Categories
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),

    -- Trend Metrics
    trend_strength FLOAT CHECK (trend_strength BETWEEN 0 AND 1),
    community_interest_score FLOAT CHECK (community_interest_score BETWEEN 0 AND 1),
    growth_rate FLOAT, -- Can be negative for declining trends

    -- Liberation Impact Analysis
    liberation_impact FLOAT CHECK (liberation_impact BETWEEN -1 AND 1),
    community_empowerment_trend FLOAT CHECK (community_empowerment_trend BETWEEN -1 AND 1),
    creator_sovereignty_trend FLOAT CHECK (creator_sovereignty_trend BETWEEN -1 AND 1),

    -- Content Volume and Quality
    content_volume INTEGER DEFAULT 0,
    avg_quality_score FLOAT CHECK (avg_quality_score BETWEEN 0 AND 1),
    avg_community_rating FLOAT CHECK (avg_community_rating BETWEEN 0 AND 5),

    -- Engagement Patterns
    avg_engagement_score FLOAT,
    total_discussions INTEGER DEFAULT 0,
    unique_contributors INTEGER DEFAULT 0,

    -- Demographic Insights (Anonymized)
    geographic_distribution JSONB,
    age_group_engagement JSONB,
    identity_representation JSONB, -- Privacy-preserving aggregated data

    -- Trend Analysis Metadata
    trend_data JSONB, -- Detailed trend analytics
    confidence_level FLOAT CHECK (confidence_level BETWEEN 0 AND 1),
    data_points INTEGER DEFAULT 0,

    -- Community Validation
    community_validated BOOLEAN DEFAULT FALSE,
    validation_votes INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Unique constraint for trend periods and categories
    UNIQUE(trend_period, period_type, category)
);

-- ============================================================================
-- LIBERATION VALUES COMPLIANCE TRACKING
-- ============================================================================

-- Liberation Values Compliance Monitoring
CREATE TABLE liberation_compliance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_date DATE NOT NULL,
    assessment_period VARCHAR(20) CHECK (assessment_period IN ('daily', 'weekly', 'monthly')) DEFAULT 'weekly',

    -- Core Liberation Values Scores (0-1 scale)
    creator_sovereignty_compliance FLOAT NOT NULL CHECK (creator_sovereignty_compliance BETWEEN 0 AND 1),
    community_safety_compliance FLOAT NOT NULL CHECK (community_safety_compliance BETWEEN 0 AND 1),
    democratic_governance_compliance FLOAT NOT NULL CHECK (democratic_governance_compliance BETWEEN 0 AND 1),
    cultural_authenticity_compliance FLOAT NOT NULL CHECK (cultural_authenticity_compliance BETWEEN 0 AND 1),
    anti_oppression_compliance FLOAT NOT NULL CHECK (anti_oppression_compliance BETWEEN 0 AND 1),

    -- Revenue and Economic Justice (Creator Sovereignty)
    creator_revenue_share_percentage FLOAT CHECK (creator_revenue_share_percentage >= 0.75), -- Must be 75%+
    revenue_transparency_score FLOAT CHECK (revenue_transparency_score BETWEEN 0 AND 1),
    economic_justice_score FLOAT CHECK (economic_justice_score BETWEEN 0 AND 1),

    -- Community Protection and Safety
    trauma_informed_design_score FLOAT CHECK (trauma_informed_design_score BETWEEN 0 AND 1),
    accessibility_compliance_score FLOAT CHECK (accessibility_compliance_score BETWEEN 0 AND 1),
    harassment_prevention_score FLOAT CHECK (harassment_prevention_score BETWEEN 0 AND 1),
    community_moderation_effectiveness FLOAT CHECK (community_moderation_effectiveness BETWEEN 0 AND 1),

    -- Democratic Participation
    voting_participation_rate FLOAT CHECK (voting_participation_rate BETWEEN 0 AND 1),
    consensus_building_effectiveness FLOAT CHECK (consensus_building_effectiveness BETWEEN 0 AND 1),
    community_feedback_integration_score FLOAT CHECK (community_feedback_integration_score BETWEEN 0 AND 1),

    -- Cultural Authenticity and Representation
    black_queer_joy_representation FLOAT CHECK (black_queer_joy_representation BETWEEN 0 AND 1),
    pan_african_values_alignment FLOAT CHECK (pan_african_values_alignment BETWEEN 0 AND 1),
    community_voice_amplification FLOAT CHECK (community_voice_amplification BETWEEN 0 AND 1),

    -- Overall Liberation Score
    overall_liberation_score FLOAT NOT NULL CHECK (overall_liberation_score BETWEEN 0 AND 1),

    -- Assessment Metadata
    assessment_methodology VARCHAR(100),
    data_sources TEXT[],
    community_input_included BOOLEAN DEFAULT FALSE,
    external_audit_included BOOLEAN DEFAULT FALSE,

    -- Improvement Areas
    improvement_recommendations TEXT[],
    action_items TEXT[],
    target_improvement_date DATE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMMUNITY INSIGHTS AND EMPOWERMENT METRICS
-- ============================================================================

-- Community Health and Empowerment Dashboard
CREATE TABLE community_health_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    period_type VARCHAR(20) CHECK (period_type IN ('daily', 'weekly', 'monthly')) DEFAULT 'daily',

    -- Community Participation and Growth
    active_members INTEGER DEFAULT 0,
    new_members INTEGER DEFAULT 0,
    returning_members INTEGER DEFAULT 0,
    member_retention_rate FLOAT CHECK (member_retention_rate BETWEEN 0 AND 1),

    -- Content Creation and Curation
    total_content_created INTEGER DEFAULT 0,
    community_curated_content INTEGER DEFAULT 0,
    creator_owned_content_percentage FLOAT CHECK (creator_owned_content_percentage BETWEEN 0 AND 1),

    -- Democratic Engagement
    voting_participation INTEGER DEFAULT 0,
    proposal_submission_count INTEGER DEFAULT 0,
    consensus_reached_count INTEGER DEFAULT 0,
    community_feedback_submissions INTEGER DEFAULT 0,

    -- Healing and Support Metrics
    crisis_support_requests INTEGER DEFAULT 0,
    crisis_support_response_time_avg INTERVAL,
    healing_resources_accessed INTEGER DEFAULT 0,
    peer_support_connections INTEGER DEFAULT 0,

    -- Joy and Celebration Tracking
    joy_content_engagement FLOAT DEFAULT 0,
    celebration_events_hosted INTEGER DEFAULT 0,
    community_appreciation_exchanges INTEGER DEFAULT 0,

    -- Organizing and Action
    organizing_initiatives INTEGER DEFAULT 0,
    collective_action_participation INTEGER DEFAULT 0,
    mutual_aid_requests INTEGER DEFAULT 0,
    mutual_aid_fulfillments INTEGER DEFAULT 0,

    -- Platform Health Indicators
    content_quality_avg FLOAT CHECK (content_quality_avg BETWEEN 0 AND 5),
    community_satisfaction_score FLOAT CHECK (community_satisfaction_score BETWEEN 0 AND 5),
    platform_trust_score FLOAT CHECK (platform_trust_score BETWEEN 0 AND 5),

    -- Safety and Well-being
    harassment_reports INTEGER DEFAULT 0,
    harassment_resolution_rate FLOAT CHECK (harassment_resolution_rate BETWEEN 0 AND 1),
    community_violations INTEGER DEFAULT 0,
    restorative_justice_processes INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(metric_date, period_type)
);

-- ============================================================================
-- PRIVACY-PRESERVING ANALYTICS TABLES
-- ============================================================================

-- Differential Privacy Analytics (No Personal Data)
CREATE TABLE differential_privacy_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    metric_type VARCHAR(100) NOT NULL,

    -- Differential Privacy Parameters
    epsilon FLOAT NOT NULL, -- Privacy budget
    delta FLOAT DEFAULT 0.0, -- Failure probability
    sensitivity FLOAT NOT NULL, -- Global sensitivity

    -- Anonymized Aggregated Data
    aggregated_value FLOAT NOT NULL,
    noise_added FLOAT NOT NULL,
    confidence_interval_lower FLOAT,
    confidence_interval_upper FLOAT,

    -- Context for Analysis
    dimension_filters JSONB, -- What dimensions were analyzed
    sample_size INTEGER,

    -- Privacy Compliance
    consent_rate FLOAT CHECK (consent_rate BETWEEN 0 AND 1),
    data_retention_compliant BOOLEAN DEFAULT TRUE,
    anonymization_level VARCHAR(20) CHECK (anonymization_level IN ('k-anonymous', 'l-diverse', 't-close', 'differential')),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MACHINE LEARNING MODEL PERFORMANCE TRACKING
-- ============================================================================

-- ML Model Performance and Bias Monitoring
CREATE TABLE ml_model_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    evaluation_date DATE NOT NULL,

    -- Performance Metrics
    accuracy FLOAT CHECK (accuracy BETWEEN 0 AND 1),
    precision FLOAT CHECK (precision BETWEEN 0 AND 1),
    recall FLOAT CHECK (recall BETWEEN 0 AND 1),
    f1_score FLOAT CHECK (f1_score BETWEEN 0 AND 1),

    -- Liberation-Specific Performance
    cultural_sensitivity_score FLOAT CHECK (cultural_sensitivity_score BETWEEN 0 AND 1),
    trauma_awareness_score FLOAT CHECK (trauma_awareness_score BETWEEN 0 AND 1),
    community_benefit_score FLOAT CHECK (community_benefit_score BETWEEN 0 AND 1),

    -- Bias Detection and Mitigation
    overall_bias_score FLOAT CHECK (overall_bias_score BETWEEN 0 AND 1), -- Lower is better
    cultural_bias_score FLOAT CHECK (cultural_bias_score BETWEEN 0 AND 1),
    gender_bias_score FLOAT CHECK (gender_bias_score BETWEEN 0 AND 1),
    age_bias_score FLOAT CHECK (age_bias_score BETWEEN 0 AND 1),
    socioeconomic_bias_score FLOAT CHECK (socioeconomic_bias_score BETWEEN 0 AND 1),

    -- Community Validation
    community_feedback_score FLOAT CHECK (community_feedback_score BETWEEN 0 AND 5),
    community_validation_sample_size INTEGER DEFAULT 0,
    false_positive_community_reports INTEGER DEFAULT 0,
    false_negative_community_reports INTEGER DEFAULT 0,

    -- Training Data Diversity
    training_data_size INTEGER,
    cultural_representation_score FLOAT CHECK (cultural_representation_score BETWEEN 0 AND 1),
    demographic_diversity_score FLOAT CHECK (demographic_diversity_score BETWEEN 0 AND 1),

    -- Model Improvement Tracking
    improvement_recommendations TEXT[],
    bias_mitigation_actions TEXT[],
    retraining_scheduled_date DATE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMMUNITY FEEDBACK AND VALIDATION TABLES
-- ============================================================================

-- Community Analytics Feedback
CREATE TABLE community_analytics_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL, -- Anonymous if preferred
    feedback_type VARCHAR(50) CHECK (feedback_type IN ('content_classification', 'trend_analysis', 'community_metrics', 'liberation_compliance')),

    -- Feedback Content
    analytics_item_id UUID, -- Can reference various analytics tables
    feedback_category VARCHAR(50) CHECK (feedback_category IN ('accuracy', 'bias', 'cultural_sensitivity', 'usefulness', 'privacy_concern')),
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_text TEXT,

    -- Suggested Improvements
    improvement_suggestions TEXT[],
    cultural_context_corrections TEXT[],
    bias_reports TEXT[],

    -- Community Impact Assessment
    community_benefit_rating INTEGER CHECK (community_benefit_rating BETWEEN 1 AND 5),
    liberation_alignment_rating INTEGER CHECK (liberation_alignment_rating BETWEEN 1 AND 5),

    -- Privacy Protection
    anonymous_feedback BOOLEAN DEFAULT FALSE,
    consent_for_improvement BOOLEAN DEFAULT TRUE,

    -- Feedback Processing
    reviewed BOOLEAN DEFAULT FALSE,
    reviewer_id UUID,
    reviewed_at TIMESTAMPTZ,
    action_taken TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Content Analytics Indexes
CREATE INDEX idx_content_analytics_type_date ON content_analytics(content_type, published_date);
CREATE INDEX idx_content_analytics_liberation_score ON content_analytics(liberation_alignment_score DESC);
CREATE INDEX idx_content_analytics_category ON content_analytics(primary_category, liberation_alignment_score DESC);
CREATE INDEX idx_content_analytics_tags ON content_analytics USING GIN(topic_tags);
CREATE INDEX idx_content_analytics_consent ON content_analytics(analytics_consent_given) WHERE analytics_consent_given = TRUE;

-- Trend Analysis Indexes
CREATE INDEX idx_community_trends_period ON community_trends(trend_period DESC, period_type);
CREATE INDEX idx_community_trends_category ON community_trends(category, trend_strength DESC);
CREATE INDEX idx_community_trends_liberation_impact ON community_trends(liberation_impact DESC);

-- Liberation Compliance Indexes
CREATE INDEX idx_liberation_compliance_date ON liberation_compliance_metrics(assessment_date DESC);
CREATE INDEX idx_liberation_compliance_score ON liberation_compliance_metrics(overall_liberation_score DESC);
CREATE INDEX idx_creator_revenue_compliance ON liberation_compliance_metrics(creator_revenue_share_percentage) WHERE creator_revenue_share_percentage >= 0.75;

-- Community Health Indexes
CREATE INDEX idx_community_health_date ON community_health_metrics(metric_date DESC, period_type);
CREATE INDEX idx_community_health_satisfaction ON community_health_metrics(community_satisfaction_score DESC);

-- ML Performance Indexes
CREATE INDEX idx_ml_performance_model ON ml_model_performance(model_name, model_version, evaluation_date DESC);
CREATE INDEX idx_ml_bias_score ON ml_model_performance(overall_bias_score ASC);
CREATE INDEX idx_ml_community_validation ON ml_model_performance(community_feedback_score DESC);

-- Community Feedback Indexes
CREATE INDEX idx_analytics_feedback_type ON community_analytics_feedback(feedback_type, feedback_category);
CREATE INDEX idx_analytics_feedback_unreviewed ON community_analytics_feedback(reviewed) WHERE reviewed = FALSE;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on sensitive tables
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE liberation_compliance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_analytics_feedback ENABLE ROW LEVEL SECURITY;

-- Analytics access policy (community members can view aggregated data)
CREATE POLICY "Community members can view aggregated analytics" ON content_analytics
    FOR SELECT USING (
        anonymized_data = TRUE OR
        EXISTS (
            SELECT 1 FROM governance_members
            WHERE user_id = auth.uid()
            AND membership_status = 'active'
        )
    );

-- Trends access policy (public for transparency)
CREATE POLICY "Community members can view trend analysis" ON community_trends
    FOR SELECT USING (
        community_validated = TRUE OR
        EXISTS (
            SELECT 1 FROM governance_members
            WHERE user_id = auth.uid()
            AND participation_level IN ('facilitator', 'admin')
        )
    );

-- Liberation compliance transparency (public for accountability)
CREATE POLICY "Liberation compliance is publicly viewable" ON liberation_compliance_metrics
    FOR SELECT TO PUBLIC;

-- Community health metrics (community members only)
CREATE POLICY "Community members can view health metrics" ON community_health_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM governance_members
            WHERE user_id = auth.uid()
            AND membership_status = 'active'
        )
    );

-- Feedback submission policy
CREATE POLICY "Community members can submit analytics feedback" ON community_analytics_feedback
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM governance_members
            WHERE user_id = auth.uid()
            AND membership_status = 'active'
        )
    );

-- ============================================================================
-- TRIGGERS FOR AUTOMATION
-- ============================================================================

-- Update timestamps
CREATE TRIGGER update_content_analytics_updated_at BEFORE UPDATE ON content_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_trends_updated_at BEFORE UPDATE ON community_trends
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_liberation_compliance_updated_at BEFORE UPDATE ON liberation_compliance_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-validate trends with sufficient community consensus
CREATE OR REPLACE FUNCTION auto_validate_trends()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-validate trends with 10+ validation votes and >70% approval
    IF NEW.validation_votes >= 10 AND
       (NEW.validation_votes * 0.7) <= (
           SELECT COUNT(*) FROM community_analytics_feedback
           WHERE analytics_item_id = NEW.id
           AND feedback_rating >= 4
       ) THEN
        NEW.community_validated = TRUE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_community_trends BEFORE UPDATE ON community_trends
    FOR EACH ROW EXECUTE FUNCTION auto_validate_trends();

-- ============================================================================
-- VIEWS FOR COMMON ANALYTICS QUERIES
-- ============================================================================

-- Community Liberation Dashboard View
CREATE VIEW community_liberation_dashboard AS
SELECT
    lc.assessment_date,
    lc.overall_liberation_score,
    lc.creator_sovereignty_compliance,
    lc.community_safety_compliance,
    lc.democratic_governance_compliance,
    lc.cultural_authenticity_compliance,
    lc.creator_revenue_share_percentage,
    ch.active_members,
    ch.community_satisfaction_score,
    ch.platform_trust_score,
    COALESCE(ch.harassment_reports, 0) as harassment_reports,
    ch.mutual_aid_fulfillments
FROM liberation_compliance_metrics lc
LEFT JOIN community_health_metrics ch ON lc.assessment_date = ch.metric_date
WHERE lc.assessment_period = 'weekly'
ORDER BY lc.assessment_date DESC
LIMIT 12; -- Last 3 months of weekly data

-- Content Performance with Liberation Alignment
CREATE VIEW content_performance_liberation AS
SELECT
    ca.content_id,
    ca.content_type,
    ca.primary_category,
    ca.liberation_alignment_score,
    ca.community_rating,
    ca.engagement_score,
    ca.healing_impact_score,
    ca.organizing_potential_score,
    ca.joy_celebration_score,
    ca.trauma_informed_score,
    ca.accessibility_score,
    ca.view_count,
    ca.shares_count,
    ca.discussion_count,
    ca.published_date
FROM content_analytics ca
WHERE ca.analytics_consent_given = TRUE
AND ca.liberation_alignment_score >= 0.6 -- Focus on liberation-aligned content
ORDER BY ca.liberation_alignment_score DESC, ca.community_rating DESC;

-- Community Trends Summary
CREATE VIEW community_trends_summary AS
SELECT
    ct.category,
    AVG(ct.liberation_impact) as avg_liberation_impact,
    AVG(ct.community_interest_score) as avg_interest,
    AVG(ct.trend_strength) as avg_trend_strength,
    COUNT(*) as trend_data_points,
    MAX(ct.trend_period) as latest_trend_date,
    SUM(ct.content_volume) as total_content_volume,
    AVG(ct.unique_contributors) as avg_contributors
FROM community_trends ct
WHERE ct.trend_period >= CURRENT_DATE - INTERVAL '90 days'
AND ct.community_validated = TRUE
GROUP BY ct.category
ORDER BY avg_liberation_impact DESC, avg_interest DESC;

-- ============================================================================
-- INITIAL SAMPLE DATA
-- ============================================================================

-- Insert sample liberation compliance baseline
INSERT INTO liberation_compliance_metrics (
    assessment_date,
    assessment_period,
    creator_sovereignty_compliance,
    community_safety_compliance,
    democratic_governance_compliance,
    cultural_authenticity_compliance,
    anti_oppression_compliance,
    creator_revenue_share_percentage,
    revenue_transparency_score,
    trauma_informed_design_score,
    voting_participation_rate,
    overall_liberation_score,
    assessment_methodology,
    community_input_included
) VALUES (
    CURRENT_DATE,
    'weekly',
    0.85,
    0.92,
    0.78,
    0.88,
    0.81,
    0.75, -- Minimum required
    0.95,
    0.89,
    0.67,
    0.84,
    'Community Analytics ML Assessment v1.0',
    TRUE
) ON CONFLICT DO NOTHING;

-- Insert sample community health metrics
INSERT INTO community_health_metrics (
    metric_date,
    period_type,
    active_members,
    new_members,
    content_quality_avg,
    community_satisfaction_score,
    platform_trust_score,
    voting_participation,
    mutual_aid_fulfillments
) VALUES (
    CURRENT_DATE,
    'daily',
    245,
    12,
    4.3,
    4.1,
    4.5,
    18,
    7
) ON CONFLICT DO NOTHING;