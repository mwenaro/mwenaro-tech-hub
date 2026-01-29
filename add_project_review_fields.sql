-- Add project review and rating fields to lesson_progress table

ALTER TABLE lesson_progress 
ADD COLUMN IF NOT EXISTS project_reviewed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS project_rating integer CHECK (project_rating >= 0 AND project_rating <= 100),
ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS project_feedback text;

-- Create index for faster lookups by reviewer
CREATE INDEX IF NOT EXISTS idx_lesson_progress_reviewed_by ON lesson_progress(reviewed_by);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'lesson_progress'
ORDER BY ordinal_position;
