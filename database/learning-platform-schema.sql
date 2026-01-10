-- ============================================================================
-- BLKOUT LEARNING PLATFORM - Database Schema
-- ============================================================================
-- Liberation-focused learning infrastructure with IVOR AI integration
-- Created: January 10, 2026
-- Values: Cooperative learning, trauma-informed pedagogy, mutual skill sharing
-- ============================================================================

-- ============================================================================
-- LEARNING MODULES (Course/Lesson Content)
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Module metadata
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category TEXT CHECK (category IN (
        'cooperative_ownership',
        'democratic_governance',
        'digital_sovereignty',
        'trauma_informed_care',
        'economic_justice',
        'community_organizing',
        'cultural_heritage',
        'mental_wellness',
        'skill_development',
        'leadership'
    )) NOT NULL,

    -- Content structure
    content JSONB NOT NULL, -- Structured lesson content (sections, text, media, quizzes)
    learning_objectives TEXT[] NOT NULL,
    prerequisites UUID[], -- Array of module IDs that should be completed first

    -- Liberation values alignment
    liberation_values JSONB DEFAULT '{
        "cooperative_ownership": 0,
        "democratic_governance": 0,
        "data_sovereignty": 0,
        "trauma_informed": 0,
        "economic_justice": 0
    }', -- Score 0-10 for each value

    -- Module details
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    estimated_duration_minutes INTEGER NOT NULL DEFAULT 30,
    is_published BOOLEAN DEFAULT FALSE,

    -- IVOR integration
    ivor_lesson_plan JSONB, -- Conversational lesson delivery structure
    quiz_questions JSONB, -- Interactive quiz questions for IVOR

    -- Media resources
    featured_image_url TEXT,
    video_urls TEXT[],
    resource_links JSONB, -- Additional reading, external resources

    -- Metadata
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,

    -- Statistics
    enrollment_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,

    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
    ) STORED
);

