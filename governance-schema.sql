-- BLKOUT Liberation Platform - Democratic Governance Database Schema
-- Community-owned liberation platform for Black queer communities
-- Democratic voting and governance system with trauma-informed design

-- ============================================================================
-- GOVERNANCE CORE TABLES
-- ============================================================================

-- Community Members (extends existing user system)
CREATE TABLE governance_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    community_id UUID NOT NULL, -- Support for multiple communities
    membership_status TEXT CHECK (membership_status IN ('active', 'inactive', 'suspended', 'pending')) DEFAULT 'pending',
    voting_weight INTEGER DEFAULT 1 CHECK (voting_weight >= 0 AND voting_weight <= 1), -- Democratic: always 1
    participation_level TEXT CHECK (participation_level IN ('observer', 'voter', 'proposer', 'facilitator', 'admin')) DEFAULT 'observer',

    -- Liberation values tracking
    creator_sovereignty_verified BOOLEAN DEFAULT FALSE,
    cultural_authenticity_verified BOOLEAN DEFAULT FALSE,
    trauma_informed_consent BOOLEAN DEFAULT TRUE,

    -- Community safety
    harassment_reports_count INTEGER DEFAULT 0,
    community_violations_count INTEGER DEFAULT 0,
    last_active_date TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Governance Proposals
