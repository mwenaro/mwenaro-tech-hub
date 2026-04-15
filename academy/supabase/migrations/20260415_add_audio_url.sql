-- Migration: Add audio_url to lessons
-- Created: 2026-04-15

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- For testing/demonstration, let's also add a duration field if it's missing (though it seems to exist in types)
-- Checking schema.sql, duration_minutes was NOT in the lessons table definition lines 51-58.
-- Let's add it to be safe as it's in the Lesson interface.

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0;
