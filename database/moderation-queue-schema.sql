-- BLKOUT Liberation Platform - Moderation Queue Database Schema
-- Chrome Extension Content Moderation System

-- Create moderation_queue table
CREATE TABLE IF NOT EXISTS moderation_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'event', 'news', 'story', etc.
    content_data JSONB NOT NULL, -- The extracted/edited content
    moderator_id VARCHAR(100) NOT NULL, -- Extension-generated moderator ID
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    url TEXT NOT NULL, -- Source URL
    title TEXT,
    description TEXT,
    category VARCHAR(50),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_id VARCHAR(100),
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_submitted_at ON moderation_queue(submitted_at);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_moderator_id ON moderation_queue(moderator_id);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_type ON moderation_queue(type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_moderation_queue_updated_at
    BEFORE UPDATE ON moderation_queue
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO moderation_queue (type, content_data, moderator_id, url, title, description)
VALUES
    ('event', '{"title": "Sample Event", "location": "Community Center"}', 'mod_test', 'https://example.com/event', 'Sample Event', 'Test event for moderation'),
    ('news', '{"title": "Sample News", "summary": "Important community news"}', 'mod_test', 'https://example.com/news', 'Sample News', 'Test news for moderation')
ON CONFLICT DO NOTHING;