CREATE TABLE governance_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposer_id UUID REFERENCES governance_members(id) ON DELETE SET NULL,
    community_id UUID NOT NULL,

    -- Proposal content
    title TEXT NOT NULL CHECK (char_length(title) >= 10 AND char_length(title) <= 200),
    description TEXT NOT NULL CHECK (char_length(description) >= 50),
    category TEXT CHECK (category IN ('platform_governance', 'community_guidelines', 'resource_allocation', 'policy_change', 'creator_sovereignty', 'safety_measures')) NOT NULL,

    -- Proposal metadata
    priority_level TEXT CHECK (priority_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    estimated_implementation_time INTERVAL,
    resource_requirements JSONB, -- structured data for costs, people, etc.

    -- Voting configuration
    voting_type TEXT CHECK (voting_type IN ('consensus', 'majority', 'supermajority', 'quadratic', 'weighted')) DEFAULT 'consensus',
    consensus_threshold DECIMAL(3,2) DEFAULT 0.80 CHECK (consensus_threshold BETWEEN 0.51 AND 1.00),
    voting_deadline TIMESTAMPTZ NOT NULL,
    anonymous_voting_allowed BOOLEAN DEFAULT TRUE,

    -- Proposal status
    status TEXT CHECK (status IN ('draft', 'active', 'voting', 'passed', 'rejected', 'implemented', 'archived')) DEFAULT 'draft',
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    voting_start_date TIMESTAMPTZ,
    decision_date TIMESTAMPTZ,
    implementation_date TIMESTAMPTZ,

    -- Community feedback
    discussion_thread_id UUID, -- Links to discussion system
    supporter_count INTEGER DEFAULT 0,
    opposition_count INTEGER DEFAULT 0,
    total_engagements INTEGER DEFAULT 0,

    -- Liberation values compliance
    creator_sovereignty_impact DECIMAL(3,2) CHECK (creator_sovereignty_impact BETWEEN -1.00 AND 1.00),
    community_safety_impact DECIMAL(3,2) CHECK (community_safety_impact BETWEEN -1.00 AND 1.00),
    cultural_authenticity_impact DECIMAL(3,2) CHECK (cultural_authenticity_impact BETWEEN -1.00 AND 1.00),
    democratic_governance_impact DECIMAL(3,2) CHECK (democratic_governance_impact BETWEEN -1.00 AND 1.00),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Governance Votes
CREATE TABLE governance_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES governance_proposals(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES governance_members(id) ON DELETE CASCADE,

    -- Vote data
    vote_choice TEXT CHECK (vote_choice IN ('support', 'oppose', 'abstain', 'block', 'delegate')) NOT NULL,
    vote_weight INTEGER DEFAULT 1 CHECK (vote_weight >= 0 AND vote_weight <= 1), -- Democratic: always 1
    is_anonymous BOOLEAN DEFAULT FALSE,

    -- Rationale (required for blocks and optional for others)
    rationale TEXT,
    confidence_level DECIMAL(3,2) CHECK (confidence_level BETWEEN 0.00 AND 1.00),

    -- Delegation (for delegate votes)
    delegated_to_member_id UUID REFERENCES governance_members(id),

    -- Vote metadata
    vote_timestamp TIMESTAMPTZ DEFAULT NOW(),
    last_modified TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicate votes per proposal per member
    UNIQUE(proposal_id, voter_id)
);

-- Consensus Building Discussions
CREATE TABLE governance_discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES governance_proposals(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES governance_members(id) ON DELETE SET NULL,

    -- Discussion content
    message TEXT NOT NULL CHECK (char_length(message) >= 1),
    discussion_type TEXT CHECK (discussion_type IN ('question', 'concern', 'support', 'amendment', 'clarification', 'consensus_check')) NOT NULL,

    -- Thread structure
    parent_message_id UUID REFERENCES governance_discussions(id),
    thread_depth INTEGER DEFAULT 0,

    -- Community moderation
    flagged_content BOOLEAN DEFAULT FALSE,
    moderation_status TEXT CHECK (moderation_status IN ('approved', 'pending', 'flagged', 'removed')) DEFAULT 'approved',
    moderator_notes TEXT,

    -- Engagement tracking
    upvotes_count INTEGER DEFAULT 0,
    responses_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRANSPARENCY & ACCOUNTABILITY TABLES
-- ============================================================================

-- Revenue Transparency Tracking
CREATE TABLE revenue_transparency (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL,
    reporting_period_start DATE NOT NULL,
    reporting_period_end DATE NOT NULL,

    -- Revenue breakdown (in cents to avoid float precision issues)
    total_revenue_cents BIGINT NOT NULL CHECK (total_revenue_cents >= 0),
    creator_share_cents BIGINT NOT NULL CHECK (creator_share_cents >= 0),
    platform_operations_cents BIGINT NOT NULL CHECK (platform_operations_cents >= 0),
    community_benefit_cents BIGINT NOT NULL CHECK (community_benefit_cents >= 0),
    external_costs_cents BIGINT NOT NULL CHECK (external_costs_cents >= 0),

    -- Sovereignty compliance
    creator_sovereignty_percentage DECIMAL(5,2) NOT NULL CHECK (creator_sovereignty_percentage >= 75.00),

    -- Transparency metadata
    published_date TIMESTAMPTZ DEFAULT NOW(),
    community_verified BOOLEAN DEFAULT FALSE,
    verification_votes_required INTEGER DEFAULT 10,
    verification_votes_received INTEGER DEFAULT 0,

    -- Annual summary flag
    is_annual_summary BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure no overlapping periods
    UNIQUE(community_id, reporting_period_start, reporting_period_end)
);

-- Resource Allocation Decisions
CREATE TABLE resource_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL,
    proposal_id UUID REFERENCES governance_proposals(id) ON DELETE SET NULL,

    -- Allocation details
    allocation_title TEXT NOT NULL,
    allocation_description TEXT,
    budget_amount_cents BIGINT NOT NULL CHECK (budget_amount_cents >= 0),
    allocation_category TEXT CHECK (allocation_category IN ('platform_development', 'community_support', 'creator_payments', 'moderation', 'infrastructure', 'events', 'advocacy')) NOT NULL,

    -- Decision process
    approved_by_proposal BOOLEAN DEFAULT FALSE,
    emergency_allocation BOOLEAN DEFAULT FALSE,
    allocated_date TIMESTAMPTZ DEFAULT NOW(),

    -- Implementation tracking
    implementation_status TEXT CHECK (implementation_status IN ('allocated', 'in_progress', 'completed', 'cancelled')) DEFAULT 'allocated',
    actual_spent_cents BIGINT DEFAULT 0,
    completion_date TIMESTAMPTZ,

    -- Impact assessment
    community_benefit_score DECIMAL(3,2) CHECK (community_benefit_score BETWEEN 0.00 AND 1.00),
    creator_sovereignty_score DECIMAL(3,2) CHECK (creator_sovereignty_score BETWEEN 0.00 AND 1.00),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMMUNITY SAFEGUARDS & PROTECTION TABLES
-- ============================================================================

-- Anti-Harassment System
CREATE TABLE harassment_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES governance_members(id) ON DELETE SET NULL,
    reported_member_id UUID REFERENCES governance_members(id) ON DELETE SET NULL,
    community_id UUID NOT NULL,

    -- Report details
    incident_description TEXT NOT NULL CHECK (char_length(incident_description) >= 20),
    incident_type TEXT CHECK (incident_type IN ('harassment', 'discrimination', 'hate_speech', 'doxxing', 'threats', 'spam', 'other')) NOT NULL,
    severity_level TEXT CHECK (severity_level IN ('low', 'medium', 'high', 'critical')) NOT NULL,

    -- Context
    incident_date TIMESTAMPTZ,
    incident_location TEXT, -- platform area where it occurred
    evidence_provided JSONB, -- structured evidence data

    -- Resolution process
    status TEXT CHECK (status IN ('submitted', 'under_review', 'investigating', 'resolved', 'escalated', 'dismissed')) DEFAULT 'submitted',
    assigned_moderator_id UUID REFERENCES governance_members(id),
    resolution_notes TEXT,
    resolution_date TIMESTAMPTZ,

    -- Community restorative justice
    requires_community_discussion BOOLEAN DEFAULT FALSE,
    mediation_requested BOOLEAN DEFAULT FALSE,
    mediation_completed BOOLEAN DEFAULT FALSE,

    -- Reporter protection
    anonymous_report BOOLEAN DEFAULT FALSE,
    reporter_protected BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cultural Authenticity Validation
CREATE TABLE cultural_authenticity_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL, -- Can reference various content types
    content_type TEXT CHECK (content_type IN ('proposal', 'discussion', 'news_article', 'event', 'story')) NOT NULL,
    validator_id UUID REFERENCES governance_members(id) ON DELETE SET NULL,
    community_id UUID NOT NULL,

    -- Validation criteria
    black_joy_representation BOOLEAN,
    queer_liberation_focus BOOLEAN,
    pan_african_values BOOLEAN,
    anti_oppression_alignment BOOLEAN,
    community_voice_centered BOOLEAN,

    -- Validation result
    authenticity_score DECIMAL(3,2) CHECK (authenticity_score BETWEEN 0.00 AND 1.00),
    validation_status TEXT CHECK (validation_status IN ('pending', 'approved', 'needs_revision', 'rejected')) DEFAULT 'pending',
    feedback_notes TEXT,

    -- Community input
    community_feedback_required BOOLEAN DEFAULT FALSE,
    community_consensus_reached BOOLEAN DEFAULT FALSE,

    validated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trauma-Informed Experience Tracking
CREATE TABLE trauma_informed_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES governance_members(id) ON DELETE CASCADE,
    interaction_type TEXT CHECK (interaction_type IN ('content_warning_triggered', 'safe_exit_used', 'support_resource_accessed', 'gentle_animation_preferred', 'consent_prompt_responded')) NOT NULL,

    -- Interaction context
    trigger_content_type TEXT,
    support_provided BOOLEAN DEFAULT FALSE,
    user_feedback_rating INTEGER CHECK (user_feedback_rating BETWEEN 1 AND 5),

    -- Privacy protection
    anonymized_data JSONB, -- non-identifying interaction data for improvement

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- REAL-TIME UPDATES & COORDINATION TABLES
-- ============================================================================

-- Governance Events Stream
CREATE TABLE governance_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL,
    event_type TEXT CHECK (event_type IN ('proposal_submitted', 'voting_started', 'vote_cast', 'consensus_reached', 'proposal_passed', 'proposal_rejected', 'discussion_started', 'member_joined', 'transparency_report')) NOT NULL,

    -- Event data
    entity_id UUID NOT NULL, -- ID of the proposal, vote, discussion, etc.
    entity_type TEXT NOT NULL, -- type of entity being referenced
    event_data JSONB, -- structured event details

    -- Real-time coordination
    websocket_channels TEXT[], -- channels to notify
    notification_sent BOOLEAN DEFAULT FALSE,

    -- Event metadata
    triggered_by_member_id UUID REFERENCES governance_members(id) ON DELETE SET NULL,
    event_timestamp TIMESTAMPTZ DEFAULT NOW(),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Governance queries
CREATE INDEX idx_governance_members_community ON governance_members(community_id, membership_status);
CREATE INDEX idx_governance_members_active ON governance_members(user_id, membership_status) WHERE membership_status = 'active';

-- Proposal queries
CREATE INDEX idx_proposals_active ON governance_proposals(community_id, status, voting_deadline) WHERE status IN ('active', 'voting');
CREATE INDEX idx_proposals_category ON governance_proposals(category, status);
CREATE INDEX idx_proposals_voting ON governance_proposals(voting_deadline) WHERE status = 'voting';

-- Vote queries
CREATE INDEX idx_votes_proposal ON governance_votes(proposal_id, vote_choice);
CREATE INDEX idx_votes_member ON governance_votes(voter_id, vote_timestamp);

-- Discussion queries
CREATE INDEX idx_discussions_proposal ON governance_discussions(proposal_id, created_at);
CREATE INDEX idx_discussions_thread ON governance_discussions(parent_message_id, thread_depth);

-- Transparency queries
CREATE INDEX idx_revenue_transparency_period ON revenue_transparency(community_id, reporting_period_start, reporting_period_end);
CREATE INDEX idx_resource_allocations_status ON resource_allocations(community_id, implementation_status);

-- Safety queries
CREATE INDEX idx_harassment_reports_status ON harassment_reports(community_id, status, created_at);
CREATE INDEX idx_cultural_authenticity_pending ON cultural_authenticity_checks(content_type, validation_status) WHERE validation_status = 'pending';

-- Event stream queries
CREATE INDEX idx_governance_events_community ON governance_events(community_id, event_type, event_timestamp);
CREATE INDEX idx_governance_events_notifications ON governance_events(notification_sent, event_timestamp) WHERE notification_sent = FALSE;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE governance_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_transparency ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE harassment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_authenticity_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_informed_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_events ENABLE ROW LEVEL SECURITY;

-- Governance Members: Members can see their own data and public community data
CREATE POLICY "Members can view community membership" ON governance_members
    FOR SELECT USING (
        auth.uid() = user_id OR
        membership_status = 'active'
    );

CREATE POLICY "Members can update their own profile" ON governance_members
    FOR UPDATE USING (auth.uid() = user_id);

-- Proposals: Public to community members, editable by proposers
CREATE POLICY "Community members can view proposals" ON governance_proposals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM governance_members
            WHERE user_id = auth.uid()
            AND community_id = governance_proposals.community_id
            AND membership_status = 'active'
        )
    );

