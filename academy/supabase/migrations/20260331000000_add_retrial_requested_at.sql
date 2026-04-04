-- Add retrial_requested_at column to lesson_progress table to track when a retrial was requested
-- This allows the system to automatically grant 2 extra attempts after a 30-minute delay

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lesson_progress' AND column_name = 'retrial_requested_at') THEN
        ALTER TABLE lesson_progress ADD COLUMN retrial_requested_at timestamp with time zone;
    END IF;
END $$;
