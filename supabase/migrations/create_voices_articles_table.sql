-- Create voices_articles table for BLKOUT Voices editorial platform
CREATE TABLE IF NOT EXISTS voices_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('opinion', 'analysis', 'editorial', 'community', 'liberation')),
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  slug TEXT NOT NULL UNIQUE,
  hero_image TEXT,
  hero_image_alt TEXT,
  thumbnail_image TEXT,
  thumbnail_alt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_voices_articles_published ON voices_articles(published);
CREATE INDEX IF NOT EXISTS idx_voices_articles_featured ON voices_articles(featured);
CREATE INDEX IF NOT EXISTS idx_voices_articles_category ON voices_articles(category);
CREATE INDEX IF NOT EXISTS idx_voices_articles_slug ON voices_articles(slug);
CREATE INDEX IF NOT EXISTS idx_voices_articles_published_at ON voices_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_voices_articles_author ON voices_articles(author);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_voices_articles_search ON voices_articles USING GIN (
  to_tsvector('english', title || ' ' || excerpt || ' ' || content)
);

-- Enable Row Level Security
ALTER TABLE voices_articles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published articles
CREATE POLICY "Anyone can read published articles"
  ON voices_articles
  FOR SELECT
  USING (published = true);

-- Policy: Authenticated users can read all articles
CREATE POLICY "Authenticated users can read all articles"
  ON voices_articles
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert articles
CREATE POLICY "Authenticated users can insert articles"
  ON voices_articles
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update articles
CREATE POLICY "Authenticated users can update articles"
  ON voices_articles
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can delete articles
CREATE POLICY "Authenticated users can delete articles"
  ON voices_articles
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_voices_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_voices_articles_updated_at_trigger
  BEFORE UPDATE ON voices_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_voices_articles_updated_at();

-- Add comment to table
COMMENT ON TABLE voices_articles IS 'Stores editorial content for BLKOUT Voices platform - opinion pieces, analyses, and community perspectives';
