-- BLKOUT Liberation Platform - Enhanced Admin & Moderation Schema
-- Real database implementation for admin dashboard functionality
-- Liberation values enforcement with democratic governance integration

-- ============================================================================
-- ENHANCED MODERATION QUEUE (Extends existing moderation_queue)
-- ============================================================================

-- Add missing columns to existing moderation_queue table
ALTER TABLE moderation_queue
ADD COLUMN IF NOT EXISTS community_votes JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS automated_flags JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ivor_analysis JSONB,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS engagement_metrics JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tags VARCHAR(100)[],
ADD COLUMN IF NOT EXISTS source_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS assigned_moderator UUID REFERENCES auth.users(id);

-- Update existing columns for better admin functionality
ALTER TABLE moderation_queue
ALTER COLUMN moderator_id TYPE UUID USING moderator_id::uuid,
ALTER COLUMN reviewer_id TYPE UUID USING reviewer_id::uuid;

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_moderation_queue_moderator'
    ) THEN
        ALTER TABLE moderation_queue
        ADD CONSTRAINT fk_moderation_queue_moderator
        FOREIGN KEY (moderator_id) REFERENCES auth.users(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_moderation_queue_reviewer'
    ) THEN
        ALTER TABLE moderation_queue
        ADD CONSTRAINT fk_moderation_queue_reviewer
        FOREIGN KEY (reviewer_id) REFERENCES auth.users(id);
    END IF;
END $$;

-- ============================================================================
-- ADMIN USERS & PROFILES
-- ============================================================================

-- Admin profiles table extending auth.users
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT,
    role TEXT CHECK (role IN ('moderator', 'admin', 'super_admin')) DEFAULT 'moderator',
    permissions JSONB DEFAULT '{}',

    -- Liberation values tracking
    liberation_training_completed BOOLEAN DEFAULT FALSE,
    cultural_competency_verified BOOLEAN DEFAULT FALSE,
    trauma_informed_certified BOOLEAN DEFAULT FALSE,

    -- Activity tracking
    moderation_count INTEGER DEFAULT 0,
    last_active_date TIMESTAMPTZ,
    average_review_time INTERVAL,
    approval_rate DECIMAL(5,2),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MODERATION ASSIGNMENTS & WORKLOAD MANAGEMENT
-- ============================================================================

-- Moderator assignments for workload distribution
CREATE TABLE IF NOT EXISTS moderator_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    moderator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES moderation_queue(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id),
    priority_level INTEGER DEFAULT 1 CHECK (priority_level BETWEEN 1 AND 5),
    estimated_review_time INTERVAL DEFAULT '30 minutes',
    status TEXT CHECK (status IN ('assigned', 'in_review', 'completed', 'escalated')) DEFAULT 'assigned',

    -- Liberation values considerations
    requires_cultural_review BOOLEAN DEFAULT FALSE,
    requires_trauma_expertise BOOLEAN DEFAULT FALSE,
    community_input_requested BOOLEAN DEFAULT FALSE,

    completed_at TIMESTAMPTZ,
    escalation_reason TEXT,

    UNIQUE(moderator_id, submission_id)
);

-- ============================================================================
-- CONTENT ANALYTICS & ENGAGEMENT TRACKING
-- ============================================================================

-- Content analytics for published submissions
CREATE TABLE IF NOT EXISTS content_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID, -- References moderation_queue.id or published content
    content_type TEXT CHECK (content_type IN ('story', 'event', 'news', 'article')),

    -- Engagement metrics
    views_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    community_reactions JSONB DEFAULT '{}',

    -- Liberation values metrics
    community_benefit_score DECIMAL(3,2) CHECK (community_benefit_score BETWEEN 0.00 AND 1.00),
    cultural_authenticity_score DECIMAL(3,2) CHECK (cultural_authenticity_score BETWEEN 0.00 AND 1.00),
    accessibility_score DECIMAL(3,2) CHECK (accessibility_score BETWEEN 0.00 AND 1.00),

    -- Time-based tracking
    tracked_date DATE DEFAULT CURRENT_DATE,
    last_updated TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(content_id, tracked_date)
);