CREATE POLICY "Members can create proposals" ON governance_proposals
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM governance_members
            WHERE user_id = auth.uid()
            AND community_id = governance_proposals.community_id
            AND participation_level IN ('proposer', 'facilitator', 'admin')
        )
    );

-- Votes: Members can view aggregate results, only own votes for detail
CREATE POLICY "Members can view vote results" ON governance_votes
    FOR SELECT USING (
        voter_id IN (
            SELECT id FROM governance_members WHERE user_id = auth.uid()
        ) OR
        is_anonymous = FALSE
    );

CREATE POLICY "Members can cast votes" ON governance_votes
    FOR INSERT WITH CHECK (
        voter_id IN (
            SELECT id FROM governance_members
            WHERE user_id = auth.uid()
            AND membership_status = 'active'
            AND participation_level IN ('voter', 'proposer', 'facilitator', 'admin')
        )
    );

-- ============================================================================
-- TRIGGERS FOR AUTOMATION
-- ============================================================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_governance_members_updated_at BEFORE UPDATE ON governance_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_governance_proposals_updated_at BEFORE UPDATE ON governance_proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_governance_discussions_updated_at BEFORE UPDATE ON governance_discussions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate governance events
CREATE OR REPLACE FUNCTION create_governance_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Determine event type based on table and operation
    DECLARE
        event_type_name TEXT;
        entity_id_val UUID;
        entity_type_name TEXT;
    BEGIN
        CASE TG_TABLE_NAME
            WHEN 'governance_proposals' THEN
                IF TG_OP = 'INSERT' THEN
                    event_type_name = 'proposal_submitted';
                ELSIF OLD.status != NEW.status THEN
                    CASE NEW.status
                        WHEN 'voting' THEN event_type_name = 'voting_started';
                        WHEN 'passed' THEN event_type_name = 'proposal_passed';
                        WHEN 'rejected' THEN event_type_name = 'proposal_rejected';
                        ELSE event_type_name = 'proposal_updated';
                    END CASE;
                END IF;
                entity_id_val = NEW.id;
                entity_type_name = 'proposal';

            WHEN 'governance_votes' THEN
                event_type_name = 'vote_cast';
                entity_id_val = NEW.id;
                entity_type_name = 'vote';

            WHEN 'governance_discussions' THEN
                IF TG_OP = 'INSERT' THEN
                    event_type_name = 'discussion_started';
                    entity_id_val = NEW.id;
                    entity_type_name = 'discussion';
                END IF;
        END CASE;

        -- Insert governance event if we have an event type
        IF event_type_name IS NOT NULL THEN
            INSERT INTO governance_events (
                community_id,
                event_type,
                entity_id,
                entity_type,
                event_data,
                triggered_by_member_id
            ) VALUES (
                COALESCE(NEW.community_id, (SELECT community_id FROM governance_proposals WHERE id = NEW.proposal_id)),
                event_type_name,
                entity_id_val,
                entity_type_name,
                jsonb_build_object(
                    'table', TG_TABLE_NAME,
                    'operation', TG_OP,
                    'timestamp', NOW()
                ),
                CASE TG_TABLE_NAME
                    WHEN 'governance_proposals' THEN NEW.proposer_id
                    WHEN 'governance_votes' THEN NEW.voter_id
                    WHEN 'governance_discussions' THEN NEW.participant_id
                END
            );
        END IF;

        RETURN COALESCE(NEW, OLD);
    END;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER governance_proposals_events AFTER INSERT OR UPDATE ON governance_proposals
    FOR EACH ROW EXECUTE FUNCTION create_governance_event();

