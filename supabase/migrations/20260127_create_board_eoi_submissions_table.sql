-- BLKOUT Board Expression of Interest Submissions
-- Table for tracking board member candidate applications
-- Date: January 27, 2026

-- =====================================================
-- BOARD EOI SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE board_eoi_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Applicant Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  blkouthub_username TEXT,
  blkouthub_status TEXT CHECK (blkouthub_status IN ('active', 'reactivating', 'new')) NOT NULL,

  -- Application Details
  positions_interested TEXT[] NOT NULL,
  statement_of_interest TEXT NOT NULL,
  relevant_experience TEXT,
  can_commit_hours BOOLEAN NOT NULL DEFAULT FALSE,
  how_heard_about TEXT,

  -- Processing Status
  status TEXT CHECK (status IN ('pending', 'under_review', 'shortlisted', 'interviewed', 'selected', 'declined', 'withdrawn')) DEFAULT 'pending',
  reviewer_notes TEXT,
  reviewed_by UUID REFERENCES board_members(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,

  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate submissions from same email
  UNIQUE(email)
);

-- Indexes for efficient querying
CREATE INDEX idx_board_eoi_status ON board_eoi_submissions(status);
CREATE INDEX idx_board_eoi_submitted ON board_eoi_submissions(submitted_at DESC);
CREATE INDEX idx_board_eoi_email ON board_eoi_submissions(email);
CREATE INDEX idx_board_eoi_positions ON board_eoi_submissions USING GIN(positions_interested);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE board_eoi_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit an EOI (public insert)
CREATE POLICY "Anyone can submit an EOI"
  ON board_eoi_submissions FOR INSERT
  WITH CHECK (TRUE);

-- Only board members can view EOI submissions
CREATE POLICY "Board members can view all EOI submissions"
  ON board_eoi_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid() AND bm.is_active = TRUE
    )
  );

-- Only chair and secretary can update EOI submissions (for reviewing)
CREATE POLICY "Chair and Secretary can update EOI submissions"
  ON board_eoi_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.user_id = auth.uid()
      AND bm.is_active = TRUE
      AND bm.role IN ('chair', 'vice_chair', 'secretary')
    )
  );

-- =====================================================
-- AUTOMATIC TIMESTAMP UPDATES
-- =====================================================

CREATE TRIGGER update_board_eoi_submissions_updated_at
  BEFORE UPDATE ON board_eoi_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE board_eoi_submissions IS 'Expression of Interest submissions for BLKOUT board positions';
COMMENT ON COLUMN board_eoi_submissions.positions_interested IS 'Array of position IDs: chair, treasurer, secretary, technology_director, community_director';
COMMENT ON COLUMN board_eoi_submissions.blkouthub_status IS 'Membership status: active, reactivating, or new';
COMMENT ON COLUMN board_eoi_submissions.can_commit_hours IS 'Applicant confirms ability to commit 4-6 hours/month';
