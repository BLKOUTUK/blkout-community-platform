-- BLKOUT Governance MVP - Simplified Democratic System
-- For 500 members: Simple, functional, high participation
-- Build time: 2-3 hours (not 10-13)

-- ============================================================================
-- SIMPLIFIED GOVERNANCE TABLES
-- ============================================================================

-- Members who can participate in governance
CREATE TABLE IF NOT EXISTS governance_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Basic info
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,

    -- Participation
    membership_status TEXT CHECK (membership_status IN ('pending', 'active', 'inactive')) DEFAULT 'pending',
    can_vote BOOLEAN DEFAULT FALSE,
    can_propose BOOLEAN DEFAULT FALSE,

    -- Stats
    proposals_created INTEGER DEFAULT 0,
    votes_cast INTEGER DEFAULT 0,
    last_active_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Community proposals
CREATE TABLE IF NOT EXISTS governance_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposer_id UUID REFERENCES governance_members(id) ON DELETE SET NULL,

    -- Content
    title TEXT NOT NULL CHECK (char_length(title) BETWEEN 10 AND 200),
    description TEXT NOT NULL CHECK (char_length(description) >= 50),
    category TEXT CHECK (category IN ('platform', 'community', 'resources', 'policy', 'other')) NOT NULL,

    -- Voting
    status TEXT CHECK (status IN ('draft', 'active', 'closed')) DEFAULT 'draft',
    voting_deadline TIMESTAMPTZ,
    votes_required_percentage DECIMAL(3,2) DEFAULT 0.60, -- 60% to pass

    -- Results (cached for performance)
    total_votes INTEGER DEFAULT 0,
    support_votes INTEGER DEFAULT 0,
    oppose_votes INTEGER DEFAULT 0,
    abstain_votes INTEGER DEFAULT 0,
    support_percentage DECIMAL(5,2) DEFAULT 0.00,

    -- Outcome
    passed BOOLEAN,
    decision_date TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simple votes (one per member per proposal)
CREATE TABLE IF NOT EXISTS governance_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES governance_proposals(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES governance_members(id) ON DELETE CASCADE,

    -- Vote
    vote_choice TEXT CHECK (vote_choice IN ('support', 'oppose', 'abstain')) NOT NULL,
    comment TEXT, -- Optional explanation

    voted_at TIMESTAMPTZ DEFAULT NOW(),

    -- One vote per member per proposal
    UNIQUE(proposal_id, voter_id)
);

-- Simple comments (flat, no threading)
CREATE TABLE IF NOT EXISTS governance_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES governance_proposals(id) ON DELETE CASCADE,
    commenter_id UUID REFERENCES governance_members(id) ON DELETE SET NULL,

    -- Content
    comment TEXT NOT NULL CHECK (char_length(comment) >= 1),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUTOMATIC VOTE TALLYING
-- ============================================================================

-- Update proposal vote counts when vote is cast
CREATE OR REPLACE FUNCTION update_proposal_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE governance_proposals
    SET
        total_votes = (SELECT COUNT(*) FROM governance_votes WHERE proposal_id = NEW.proposal_id),
        support_votes = (SELECT COUNT(*) FROM governance_votes WHERE proposal_id = NEW.proposal_id AND vote_choice = 'support'),
        oppose_votes = (SELECT COUNT(*) FROM governance_votes WHERE proposal_id = NEW.proposal_id AND vote_choice = 'oppose'),
        abstain_votes = (SELECT COUNT(*) FROM governance_votes WHERE proposal_id = NEW.proposal_id AND vote_choice = 'abstain'),
        support_percentage = ROUND(
            (SELECT COUNT(*) FROM governance_votes WHERE proposal_id = NEW.proposal_id AND vote_choice = 'support')::DECIMAL /
            NULLIF((SELECT COUNT(*) FROM governance_votes WHERE proposal_id = NEW.proposal_id), 0) * 100,
            2
        ),
        updated_at = NOW()
    WHERE id = NEW.proposal_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vote_counts_on_insert
AFTER INSERT ON governance_votes
FOR EACH ROW EXECUTE FUNCTION update_proposal_vote_counts();

CREATE TRIGGER update_vote_counts_on_update
AFTER UPDATE ON governance_votes
FOR EACH ROW EXECUTE FUNCTION update_proposal_vote_counts();

CREATE TRIGGER update_vote_counts_on_delete
AFTER DELETE ON governance_votes
FOR EACH ROW EXECUTE FUNCTION update_proposal_vote_counts();

-- Update member stats when they create proposal
CREATE OR REPLACE FUNCTION update_member_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE governance_members
    SET
        proposals_created = proposals_created + 1,
        updated_at = NOW()
    WHERE id = NEW.proposer_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_proposal_count_on_insert
AFTER INSERT ON governance_proposals
FOR EACH ROW EXECUTE FUNCTION update_member_proposal_count();

-- Update member stats when they vote
CREATE OR REPLACE FUNCTION update_member_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE governance_members
    SET
        votes_cast = votes_cast + 1,
        last_active_at = NOW(),
        updated_at = NOW()
    WHERE id = NEW.voter_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vote_count_on_insert
AFTER INSERT ON governance_votes
FOR EACH ROW EXECUTE FUNCTION update_member_vote_count();

-- ============================================================================
-- ROW LEVEL SECURITY (Simplified)
-- ============================================================================

ALTER TABLE governance_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_comments ENABLE ROW LEVEL SECURITY;

