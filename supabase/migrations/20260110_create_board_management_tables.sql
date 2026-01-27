-- BLKOUT Governance Board Management - Database Schema
-- Inspired by Zeck.app and UK charity governance best practices
-- Date: January 10, 2026

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. BOARD MEMBERS TABLE
-- =====================================================
CREATE TABLE board_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('chair', 'vice_chair', 'secretary', 'treasurer', 'trustee', 'member')) DEFAULT 'member',
  appointed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  term_end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  email TEXT,
  phone TEXT,
  skills TEXT[],
  conflicts_of_interest JSONB DEFAULT '[]'::jsonb,
  trustee_declaration_signed BOOLEAN DEFAULT FALSE,
  induction_completed BOOLEAN DEFAULT FALSE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for active board members
CREATE INDEX idx_board_members_active ON board_members(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_board_members_user_id ON board_members(user_id);
CREATE INDEX idx_board_members_role ON board_members(role);

-- =====================================================
-- 2. BOARD MEETINGS TABLE
-- =====================================================
CREATE TABLE board_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_date TIMESTAMPTZ NOT NULL,
  meeting_type TEXT CHECK (meeting_type IN ('regular', 'emergency', 'agm', 'egm', 'special')) DEFAULT 'regular',
  location TEXT,
  meeting_format TEXT CHECK (meeting_format IN ('in_person', 'virtual', 'hybrid')) DEFAULT 'virtual',
  chair_id UUID REFERENCES board_members(id) ON DELETE SET NULL,
  secretary_id UUID REFERENCES board_members(id) ON DELETE SET NULL,
  quorum_required INTEGER DEFAULT 3,
  quorum_met BOOLEAN,
  agenda JSONB DEFAULT '[]'::jsonb,
  attendees JSONB DEFAULT '[]'::jsonb,
  apologies JSONB DEFAULT '[]'::jsonb,
  minutes_draft TEXT,
  minutes_approved BOOLEAN DEFAULT FALSE,
  minutes_approved_at TIMESTAMPTZ,
  minutes_approved_by UUID REFERENCES board_members(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  meeting_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for meeting queries
CREATE INDEX idx_board_meetings_date ON board_meetings(meeting_date DESC);
CREATE INDEX idx_board_meetings_status ON board_meetings(status);
CREATE INDEX idx_board_meetings_type ON board_meetings(meeting_type);

-- =====================================================
-- 3. BOARD DECISIONS TABLE
-- =====================================================
CREATE TABLE board_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES board_meetings(id) ON DELETE SET NULL,
  resolution_number TEXT UNIQUE,
  proposal_title TEXT NOT NULL,
  proposal_content TEXT NOT NULL,
  proposed_by UUID REFERENCES board_members(id) ON DELETE SET NULL,
  seconded_by UUID REFERENCES board_members(id) ON DELETE SET NULL,
  voting_opens_at TIMESTAMPTZ,
  voting_deadline TIMESTAMPTZ,
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  votes_abstain INTEGER DEFAULT 0,
  decision_outcome TEXT CHECK (decision_outcome IN ('pending', 'approved', 'rejected', 'deferred', 'withdrawn')),
  decision_date TIMESTAMPTZ,
  implementation_status TEXT CHECK (implementation_status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  impact_areas TEXT[],
  financial_impact DECIMAL(10, 2),
  rationale TEXT,
  implementation_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for decision queries
CREATE INDEX idx_board_decisions_meeting ON board_decisions(meeting_id);
CREATE INDEX idx_board_decisions_outcome ON board_decisions(decision_outcome);
CREATE INDEX idx_board_decisions_date ON board_decisions(created_at DESC);
CREATE UNIQUE INDEX idx_board_decisions_resolution_number ON board_decisions(resolution_number) WHERE resolution_number IS NOT NULL;

-- =====================================================
-- 4. BOARD VOTES TABLE
-- =====================================================
CREATE TABLE board_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES board_decisions(id) ON DELETE CASCADE,
  board_member_id UUID REFERENCES board_members(id) ON DELETE CASCADE,
  vote TEXT CHECK (vote IN ('for', 'against', 'abstain')) NOT NULL,
  rationale TEXT,
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(decision_id, board_member_id)
);

-- Indexes for vote queries
CREATE INDEX idx_board_votes_decision ON board_votes(decision_id);
CREATE INDEX idx_board_votes_member ON board_votes(board_member_id);

-- =====================================================
-- 5. BOARD ACTIONS TABLE
-- =====================================================
CREATE TABLE board_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES board_meetings(id) ON DELETE SET NULL,
  decision_id UUID REFERENCES board_decisions(id) ON DELETE SET NULL,
  action_description TEXT NOT NULL,
  assigned_to UUID REFERENCES board_members(id) ON DELETE SET NULL,
  deadline DATE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'carried_forward', 'cancelled')) DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  completion_notes TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for action tracking
CREATE INDEX idx_board_actions_meeting ON board_actions(meeting_id);
CREATE INDEX idx_board_actions_assigned ON board_actions(assigned_to);
CREATE INDEX idx_board_actions_status ON board_actions(status);
CREATE INDEX idx_board_actions_deadline ON board_actions(deadline) WHERE status != 'completed';

-- =====================================================
-- 6. BOARD DOCUMENTS TABLE
-- =====================================================
CREATE TABLE board_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES board_meetings(id) ON DELETE SET NULL,
  document_type TEXT CHECK (document_type IN ('constitution', 'policy', 'minutes', 'report', 'financial', 'agenda', 'resolution', 'other')) DEFAULT 'other',
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  version INTEGER DEFAULT 1,
  uploaded_by UUID REFERENCES board_members(id) ON DELETE SET NULL,
  requires_signature BOOLEAN DEFAULT FALSE,
  signatures JSONB DEFAULT '[]'::jsonb,
  tags TEXT[],
  is_confidential BOOLEAN DEFAULT FALSE,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for document queries