CREATE TRIGGER governance_votes_events AFTER INSERT ON governance_votes
    FOR EACH ROW EXECUTE FUNCTION create_governance_event();

CREATE TRIGGER governance_discussions_events AFTER INSERT ON governance_discussions
    FOR EACH ROW EXECUTE FUNCTION create_governance_event();

-- ============================================================================
-- INITIAL DATA & CONFIGURATION
-- ============================================================================

-- Create default community (can be customized)
INSERT INTO governance_members (user_id, community_id, membership_status, participation_level, creator_sovereignty_verified, cultural_authenticity_verified)
VALUES
-- These would be replaced with actual user IDs in production
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'active', 'admin', TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active proposal summary
CREATE VIEW active_governance_proposals AS
SELECT
    p.id,
    p.title,
    p.description,
    p.category,
    p.voting_type,
    p.voting_deadline,
    p.status,
    p.submission_date,
    m.user_id as proposer_user_id,
    COUNT(v.id) as total_votes,
    COUNT(CASE WHEN v.vote_choice = 'support' THEN 1 END) as support_votes,
    COUNT(CASE WHEN v.vote_choice = 'oppose' THEN 1 END) as oppose_votes,
    COUNT(CASE WHEN v.vote_choice = 'abstain' THEN 1 END) as abstain_votes,
    COUNT(CASE WHEN v.vote_choice = 'block' THEN 1 END) as block_votes,
    ROUND(
        COUNT(CASE WHEN v.vote_choice = 'support' THEN 1 END)::DECIMAL /
        NULLIF(COUNT(v.id), 0) * 100, 2
    ) as support_percentage
FROM governance_proposals p
LEFT JOIN governance_members m ON p.proposer_id = m.id
LEFT JOIN governance_votes v ON p.id = v.proposal_id
WHERE p.status IN ('active', 'voting')
GROUP BY p.id, p.title, p.description, p.category, p.voting_type, p.voting_deadline, p.status, p.submission_date, m.user_id;

-- Community governance health metrics
CREATE VIEW community_governance_health AS
SELECT
    community_id,
    COUNT(DISTINCT CASE WHEN membership_status = 'active' THEN id END) as active_members,
    COUNT(DISTINCT CASE WHEN participation_level IN ('voter', 'proposer', 'facilitator', 'admin') THEN id END) as voting_members,
    COUNT(DISTINCT CASE WHEN participation_level IN ('proposer', 'facilitator', 'admin') THEN id END) as proposing_members,
    AVG(creator_sovereignty_verified::INTEGER) as sovereignty_verification_rate,
    AVG(cultural_authenticity_verified::INTEGER) as authenticity_verification_rate
FROM governance_members
GROUP BY community_id;