-- Members can view their own data and other active members
CREATE POLICY "Members can view community" ON governance_members
    FOR SELECT USING (
        auth.uid() = user_id OR membership_status = 'active'
    );

CREATE POLICY "Members can update own profile" ON governance_members
    FOR UPDATE USING (auth.uid() = user_id);

-- Anyone can view active proposals
CREATE POLICY "Anyone can view active proposals" ON governance_proposals
    FOR SELECT USING (status IN ('active', 'closed'));

-- Members can view their own drafts
CREATE POLICY "View own draft proposals" ON governance_proposals
    FOR SELECT USING (
        proposer_id IN (SELECT id FROM governance_members WHERE user_id = auth.uid())
    );

-- Members with can_propose can create proposals
CREATE POLICY "Proposers can create" ON governance_proposals
    FOR INSERT WITH CHECK (
        proposer_id IN (
            SELECT id FROM governance_members
            WHERE user_id = auth.uid()
            AND membership_status = 'active'
            AND can_propose = TRUE
        )
    );

-- Active members can vote
CREATE POLICY "Active members can vote" ON governance_votes
    FOR INSERT WITH CHECK (
        voter_id IN (
            SELECT id FROM governance_members
            WHERE user_id = auth.uid()
            AND membership_status = 'active'
            AND can_vote = TRUE
        )
    );

-- Members can view all votes on active proposals
CREATE POLICY "View votes on active proposals" ON governance_votes
    FOR SELECT USING (
        proposal_id IN (SELECT id FROM governance_proposals WHERE status IN ('active', 'closed'))
    );

-- Anyone can view comments
CREATE POLICY "Anyone can view comments" ON governance_comments
    FOR SELECT USING (TRUE);

-- Active members can comment
CREATE POLICY "Members can comment" ON governance_comments
    FOR INSERT WITH CHECK (
        commenter_id IN (
            SELECT id FROM governance_members
            WHERE user_id = auth.uid()
            AND membership_status = 'active'
        )
    );

-- ============================================================================
-- SAMPLE DATA (12 governance members as mentioned in audit)
-- ============================================================================

-- Note: Replace with real user_ids from auth.users in production
INSERT INTO governance_members (full_name, email, membership_status, can_vote, can_propose)
VALUES
    ('Sample Member 1', 'member1@example.com', 'active', TRUE, TRUE),
    ('Sample Member 2', 'member2@example.com', 'active', TRUE, TRUE),
    ('Sample Member 3', 'member3@example.com', 'active', TRUE, FALSE),
    ('Sample Member 4', 'member4@example.com', 'active', TRUE, FALSE),
    ('Sample Member 5', 'member5@example.com', 'active', TRUE, FALSE),
    ('Sample Member 6', 'member6@example.com', 'active', TRUE, FALSE),
    ('Sample Member 7', 'member7@example.com', 'active', TRUE, FALSE),
    ('Sample Member 8', 'member8@example.com', 'active', TRUE, FALSE),
    ('Sample Member 9', 'member9@example.com', 'pending', FALSE, FALSE),
    ('Sample Member 10', 'member10@example.com', 'pending', FALSE, FALSE),
    ('Sample Member 11', 'member11@example.com', 'pending', FALSE, FALSE),
    ('Sample Member 12', 'member12@example.com', 'pending', FALSE, FALSE)
ON CONFLICT (user_id) DO NOTHING;

-- Sample proposal for testing
INSERT INTO governance_proposals (
    title,
    description,
    category,
    status,
    voting_deadline,
    proposer_id
)
SELECT
    'Should we add a community mutual aid fund?',
    'Proposal to allocate 10% of shop revenue to a mutual aid fund that members can apply to for financial support during hardship. This aligns with our values of economic justice and community care.',
    'resources',
    'active',
    NOW() + INTERVAL '7 days',
    id
FROM governance_members
WHERE email = 'member1@example.com'
LIMIT 1;

-- ============================================================================
-- USEFUL VIEWS
-- ============================================================================

-- Active proposals with vote counts
CREATE OR REPLACE VIEW active_proposals_summary AS
SELECT
    p.id,
    p.title,
    p.description,
    p.category,
    p.status,
    p.voting_deadline,
    p.total_votes,
    p.support_votes,
    p.oppose_votes,
    p.abstain_votes,
    p.support_percentage,
    p.passed,
    m.full_name as proposer_name,
    (SELECT COUNT(*) FROM governance_comments WHERE proposal_id = p.id) as comment_count,
    CASE
        WHEN p.status = 'active' AND p.voting_deadline > NOW() THEN
            EXTRACT(EPOCH FROM (p.voting_deadline - NOW()))/86400
        ELSE 0
    END as days_remaining
FROM governance_proposals p
LEFT JOIN governance_members m ON p.proposer_id = m.id
WHERE p.status IN ('active', 'closed')
ORDER BY p.created_at DESC;

-- Member governance stats
CREATE OR REPLACE VIEW member_governance_stats AS
SELECT
    m.id,
    m.full_name,
    m.membership_status,
    m.can_vote,
    m.can_propose,
    m.proposals_created,
    m.votes_cast,
    m.last_active_at,
    ROUND(
        m.votes_cast::DECIMAL / NULLIF((SELECT COUNT(*) FROM governance_proposals WHERE status = 'closed'), 0) * 100,
        2
    ) as participation_rate
FROM governance_members m
WHERE m.membership_status = 'active';