CREATE INDEX idx_board_documents_meeting ON board_documents(meeting_id);
CREATE INDEX idx_board_documents_type ON board_documents(document_type);
CREATE INDEX idx_board_documents_uploaded ON board_documents(uploaded_by);
CREATE INDEX idx_board_documents_created ON board_documents(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_documents ENABLE ROW LEVEL SECURITY;

-- Board Members Policies
CREATE POLICY "Board members can view all board members"
  ON board_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid() AND bm.is_active = TRUE
    )
  );

CREATE POLICY "Board members can update their own profile"
  ON board_members FOR UPDATE
  USING (user_id = auth.uid());

-- Board Meetings Policies
CREATE POLICY "Board members can view all meetings"
  ON board_meetings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid() AND bm.is_active = TRUE
    )
  );

CREATE POLICY "Chair and Secretary can create meetings"
  ON board_meetings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid()
      AND bm.is_active = TRUE
      AND bm.role IN ('chair', 'vice_chair', 'secretary')
    )
  );

CREATE POLICY "Chair and Secretary can update meetings"
  ON board_meetings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid()
      AND bm.is_active = TRUE
      AND bm.role IN ('chair', 'vice_chair', 'secretary')
    )
  );

-- Board Decisions Policies
CREATE POLICY "Board members can view all decisions"
  ON board_decisions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid() AND bm.is_active = TRUE
    )
  );

CREATE POLICY "Board members can propose decisions"
  ON board_decisions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid() AND bm.is_active = TRUE
    )
  );

CREATE POLICY "Board members can update decisions they proposed"
  ON board_decisions FOR UPDATE
  USING (
    proposed_by IN (
      SELECT id FROM board_members WHERE user_id = auth.uid()
    )
  );

-- Board Votes Policies
CREATE POLICY "Board members can view all votes"
  ON board_votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid() AND bm.is_active = TRUE
    )
  );

CREATE POLICY "Board members can insert their own votes"
  ON board_votes FOR INSERT
  WITH CHECK (
    board_member_id IN (
      SELECT id FROM board_members WHERE user_id = auth.uid() AND is_active = TRUE
    )
  );

-- Board Actions Policies
CREATE POLICY "Board members can view all actions"
  ON board_actions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid() AND bm.is_active = TRUE
    )
  );

CREATE POLICY "Board members can create actions"
  ON board_actions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid() AND bm.is_active = TRUE
    )
  );

CREATE POLICY "Board members can update actions assigned to them"
  ON board_actions FOR UPDATE
  USING (
    assigned_to IN (
      SELECT id FROM board_members WHERE user_id = auth.uid()
    )
  );

-- Board Documents Policies
CREATE POLICY "Board members can view all documents"
  ON board_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid() AND bm.is_active = TRUE
    )
  );

CREATE POLICY "Board members can upload documents"
  ON board_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid() AND bm.is_active = TRUE
    )
  );

-- =====================================================
-- AUTOMATIC TIMESTAMP UPDATES
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_board_members_updated_at BEFORE UPDATE ON board_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_meetings_updated_at BEFORE UPDATE ON board_meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_decisions_updated_at BEFORE UPDATE ON board_decisions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_actions_updated_at BEFORE UPDATE ON board_actions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_documents_updated_at BEFORE UPDATE ON board_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RESOLUTION NUMBER GENERATION FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION generate_resolution_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  seq TEXT;
BEGIN
  year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;

  SELECT LPAD((COUNT(*) + 1)::TEXT, 3, '0') INTO seq
  FROM board_decisions
  WHERE resolution_number LIKE year || '-%';

  RETURN year || '-' || seq;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TEST DATA (Optional - Comment out for production)
-- =====================================================

-- Sample board members
INSERT INTO board_members (full_name, role, email, skills, appointed_date, trustee_declaration_signed, induction_completed) VALUES
('Marcus Johnson', 'chair', 'marcus@blkoutuk.com', ARRAY['Leadership', 'Community Organizing', 'Strategic Planning'], '2024-01-15', TRUE, TRUE),
('Kwame Asante', 'treasurer', 'kwame@blkoutuk.com', ARRAY['Finance', 'Accounting', 'Budgeting'], '2024-01-15', TRUE, TRUE),
('Jordan Williams', 'secretary', 'jordan@blkoutuk.com', ARRAY['Administration', 'Documentation', 'Communications'], '2024-02-01', TRUE, TRUE),
('Devon Brown', 'trustee', 'devon@blkoutuk.com', ARRAY['Technology', 'Digital Strategy', 'Innovation'], '2024-03-10', TRUE, TRUE),
('Malik Roberts', 'trustee', 'malik@blkoutuk.com', ARRAY['Legal', 'Governance', 'Policy'], '2024-03-10', TRUE, TRUE);

COMMENT ON TABLE board_members IS 'BLKOUT board members and trustees directory';
COMMENT ON TABLE board_meetings IS 'Board meeting scheduling, agendas, and minutes';
COMMENT ON TABLE board_decisions IS 'Board proposals, resolutions, and decisions';
COMMENT ON TABLE board_votes IS 'Secure voting records for board decisions';
COMMENT ON TABLE board_actions IS 'Action items and tasks from board meetings';
COMMENT ON TABLE board_documents IS 'Board document repository with version control';
