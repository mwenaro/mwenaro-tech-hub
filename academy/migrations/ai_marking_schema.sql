-- Add AI Marking columns to lesson_progress
ALTER TABLE lesson_progress 
ADD COLUMN IF NOT EXISTS ai_rating INTEGER,
ADD COLUMN IF NOT EXISTS ai_feedback TEXT,
ADD COLUMN IF NOT EXISTS ai_status TEXT DEFAULT 'pending';

-- Add check constraint for ai_status
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_ai_status') THEN
        ALTER TABLE lesson_progress ADD CONSTRAINT check_ai_status CHECK (ai_status IN ('pending', 'completed', 'failed'));
    END IF;
END $$;
