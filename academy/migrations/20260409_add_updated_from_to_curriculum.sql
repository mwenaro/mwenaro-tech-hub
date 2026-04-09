-- Migration: Add updated_from tracking to curriculum tables
-- Description: Adds a column to track whether the last update was from local files or the admin dashboard.

-- 1. Add column to courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS updated_from text DEFAULT 'files' CHECK (updated_from IN ('files', 'dashboard'));

-- 2. Add column to phases
ALTER TABLE phases 
ADD COLUMN IF NOT EXISTS updated_from text DEFAULT 'files' CHECK (updated_from IN ('files', 'dashboard'));

-- 3. Add column to lessons
ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS updated_from text DEFAULT 'files' CHECK (updated_from IN ('files', 'dashboard'));

-- Create indexing for faster lookups during sync
CREATE INDEX IF NOT EXISTS idx_courses_updated_from ON courses(updated_from);
CREATE INDEX IF NOT EXISTS idx_phases_updated_from ON phases(updated_from);
CREATE INDEX IF NOT EXISTS idx_lessons_updated_from ON lessons(updated_from);