-- ============================================================================
-- LEARNING PROGRESS (User enrollment and completion tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User and module relationship
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE NOT NULL,

    -- Progress tracking
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')) DEFAULT 'not_started',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (progress_percentage BETWEEN 0.00 AND 100.00),

    -- Completion data
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    time_spent_minutes INTEGER DEFAULT 0,

    -- Assessment results
    quiz_attempts INTEGER DEFAULT 0,
    quiz_score DECIMAL(5,2) CHECK (quiz_score BETWEEN 0.00 AND 100.00),
    quiz_passed BOOLEAN DEFAULT FALSE,
    passing_score_required DECIMAL(5,2) DEFAULT 70.00,

    -- Certificate generation
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_id UUID,
    certificate_issued_at TIMESTAMPTZ,

    -- Learning notes and reflections
    user_notes TEXT,
    reflection_responses JSONB, -- Answers to reflection prompts

    -- IVOR chat integration
    ivor_conversation_id UUID, -- Link to IVOR chat session for this module
    ivor_assistance_count INTEGER DEFAULT 0, -- Number of times user asked IVOR for help

    -- Bookmarking
    bookmarked BOOLEAN DEFAULT FALSE,
    bookmark_notes TEXT,

    -- Constraints
    UNIQUE(user_id, module_id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SKILL EXCHANGE (Community skill sharing marketplace)
-- ============================================================================

CREATE TABLE IF NOT EXISTS skill_exchange (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User offering or seeking skill
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

    -- Skill details
    skill_name TEXT NOT NULL,
    skill_category TEXT CHECK (skill_category IN (
        'technical', 'creative', 'organizing', 'wellness',
        'education', 'business', 'trades', 'care_work', 'other'
    )) NOT NULL,
    skill_type TEXT CHECK (skill_type IN ('offering', 'seeking')) NOT NULL,

    -- Description
    description TEXT NOT NULL,
    experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'intermediate',

    -- Availability
    availability JSONB DEFAULT '{}', -- Days/times available, timezone
    preferred_format TEXT[] DEFAULT ARRAY['in_person', 'online', 'recorded'], -- Learning/teaching format preferences

    -- Matching preferences
    max_participants INTEGER DEFAULT 1, -- 1 for one-on-one, higher for group sessions
    location TEXT, -- For in-person skill sharing
    language_preference TEXT[] DEFAULT ARRAY['English'],

    -- Compensation model (aligned with mutual aid values)
    compensation_type TEXT CHECK (compensation_type IN (
        'free', 'time_exchange', 'sliding_scale', 'mutual_aid_suggested', 'negotiable'
    )) DEFAULT 'free',
    suggested_exchange TEXT, -- e.g., "Trade for graphic design help" or "£20/hour sliding scale"

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_fulfilled BOOLEAN DEFAULT FALSE,

    -- Liberation values
    prioritize_marginalized BOOLEAN DEFAULT FALSE, -- Prioritize connections with most marginalized
    trauma_informed BOOLEAN DEFAULT TRUE,
    accessibility_notes TEXT,

    -- Connection tracking
    connection_count INTEGER DEFAULT 0,
    successful_exchanges INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SKILL EXCHANGE MATCHES (Track skill exchange connections)
-- ============================================================================

CREATE TABLE IF NOT EXISTS skill_exchange_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- The offering and seeking posts being matched
    offering_id UUID REFERENCES skill_exchange(id) ON DELETE CASCADE NOT NULL,
    seeking_id UUID REFERENCES skill_exchange(id) ON DELETE CASCADE NOT NULL,

    -- Match status
    status TEXT CHECK (status IN ('suggested', 'accepted', 'active', 'completed', 'cancelled')) DEFAULT 'suggested',

    -- Communication
    first_contact_at TIMESTAMPTZ,
    last_interaction_at TIMESTAMPTZ,

    -- Session tracking
    sessions_completed INTEGER DEFAULT 0,
    total_hours DECIMAL(5,2) DEFAULT 0.00,

    -- Feedback
    feedback_from_offerer TEXT,
    feedback_from_seeker TEXT,
    mutual_rating DECIMAL(3,2) CHECK (mutual_rating BETWEEN 0.00 AND 5.00),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MENTORSHIPS (Longer-term mentorship relationships)
-- ============================================================================

CREATE TABLE IF NOT EXISTS mentorships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Mentor-mentee relationship
    mentor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mentee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

    -- Mentorship focus
    focus_area TEXT NOT NULL, -- e.g., "Leadership development", "Cooperative business skills"
    goals TEXT[] NOT NULL, -- Specific goals for mentorship

    -- Status and timeline
    status TEXT CHECK (status IN ('proposed', 'active', 'paused', 'completed', 'terminated')) DEFAULT 'proposed',
    started_at TIMESTAMPTZ,
    expected_duration_months INTEGER DEFAULT 6,
    completed_at TIMESTAMPTZ,

    -- Structure
    meeting_frequency TEXT DEFAULT 'bi-weekly', -- e.g., "weekly", "bi-weekly", "monthly"
    preferred_communication TEXT[] DEFAULT ARRAY['video_call', 'phone', 'messaging'],

    -- Progress tracking
    sessions_held INTEGER DEFAULT 0,
    goals_achieved INTEGER DEFAULT 0,
    current_milestone TEXT,

    -- Check-ins and reflections
    last_check_in_at TIMESTAMPTZ,
    mentee_satisfaction_score DECIMAL(3,2) CHECK (mentee_satisfaction_score BETWEEN 0.00 AND 5.00),
    mentor_satisfaction_score DECIMAL(3,2) CHECK (mentor_satisfaction_score BETWEEN 0.00 AND 5.00),

    -- Liberation values alignment
    trauma_informed_approach BOOLEAN DEFAULT TRUE,
    accountability_practices JSONB, -- How accountability is maintained
    community_benefit TEXT, -- How this mentorship benefits broader community

    -- Notes
    mentor_notes TEXT, -- Private notes for mentor
    mentee_notes TEXT, -- Private notes for mentee
    shared_notes TEXT, -- Shared reflections and progress

    -- Matching metadata
    matched_by TEXT DEFAULT 'self_organized', -- 'self_organized', 'platform_suggested', 'admin_facilitated'
    match_criteria JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraint: Can't mentor yourself
    CHECK (mentor_id != mentee_id)
);

-- ============================================================================
-- LEARNING CERTIFICATES (Achievement tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Certificate details
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES learning_modules(id) ON DELETE SET NULL,
    progress_id UUID REFERENCES learning_progress(id) ON DELETE CASCADE,

    -- Certificate metadata
    certificate_name TEXT NOT NULL,
    certificate_type TEXT CHECK (certificate_type IN ('module_completion', 'skill_mastery', 'mentorship_completion', 'community_contribution')) DEFAULT 'module_completion',

    -- Verification
    verification_code TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- NULL for permanent certificates

    -- Achievement details
    score_achieved DECIMAL(5,2),
    skills_demonstrated TEXT[],
    liberation_values_demonstrated JSONB,

    -- Certificate rendering data
    certificate_data JSONB NOT NULL, -- All data needed to render/regenerate certificate
    pdf_url TEXT, -- If pre-generated PDF stored

    -- Social sharing
    shared_publicly BOOLEAN DEFAULT FALSE,
    share_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LEARNING PATHWAYS (Curated learning journeys)
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_pathways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Pathway metadata
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,

    -- Structure
    module_sequence UUID[] NOT NULL, -- Ordered array of learning_modules.id
    estimated_total_hours INTEGER,

    -- Liberation focus
    pathway_focus TEXT CHECK (pathway_focus IN (
        'cooperative_leadership',
        'community_organizer',
        'digital_sovereignty_advocate',
        'trauma_informed_facilitator',
        'economic_justice_educator'
    )),

    -- Metadata
    is_published BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LEARNING COMMUNITY (Discussion and peer support)
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Post details
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,

    -- Content
    post_type TEXT CHECK (post_type IN ('question', 'reflection', 'resource', 'celebration')) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,

    -- Community interaction
    reply_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,

    -- Moderation
    is_pinned BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Learning modules
CREATE INDEX IF NOT EXISTS idx_learning_modules_category ON learning_modules(category, is_published);
CREATE INDEX IF NOT EXISTS idx_learning_modules_difficulty ON learning_modules(difficulty_level, is_published);
CREATE INDEX IF NOT EXISTS idx_learning_modules_search ON learning_modules USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_learning_modules_published ON learning_modules(published_at DESC) WHERE is_published = TRUE;

-- Learning progress
CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_learning_progress_module ON learning_progress(module_id, status);
CREATE INDEX IF NOT EXISTS idx_learning_progress_completed ON learning_progress(completed_at DESC) WHERE completed_at IS NOT NULL;

-- Skill exchange
CREATE INDEX IF NOT EXISTS idx_skill_exchange_type ON skill_exchange(skill_type, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_skill_exchange_category ON skill_exchange(skill_category, skill_type, is_active);
CREATE INDEX IF NOT EXISTS idx_skill_exchange_user ON skill_exchange(user_id, is_active);

-- Mentorships
CREATE INDEX IF NOT EXISTS idx_mentorships_mentor ON mentorships(mentor_id, status);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentee ON mentorships(mentee_id, status);
CREATE INDEX IF NOT EXISTS idx_mentorships_active ON mentorships(status, started_at DESC) WHERE status = 'active';

-- Certificates
CREATE INDEX IF NOT EXISTS idx_certificates_user ON learning_certificates(user_id, issued_at DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_verification ON learning_certificates(verification_code) WHERE verification_code IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_exchange ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_exchange_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_community_posts ENABLE ROW LEVEL SECURITY;

-- Learning modules: Public read for published, creators can manage their own
CREATE POLICY "Public can view published modules" ON learning_modules
    FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Creators can manage their modules" ON learning_modules
    FOR ALL USING (created_by = auth.uid());

-- Learning progress: Users can only see their own progress
CREATE POLICY "Users can view own progress" ON learning_progress
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own progress" ON learning_progress
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can modify own progress" ON learning_progress
    FOR UPDATE USING (user_id = auth.uid());

-- Skill exchange: Users can view all active, manage their own
CREATE POLICY "Anyone can view active skill exchanges" ON skill_exchange
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can manage their skill posts" ON skill_exchange
    FOR ALL USING (user_id = auth.uid());

-- Skill exchange matches: Users can see their matches
CREATE POLICY "Users can view their matches" ON skill_exchange_matches
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM skill_exchange
            WHERE (id = offering_id OR id = seeking_id)
            AND user_id = auth.uid()
        )
    );

-- Mentorships: Participants can see their mentorships
CREATE POLICY "Participants can view their mentorships" ON mentorships
    FOR SELECT USING (mentor_id = auth.uid() OR mentee_id = auth.uid());

CREATE POLICY "Participants can update their mentorships" ON mentorships
    FOR UPDATE USING (mentor_id = auth.uid() OR mentee_id = auth.uid());

-- Certificates: Users can view their own, publicly shared ones visible to all
CREATE POLICY "Users can view own certificates" ON learning_certificates
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Public can view shared certificates" ON learning_certificates
    FOR SELECT USING (shared_publicly = TRUE);

-- Learning pathways: Public read for published
CREATE POLICY "Public can view published pathways" ON learning_pathways
    FOR SELECT USING (is_published = TRUE);

-- Community posts: All authenticated users can participate
CREATE POLICY "Authenticated users can view community posts" ON learning_community_posts
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create posts" ON learning_community_posts
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- TRIGGERS FOR AUTOMATION
-- ============================================================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_learning_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_learning_modules_timestamp
    BEFORE UPDATE ON learning_modules
    FOR EACH ROW EXECUTE FUNCTION update_learning_updated_at();

CREATE TRIGGER update_learning_progress_timestamp
    BEFORE UPDATE ON learning_progress
    FOR EACH ROW EXECUTE FUNCTION update_learning_updated_at();

CREATE TRIGGER update_skill_exchange_timestamp
    BEFORE UPDATE ON skill_exchange
    FOR EACH ROW EXECUTE FUNCTION update_learning_updated_at();

CREATE TRIGGER update_mentorships_timestamp
    BEFORE UPDATE ON mentorships
    FOR EACH ROW EXECUTE FUNCTION update_learning_updated_at();

-- Auto-generate certificate verification code
CREATE OR REPLACE FUNCTION generate_certificate_verification_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.verification_code IS NULL THEN
        NEW.verification_code = 'BLKOUT-' ||
            UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 8));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_certificate_code
    BEFORE INSERT ON learning_certificates
    FOR EACH ROW EXECUTE FUNCTION generate_certificate_verification_code();

-- Update module enrollment/completion counts
CREATE OR REPLACE FUNCTION update_module_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment enrollment count
        UPDATE learning_modules
        SET enrollment_count = enrollment_count + 1
        WHERE id = NEW.module_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'completed' AND NEW.status = 'completed' THEN
        -- Increment completion count
        UPDATE learning_modules
        SET completion_count = completion_count + 1
        WHERE id = NEW.module_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_module_stats
    AFTER INSERT OR UPDATE ON learning_progress
    FOR EACH ROW EXECUTE FUNCTION update_module_statistics();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active learning dashboard for users
CREATE OR REPLACE VIEW user_learning_dashboard AS
SELECT
    lp.user_id,
    lm.id as module_id,
    lm.title as module_title,
    lm.category,
    lm.difficulty_level,
    lp.status,
    lp.progress_percentage,
    lp.started_at,
    lp.last_accessed_at,
    lp.completed_at,
    lp.quiz_score,
    lp.certificate_issued,
    lm.estimated_duration_minutes,
    lm.liberation_values
FROM learning_progress lp
JOIN learning_modules lm ON lp.module_id = lm.id
WHERE lp.user_id = auth.uid()
ORDER BY lp.last_accessed_at DESC;

-- Available modules for discovery
CREATE OR REPLACE VIEW available_learning_modules AS
SELECT
    lm.id,
    lm.title,
    lm.slug,
    lm.description,
    lm.category,
    lm.difficulty_level,
    lm.estimated_duration_minutes,
    lm.liberation_values,
    lm.enrollment_count,
    lm.completion_count,
    lm.average_rating,
    lm.featured_image_url,
    -- Calculate completion rate
    CASE
        WHEN lm.enrollment_count > 0
        THEN ROUND((lm.completion_count::DECIMAL / lm.enrollment_count::DECIMAL * 100), 2)
        ELSE 0
    END as completion_rate
FROM learning_modules lm
WHERE lm.is_published = TRUE
ORDER BY lm.published_at DESC;

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Sample learning modules (5 core modules)
INSERT INTO learning_modules (title, slug, description, category, content, learning_objectives, difficulty_level, estimated_duration_minutes, is_published, liberation_values, ivor_lesson_plan, quiz_questions)
VALUES
(
    'Cooperative Ownership 101',
    'cooperative-ownership-101',
    'Learn the fundamentals of cooperative business models, democratic ownership structures, and how they center liberation values over profit extraction.',
    'cooperative_ownership',
    '{"sections": [
        {"title": "What is a Cooperative?", "content": "A cooperative is a business owned and democratically controlled by its members...", "duration_minutes": 10},
        {"title": "Types of Cooperatives", "content": "Worker cooperatives, consumer cooperatives, housing cooperatives...", "duration_minutes": 15},
        {"title": "BLKOUT as a Cooperative", "content": "How BLKOUT embodies cooperative principles...", "duration_minutes": 15}
    ]}'::jsonb,
    ARRAY['Understand cooperative business structures', 'Identify benefits of democratic ownership', 'Apply cooperative principles to community projects'],
    'beginner',
    40,
    TRUE,
    '{"cooperative_ownership": 10, "democratic_governance": 8, "economic_justice": 9}'::jsonb,
    '{"intro": "Welcome to Cooperative Ownership 101! I''m IVOR, and I''ll be guiding you through this journey...", "sections": [{"topic": "cooperatives_basics", "conversational_points": ["What does ownership mean to you?", "Have you ever been part of a group decision?"]}]}'::jsonb,
    '[{"question": "What distinguishes a cooperative from a traditional business?", "options": ["Democratic member control", "Profit maximization", "Hierarchical management", "Investor ownership"], "correct": 0, "explanation": "Cooperatives are distinguished by democratic member control, where each member has an equal say."}]'::jsonb
),
(
    'Democratic Decision-Making Skills',
    'democratic-decision-making',
    'Master consensus-building, facilitation techniques, and trauma-informed meeting practices for effective community governance.',
    'democratic_governance',
    '{"sections": [
        {"title": "Foundations of Democratic Practice", "content": "Democratic decision-making ensures every voice is heard...", "duration_minutes": 12},
        {"title": "Consensus vs. Majority Vote", "content": "Understanding different decision-making models...", "duration_minutes": 18},
        {"title": "Facilitation Skills", "content": "How to guide effective, inclusive meetings...", "duration_minutes": 20}
    ]}'::jsonb,
    ARRAY['Facilitate inclusive meetings', 'Build consensus in diverse groups', 'Handle conflict constructively', 'Apply trauma-informed facilitation'],
    'intermediate',
    50,
    TRUE,
    '{"cooperative_ownership": 7, "democratic_governance": 10, "trauma_informed": 9}'::jsonb,
    '{"intro": "Let''s explore how to make decisions together in ways that honor everyone''s voice...", "interactive_exercises": true}'::jsonb,
    '[{"question": "In consensus decision-making, what happens when one person blocks a proposal?", "options": ["The proposal fails", "That person is overruled", "The group seeks modifications", "A majority vote is taken"], "correct": 2, "explanation": "In consensus, blocks trigger further discussion to find modifications that work for everyone."}]'::jsonb
),
(
    'Digital Sovereignty & Privacy',
    'digital-sovereignty-privacy',
    'Understand data ownership, platform alternatives, and how to protect your digital autonomy in an age of surveillance capitalism.',
    'digital_sovereignty',
    '{"sections": [
        {"title": "What is Digital Sovereignty?", "content": "Digital sovereignty means you control your data, identity, and digital presence...", "duration_minutes": 15},
        {"title": "Surveillance Capitalism", "content": "How Big Tech profits from your data...", "duration_minutes": 20},
        {"title": "Tools for Digital Autonomy", "content": "Open source alternatives, encrypted communication, self-hosted services...", "duration_minutes": 25}
    ]}'::jsonb,
    ARRAY['Understand data extraction business models', 'Identify privacy risks in daily tech use', 'Use privacy-preserving tools', 'Advocate for data rights'],
    'intermediate',
    60,
    TRUE,
    '{"cooperative_ownership": 6, "data_sovereignty": 10, "economic_justice": 7}'::jsonb,
    '{"intro": "Your data is yours. Let''s learn how to keep it that way...", "practical_tools": ["Signal", "ProtonMail", "Nextcloud"]}'::jsonb,
    '[{"question": "What does it mean when a service is ''free''?", "options": ["No cost to anyone", "You pay with your data", "The government funds it", "It uses open source"], "correct": 1, "explanation": "Most ''free'' services monetize by collecting and selling your data."}]'::jsonb
),
(
    'Trauma-Informed Community Care',
    'trauma-informed-community-care',
    'Build skills in trauma awareness, healing-centered practices, and creating safer spaces for Black queer communities.',
    'trauma_informed_care',
    '{"sections": [
        {"title": "Understanding Trauma", "content": "Trauma is a response to overwhelming experiences that exceed our capacity to cope...", "duration_minutes": 18},
        {"title": "Trauma in Marginalized Communities", "content": "Systemic oppression as ongoing trauma...", "duration_minutes": 22},
        {"title": "Creating Safer Spaces", "content": "Practices for trauma-informed community building...", "duration_minutes": 25}
    ]}'::jsonb,
    ARRAY['Recognize trauma responses', 'Practice trauma-informed communication', 'Create healing-centered spaces', 'Support community resilience'],
    'intermediate',
    65,
    TRUE,
    '{"cooperative_ownership": 6, "trauma_informed": 10, "democratic_governance": 7}'::jsonb,
    '{"intro": "Healing is a community practice. Let''s learn how to hold space for each other...", "content_warnings": true}'::jsonb,
    '[{"question": "What is a key principle of trauma-informed care?", "options": ["Fixing people", "Safety and trustworthiness", "Forgetting the past", "Individual responsibility"], "correct": 1, "explanation": "Trauma-informed care prioritizes safety, trustworthiness, and understanding the impact of trauma."}]'::jsonb
),
(
    'Economic Justice & Mutual Aid',
    'economic-justice-mutual-aid',
    'Explore wealth redistribution, mutual aid networks, and alternative economic models that center community wellbeing over profit.',
    'economic_justice',
    '{"sections": [
        {"title": "Capitalism vs. Community Economics", "content": "How extraction economies harm marginalized communities...", "duration_minutes": 20},
        {"title": "Mutual Aid Principles", "content": "Solidarity not charity - building networks of care...", "duration_minutes": 20},
        {"title": "Building Economic Power", "content": "Credit unions, time banks, community land trusts...", "duration_minutes": 25}
    ]}'::jsonb,
    ARRAY['Understand economic oppression', 'Organize mutual aid networks', 'Build community wealth', 'Practice solidarity economics'],
    'intermediate',
    65,
    TRUE,
    '{"cooperative_ownership": 9, "economic_justice": 10, "democratic_governance": 8}'::jsonb,
    '{"intro": "We keep us safe, we keep us fed. Let''s explore how economics can serve liberation...", "action_steps": true}'::jsonb,
    '[{"question": "What distinguishes mutual aid from charity?", "options": ["Amount of money", "Reciprocity and solidarity", "Tax deductions", "Professional management"], "correct": 1, "explanation": "Mutual aid is based on reciprocity and solidarity, not top-down charity models."}]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- API FUNCTIONS FOR FRONTEND
