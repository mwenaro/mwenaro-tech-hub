-- Migration: Add audio_script to lessons
-- Created: 2026-04-15

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS audio_script TEXT;