-- ============================================================================
-- SYSTEM HEALTH & MONITORING
-- ============================================================================

-- System health metrics for admin dashboard
CREATE TABLE IF NOT EXISTS system_health_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_unit TEXT,
    metric_category TEXT CHECK (metric_category IN ('performance', 'engagement', 'moderation', 'governance', 'liberation_values')),

    -- Context data
    measurement_timestamp TIMESTAMPTZ DEFAULT NOW(),
    additional_data JSONB DEFAULT '{}',

    -- Alerting
    threshold_value DECIMAL(10,2),
    alert_level TEXT CHECK (alert_level IN ('normal', 'warning', 'critical')) DEFAULT 'normal',

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LIBERATION VALUES COMPLIANCE TRACKING
-- ============================================================================

-- Creator sovereignty compliance tracking
CREATE TABLE IF NOT EXISTS creator_sovereignty_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporting_period_start DATE NOT NULL,
    reporting_period_end DATE NOT NULL,

    -- Revenue transparency (in cents to avoid floating point issues)
    total_revenue_cents BIGINT DEFAULT 0,
    creator_share_cents BIGINT DEFAULT 0,
    platform_share_cents BIGINT DEFAULT 0,
    community_benefit_cents BIGINT DEFAULT 0,

    -- Compliance calculations
    creator_sovereignty_percentage DECIMAL(5,2) NOT NULL CHECK (creator_sovereignty_percentage >= 75.00),
    compliance_status TEXT CHECK (compliance_status IN ('compliant', 'at_risk', 'violation')) DEFAULT 'compliant',

    -- Transparency
    published_to_community BOOLEAN DEFAULT FALSE,
    community_verification_count INTEGER DEFAULT 0,
    governance_approved BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(reporting_period_start, reporting_period_end)
);

-- ============================================================================
-- INDEXES FOR ADMIN DASHBOARD PERFORMANCE
-- ============================================================================

-- Moderation queue performance indexes
CREATE INDEX IF NOT EXISTS idx_moderation_queue_admin_dashboard
ON moderation_queue(status, priority, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_moderation_queue_type_status
ON moderation_queue(type, status, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_moderation_queue_assigned_moderator
ON moderation_queue(assigned_moderator, status) WHERE assigned_moderator IS NOT NULL;

-- Admin profiles indexes
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role
ON admin_profiles(role, last_active_date DESC);

-- Moderator assignments indexes
CREATE INDEX IF NOT EXISTS idx_moderator_assignments_active
ON moderator_assignments(moderator_id, status, priority_level DESC)
WHERE status IN ('assigned', 'in_review');

-- Content analytics indexes
CREATE INDEX IF NOT EXISTS idx_content_analytics_date_type
ON content_analytics(tracked_date DESC, content_type);

-- System health metrics indexes
CREATE INDEX IF NOT EXISTS idx_system_health_recent
ON system_health_metrics(measurement_timestamp DESC, metric_category);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all admin tables
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderator_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_sovereignty_metrics ENABLE ROW LEVEL SECURITY;

-- Admin profiles: Users can see their own profile, admins can see all
CREATE POLICY "Users can view own admin profile" ON admin_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all admin profiles" ON admin_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_profiles ap
            WHERE ap.user_id = auth.uid()
            AND ap.role IN ('admin', 'super_admin')
        )
    );

