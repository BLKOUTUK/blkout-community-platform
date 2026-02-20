-- Add voice recording support to Board EOI submissions
-- Date: February 19, 2026

-- =====================================================
-- ADD VOICE RECORDING COLUMN
-- =====================================================
ALTER TABLE board_eoi_submissions
  ADD COLUMN IF NOT EXISTS voice_recording_url TEXT;

COMMENT ON COLUMN board_eoi_submissions.voice_recording_url IS 'URL to voice recording in Supabase Storage (board-eoi-voice bucket)';

-- =====================================================
-- CREATE STORAGE BUCKET FOR VOICE RECORDINGS
-- =====================================================
-- Run these in Supabase Dashboard > Storage if not auto-applied:
--
-- 1. Create bucket: board-eoi-voice (public)
-- 2. Add policy: Allow public uploads (INSERT) with no auth required
-- 3. Add policy: Allow public reads (SELECT) for board members only
--
-- SQL equivalent (run in SQL Editor):

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'board-eoi-voice',
  'board-eoi-voice',
  true,
  5242880, -- 5MB max
  ARRAY['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload voice recordings (matches EOI public insert policy)
CREATE POLICY "Anyone can upload voice recordings"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'board-eoi-voice');

-- Allow public read access to voice recordings
CREATE POLICY "Voice recordings are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'board-eoi-voice');