-- ============================================================================

-- Enroll in a module
CREATE OR REPLACE FUNCTION enroll_in_module(p_module_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_progress_id UUID;
BEGIN
    -- Check if already enrolled
    SELECT id INTO v_progress_id
    FROM learning_progress
    WHERE user_id = auth.uid() AND module_id = p_module_id;

    IF v_progress_id IS NULL THEN
        -- Create new enrollment
        INSERT INTO learning_progress (user_id, module_id, status, progress_percentage)
        VALUES (auth.uid(), p_module_id, 'in_progress', 0.00)
        RETURNING id INTO v_progress_id;
    END IF;

    RETURN v_progress_id;
END;
$$;

-- Update progress
CREATE OR REPLACE FUNCTION update_learning_progress(
    p_module_id UUID,
    p_progress_percentage DECIMAL,
    p_time_spent_minutes INTEGER DEFAULT 0
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE learning_progress
    SET
        progress_percentage = p_progress_percentage,
        time_spent_minutes = time_spent_minutes + p_time_spent_minutes,
        last_accessed_at = NOW(),
        status = CASE
            WHEN p_progress_percentage >= 100 THEN 'completed'
            ELSE 'in_progress'
        END,
        completed_at = CASE
            WHEN p_progress_percentage >= 100 AND completed_at IS NULL THEN NOW()
            ELSE completed_at
        END
    WHERE user_id = auth.uid() AND module_id = p_module_id;

    RETURN FOUND;
END;
$$;

-- Submit quiz results
CREATE OR REPLACE FUNCTION submit_quiz_results(
    p_module_id UUID,
    p_score DECIMAL,
    p_passing_score DECIMAL DEFAULT 70.00
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_passed BOOLEAN;
BEGIN
    v_passed := p_score >= p_passing_score;

    UPDATE learning_progress
    SET
        quiz_attempts = quiz_attempts + 1,
        quiz_score = p_score,
        quiz_passed = v_passed,
        passing_score_required = p_passing_score,
        last_accessed_at = NOW()
    WHERE user_id = auth.uid() AND module_id = p_module_id;

    RETURN v_passed;
END;
$$;

-- Generate certificate
CREATE OR REPLACE FUNCTION generate_learning_certificate(p_module_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_certificate_id UUID;
    v_module_title TEXT;
    v_score DECIMAL;
    v_progress_id UUID;
BEGIN
    -- Get module info and user score
    SELECT lm.title, lp.quiz_score, lp.id
    INTO v_module_title, v_score, v_progress_id
    FROM learning_modules lm
    JOIN learning_progress lp ON lm.id = lp.module_id
    WHERE lm.id = p_module_id
    AND lp.user_id = auth.uid()
    AND lp.completed_at IS NOT NULL
    AND lp.quiz_passed = TRUE;

    IF v_module_title IS NULL THEN
        RAISE EXCEPTION 'Module not completed or quiz not passed';
    END IF;

    -- Create certificate
    INSERT INTO learning_certificates (
        user_id,
        module_id,
        progress_id,
        certificate_name,
        certificate_type,
        score_achieved,
        certificate_data
    ) VALUES (
        auth.uid(),
        p_module_id,
        v_progress_id,
        v_module_title,
        'module_completion',
        v_score,
        jsonb_build_object(
            'module_title', v_module_title,
            'score', v_score,
            'issued_date', NOW()
        )
    )
    RETURNING id INTO v_certificate_id;

    -- Update progress record
    UPDATE learning_progress
    SET
        certificate_issued = TRUE,
        certificate_id = v_certificate_id,
        certificate_issued_at = NOW()
    WHERE id = v_progress_id;

    RETURN v_certificate_id;
END;
$$;

-- ============================================================================
-- GRANTS (Ensure authenticated users can access)
-- ============================================================================

GRANT SELECT ON learning_modules TO authenticated;
GRANT SELECT, INSERT, UPDATE ON learning_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE ON skill_exchange TO authenticated;
GRANT SELECT ON skill_exchange_matches TO authenticated;
GRANT SELECT, INSERT, UPDATE ON mentorships TO authenticated;
GRANT SELECT ON learning_certificates TO authenticated;
GRANT SELECT ON learning_pathways TO authenticated;
GRANT SELECT, INSERT, UPDATE ON learning_community_posts TO authenticated;

GRANT EXECUTE ON FUNCTION enroll_in_module TO authenticated;
GRANT EXECUTE ON FUNCTION update_learning_progress TO authenticated;
GRANT EXECUTE ON FUNCTION submit_quiz_results TO authenticated;
GRANT EXECUTE ON FUNCTION generate_learning_certificate TO authenticated;

-- ============================================================================
-- COMPLETE
-- ============================================================================

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'BLKOUT Learning Platform schema created successfully!';
    RAISE NOTICE 'Created tables: learning_modules, learning_progress, skill_exchange, mentorships, certificates';
    RAISE NOTICE 'Inserted 5 liberation-focused sample modules';
    RAISE NOTICE 'Ready for IVOR integration and frontend development';
END $$;