-- Moderation queue: Enhanced RLS for admin access
CREATE POLICY "Moderators can view assigned submissions" ON moderation_queue
    FOR SELECT USING (
        assigned_moderator = auth.uid() OR
        moderator_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM admin_profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Moderators can update assigned submissions" ON moderation_queue
    FOR UPDATE USING (
        assigned_moderator = auth.uid() OR
        moderator_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM admin_profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

-- Content analytics: Public read for transparency, admin write
CREATE POLICY "Public can view content analytics" ON content_analytics
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage content analytics" ON content_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

-- Creator sovereignty metrics: Public read for transparency
CREATE POLICY "Public can view sovereignty metrics" ON creator_sovereignty_metrics
    FOR SELECT USING (published_to_community = TRUE);

CREATE POLICY "Admins can manage sovereignty metrics" ON creator_sovereignty_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

-- ============================================================================
-- TRIGGERS FOR AUTOMATION
-- ============================================================================

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_admin_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_profiles_updated_at
    BEFORE UPDATE ON admin_profiles
    FOR EACH ROW EXECUTE FUNCTION update_admin_updated_at_column();

CREATE TRIGGER update_creator_sovereignty_metrics_updated_at
    BEFORE UPDATE ON creator_sovereignty_metrics
    FOR EACH ROW EXECUTE FUNCTION update_admin_updated_at_column();

-- Auto-assign moderation trigger
CREATE OR REPLACE FUNCTION auto_assign_moderation()
RETURNS TRIGGER AS $$
DECLARE
    available_moderator UUID;
BEGIN
    -- Only auto-assign if no moderator is already assigned
    IF NEW.assigned_moderator IS NULL AND NEW.status = 'pending' THEN
        -- Find available moderator with lowest current workload
        SELECT ap.user_id INTO available_moderator
        FROM admin_profiles ap
        LEFT JOIN (
            SELECT moderator_id, COUNT(*) as active_assignments
            FROM moderator_assignments
            WHERE status IN ('assigned', 'in_review')
            GROUP BY moderator_id
        ) ma ON ap.user_id = ma.moderator_id
        WHERE ap.role IN ('moderator', 'admin')
        AND ap.liberation_training_completed = TRUE
        ORDER BY COALESCE(ma.active_assignments, 0) ASC, ap.last_active_date DESC
        LIMIT 1;

        -- Assign if moderator found
        IF available_moderator IS NOT NULL THEN
            NEW.assigned_moderator = available_moderator;

            -- Create assignment record
            INSERT INTO moderator_assignments (
                moderator_id,
                submission_id,
                assigned_by,
                requires_cultural_review,
                requires_trauma_expertise
            ) VALUES (
                available_moderator,
                NEW.id,
                auth.uid(),
                CASE WHEN NEW.category IN ('culture', 'identity', 'liberation') THEN TRUE ELSE FALSE END,
                CASE WHEN NEW.content_data ? 'trauma_content' THEN TRUE ELSE FALSE END
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_assign_moderation_trigger
    BEFORE INSERT OR UPDATE ON moderation_queue
    FOR EACH ROW EXECUTE FUNCTION auto_assign_moderation();

-- ============================================================================
-- SAMPLE ADMIN DATA
-- ============================================================================

-- Create sample admin profiles (for development)
INSERT INTO admin_profiles (user_id, full_name, role, liberation_training_completed, cultural_competency_verified, trauma_informed_certified)
VALUES
    -- Use a placeholder UUID that would be replaced with real user IDs
    ('00000000-0000-0000-0000-000000000001', 'Liberation Platform Admin', 'super_admin', TRUE, TRUE, TRUE),
    ('00000000-0000-0000-0000-000000000002', 'Community Moderator 1', 'moderator', TRUE, TRUE, FALSE),
    ('00000000-0000-0000-0000-000000000003', 'Community Moderator 2', 'moderator', TRUE, FALSE, TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- Sample system health metrics
INSERT INTO system_health_metrics (metric_name, metric_value, metric_unit, metric_category)
VALUES
    ('moderation_queue_size', 12, 'submissions', 'moderation'),
    ('average_review_time', 24.5, 'hours', 'moderation'),
    ('creator_sovereignty_compliance', 75.5, 'percentage', 'liberation_values'),
    ('democratic_participation_rate', 85.2, 'percentage', 'governance'),
    ('community_engagement_score', 8.7, 'score', 'engagement')
ON CONFLICT DO NOTHING;

-- Sample creator sovereignty metrics
INSERT INTO creator_sovereignty_metrics (
    reporting_period_start,
    reporting_period_end,
    total_revenue_cents,
    creator_share_cents,
    creator_sovereignty_percentage,
    published_to_community
) VALUES (
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE,
    100000, -- $1000.00
    75500,  -- $755.00 (75.5%)
    75.50,
    TRUE
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- ADMIN DASHBOARD VIEWS
-- ============================================================================

-- Real-time admin dashboard summary
CREATE OR REPLACE VIEW admin_dashboard_summary AS
SELECT
    -- Moderation metrics
    COUNT(CASE WHEN mq.status = 'pending' AND mq.type = 'story' THEN 1 END) as pending_stories,
    COUNT(CASE WHEN mq.status = 'pending' AND mq.type = 'event' THEN 1 END) as pending_events,
    COUNT(CASE WHEN mq.status = 'approved' AND mq.reviewed_at >= CURRENT_DATE THEN 1 END) as approved_today,
    COUNT(CASE WHEN mq.submitted_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as weekly_submissions,

    -- Moderator metrics
    COUNT(DISTINCT ap.user_id) as total_moderators,
    AVG(ap.average_review_time) as avg_review_time,
    AVG(ap.approval_rate) as avg_approval_rate,

    -- Liberation values compliance
    (SELECT creator_sovereignty_percentage FROM creator_sovereignty_metrics
     ORDER BY reporting_period_end DESC LIMIT 1) as creator_sovereignty_rate,

    -- System health
    EXTRACT(EPOCH FROM NOW() - MAX(mq.submitted_at))/3600 as hours_since_last_submission

FROM moderation_queue mq
CROSS JOIN admin_profiles ap
WHERE ap.role IN ('moderator', 'admin', 'super_admin');

-- Moderation workload distribution
CREATE OR REPLACE VIEW moderator_workload AS
SELECT
    ap.user_id,
    ap.full_name,
    ap.role,
    COUNT(ma.id) as active_assignments,
    COUNT(CASE WHEN ma.status = 'assigned' THEN 1 END) as pending_reviews,
    COUNT(CASE WHEN ma.status = 'in_review' THEN 1 END) as in_progress,
    AVG(ap.average_review_time) as avg_review_time,
    ap.approval_rate,
    ap.last_active_date
FROM admin_profiles ap
LEFT JOIN moderator_assignments ma ON ap.user_id = ma.moderator_id
WHERE ap.role IN ('moderator', 'admin', 'super_admin')
GROUP BY ap.user_id, ap.full_name, ap.role, ap.average_review_time, ap.approval_rate, ap.last_active_date
ORDER BY active_assignments ASC, ap.last_active_date DESC;

-- ============================================================================
-- FUNCTIONS FOR API ENDPOINTS
-- ============================================================================

-- Get admin statistics (for API endpoint)
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE (
    pending_stories bigint,
    pending_events bigint,
    approved_today bigint,
    total_moderators bigint,
    weekly_submissions bigint,
    avg_processing_time_hours numeric,
    creator_sovereignty_rate numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM admin_dashboard_summary LIMIT 1;
END;
$$;

-- Get moderation queue with filters (for API endpoint)
CREATE OR REPLACE FUNCTION get_moderation_queue(
    filter_type TEXT DEFAULT NULL,
    filter_status TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    type VARCHAR,
    title TEXT,
    description TEXT,
    url TEXT,
    category VARCHAR,
    status VARCHAR,
    priority VARCHAR,
    submitted_at TIMESTAMPTZ,
    assigned_moderator UUID,
    moderator_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        mq.id,
        mq.type,
        mq.title,
        mq.description,
        mq.url,
        mq.category,
        mq.status,
        mq.priority,
        mq.submitted_at,
        mq.assigned_moderator,
        ap.full_name as moderator_name
    FROM moderation_queue mq
    LEFT JOIN admin_profiles ap ON mq.assigned_moderator = ap.user_id
    WHERE
        (filter_type IS NULL OR mq.type = filter_type) AND
        (filter_status IS NULL OR mq.status = filter_status)
    ORDER BY mq.submitted_at DESC
    LIMIT limit_count;
END;
$$;