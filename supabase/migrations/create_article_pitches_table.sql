-- Create article_pitches table for storing community article pitch submissions
CREATE TABLE IF NOT EXISTS article_pitches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('opinion', 'analysis', 'editorial', 'community', 'liberation')),
  pitch TEXT NOT NULL,
  word_count TEXT,
  deadline DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected', 'published')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_article_pitches_status ON article_pitches(status);
CREATE INDEX IF NOT EXISTS idx_article_pitches_category ON article_pitches(category);
CREATE INDEX IF NOT EXISTS idx_article_pitches_submitted_at ON article_pitches(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_pitches_email ON article_pitches(email);

-- Enable Row Level Security
ALTER TABLE article_pitches ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit a pitch (INSERT)
CREATE POLICY "Anyone can submit article pitches"
  ON article_pitches
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users can view pitches (SELECT)
CREATE POLICY "Authenticated users can view article pitches"
  ON article_pitches
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update pitches (UPDATE)
CREATE POLICY "Authenticated users can update article pitches"
  ON article_pitches
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_article_pitches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_article_pitches_updated_at_trigger
  BEFORE UPDATE ON article_pitches
  FOR EACH ROW
  EXECUTE FUNCTION update_article_pitches_updated_at();

-- Add comment to table
COMMENT ON TABLE article_pitches IS 'Stores community article pitch submissions for BLKOUT Voices editorial platform';
