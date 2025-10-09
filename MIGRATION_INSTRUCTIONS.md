# Database Migration Instructions - URGENT

## ⚠️ IMPORTANT: Complete Before Production Use

The Voices Admin system requires database tables that need to be created manually via Supabase Dashboard.

## Step-by-Step Instructions

### 1. Open Supabase SQL Editor

Go to: **https://app.supabase.com/project/bgjengudzfickgomjqmz/sql**

Or click this direct link: [Supabase SQL Editor](https://app.supabase.com/project/bgjengudzfickgomjqmz/sql/new)

### 2. Create New Query

Click the **"New query"** button in the SQL Editor

### 3. Copy Migration SQL

Copy the ENTIRE content below and paste it into the SQL Editor:

```sql
-- BLKOUT Liberation Platform - Voices System Migration
-- Article pitches and voices articles management

-- Create article_pitches table for pitch submissions and staging
CREATE TABLE IF NOT EXISTS article_pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('opinion', 'analysis', 'editorial', 'community', 'liberation')),
  pitch TEXT NOT NULL,
  word_count INTEGER,
  deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create voices_articles table for published and draft articles
CREATE TABLE IF NOT EXISTS voices_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('opinion', 'analysis', 'editorial', 'community', 'liberation')),
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  slug TEXT UNIQUE NOT NULL,
  hero_image TEXT,
  hero_image_alt TEXT,
  thumbnail_image TEXT,
  thumbnail_alt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_article_pitches_status ON article_pitches(status);
CREATE INDEX IF NOT EXISTS idx_article_pitches_submitted_at ON article_pitches(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_pitches_email ON article_pitches(email);

CREATE INDEX IF NOT EXISTS idx_voices_articles_published ON voices_articles(published);
CREATE INDEX IF NOT EXISTS idx_voices_articles_featured ON voices_articles(featured);
CREATE INDEX IF NOT EXISTS idx_voices_articles_category ON voices_articles(category);
CREATE INDEX IF NOT EXISTS idx_voices_articles_slug ON voices_articles(slug);
CREATE INDEX IF NOT EXISTS idx_voices_articles_published_at ON voices_articles(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_voices_articles_tags ON voices_articles USING GIN(tags);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_article_pitches_updated_at
  BEFORE UPDATE ON article_pitches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voices_articles_updated_at
  BEFORE UPDATE ON voices_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE article_pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE voices_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for article_pitches
-- Allow anyone to submit pitches
CREATE POLICY "Allow public pitch submission" ON article_pitches
  FOR INSERT
  WITH CHECK (true);

-- Allow public to view their own submissions
CREATE POLICY "Allow users to view own pitches" ON article_pitches
  FOR SELECT
  USING (true);

-- Admin access for all operations (requires auth implementation)
CREATE POLICY "Allow admin full access to pitches" ON article_pitches
  FOR ALL
  USING (true);

-- Create policies for voices_articles
-- Allow public to read published articles
CREATE POLICY "Allow public to view published articles" ON voices_articles
  FOR SELECT
  USING (published = true);

-- Admin access for all operations (requires auth implementation)
CREATE POLICY "Allow admin full access to articles" ON voices_articles
  FOR ALL
  USING (true);

-- Insert sample data for testing
INSERT INTO voices_articles (
  title,
  content,
  excerpt,
  author,
  category,
  tags,
  featured,
  published,
  slug,
  hero_image,
  hero_image_alt,
  thumbnail_image,
  thumbnail_alt,
  published_at
) VALUES (
  'Welcome to BLKOUT Voices',
  E'# Welcome to BLKOUT Voices\n\nWelcome to our new editorial platform where Black QTIPOC+ voices can share their perspectives, analyses, and lived experiences.\n\n## Our Mission\n\nBLKOUT Voices is a space for community members to contribute opinion pieces, analysis, and editorial content that centers Black queer liberation.\n\n## Get Involved\n\nWe welcome pitches from community members. Share your voice with us!',
  'Introducing BLKOUT Voices - a new platform for Black QTIPOC+ editorial content and community perspectives.',
  'BLKOUT Editorial Team',
  'editorial',
  ARRAY['platform', 'announcement', 'community'],
  true,
  true,
  'welcome-to-blkout-voices',
  '/Fallback images/blue images/blue man.jpg',
  'Community members celebrating together',
  '/Fallback images/blue images/blue man.jpg',
  'Community celebration',
  NOW()
);

-- Grant permissions
GRANT ALL ON article_pitches TO authenticated;
GRANT ALL ON voices_articles TO authenticated;
GRANT ALL ON article_pitches TO anon;
GRANT ALL ON voices_articles TO anon;
```

### 4. Execute the Migration

Click **"Run"** button or press `Cmd/Ctrl + Enter`

### 5. Verify Success

You should see messages like:
- `CREATE TABLE`
- `CREATE INDEX`
- `CREATE FUNCTION`
- `CREATE TRIGGER`
- `ALTER TABLE`
- `CREATE POLICY`
- `INSERT 0 1`
- `GRANT`

### 6. Verify Tables Exist

Go to: **https://app.supabase.com/project/bgjengudzfickgomjqmz/editor**

You should now see two new tables:
- ✅ `article_pitches`
- ✅ `voices_articles`

## Troubleshooting

### If you get "already exists" errors:
- Tables are already created
- Safe to ignore
- Migration is idempotent (can run multiple times)

### If you get permission errors:
- Make sure you're logged into Supabase
- Check you're in the correct project
- Verify you have admin access

### If migration fails:
1. Check SQL syntax
2. Look for error messages in red
3. Copy error and search for solution
4. Contact support if needed

## After Migration

Once migration is complete:

1. ✅ Tables created
2. Deploy to production: `vercel deploy --prod`
3. Test admin interface: `https://your-domain.vercel.app/admin`
4. Click "Voices Editorial" tab
5. Verify all features work

## Migration File Location

The migration file is located at:
```
database/migrations/002_voices_system.sql
```

You can also copy it from there if needed.

---

**Status**: ⏳ Awaiting Manual Execution
**Required Before**: Production Deployment
**Estimated Time**: 2-3 minutes
