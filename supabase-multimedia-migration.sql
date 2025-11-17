-- Migration to add multimedia support to topics table
-- Run this in your Supabase SQL Editor

-- Add YouTube links column (array of text)
ALTER TABLE topics 
ADD COLUMN IF NOT EXISTS youtube_links TEXT[] DEFAULT '{}';

-- Add attachments column (JSONB for storing file metadata)
ALTER TABLE topics 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Comment on columns
COMMENT ON COLUMN topics.youtube_links IS 'Array of YouTube video links for reference';
COMMENT ON COLUMN topics.attachments IS 'JSON array storing file metadata: [{name, url, type, size}]';

-- Example attachments structure:
-- [
--   {"name": "notes.pdf", "url": "https://...", "type": "application/pdf", "size": 1024000},
--   {"name": "diagram.png", "url": "https://...", "type": "image/png", "size": 512000}
-- ]
