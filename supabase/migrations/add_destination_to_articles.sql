-- Add destination field to voices_articles table
-- This field determines which platform section to link to at the end of each article

ALTER TABLE voices_articles
ADD COLUMN destination TEXT CHECK (destination IN ('platform', 'events', 'governance', 'news', 'ivor', 'blkouthub', 'home'));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_voices_articles_destination ON voices_articles(destination);

-- Add comment
COMMENT ON COLUMN voices_articles.destination IS 'Specifies which BLKOUT platform section this article links to (platform, events, governance, news, ivor, blkouthub, home)';
