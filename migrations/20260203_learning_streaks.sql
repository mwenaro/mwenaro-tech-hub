-- Migration: Learning Streaks & Gamification
-- Description: Add learning_streaks table to track daily learning activity and celebrate milestones
-- Created: 2026-02-03

-- Create learning_streaks table
CREATE TABLE IF NOT EXISTS learning_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_learning_streaks_user_id ON learning_streaks(user_id);

-- Enable Row Level Security
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own streak data
CREATE POLICY "Users can view own streak"
  ON learning_streaks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own streak data
CREATE POLICY "Users can insert own streak"
  ON learning_streaks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own streak data
CREATE POLICY "Users can update own streak"
  ON learning_streaks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all streaks
CREATE POLICY "Admins can view all streaks"
  ON learning_streaks
  FOR SELECT
  USING (
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'role')) = 'admin'
  );

-- Function to update streak automatically
CREATE OR REPLACE FUNCTION update_learning_streak(p_user_id UUID)
RETURNS TABLE(
  current_streak INTEGER,
  longest_streak INTEGER,
  is_milestone BOOLEAN,
  milestone_value INTEGER
) AS $$
DECLARE
  v_streak RECORD;
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
  v_new_streak INTEGER;
  v_new_longest INTEGER;
  v_is_milestone BOOLEAN := FALSE;
  v_milestone_value INTEGER := 0;
BEGIN
  -- Get existing streak or create new one
  SELECT * INTO v_streak
  FROM learning_streaks
  WHERE user_id = p_user_id;

  IF v_streak IS NULL THEN
    -- First time tracking - create new record
    INSERT INTO learning_streaks (user_id, current_streak, longest_streak, last_activity_date)
    VALUES (p_user_id, 1, 1, v_today)
    RETURNING learning_streaks.current_streak, learning_streaks.longest_streak
    INTO v_new_streak, v_new_longest;
    
    v_is_milestone := FALSE;
  ELSIF v_streak.last_activity_date = v_today THEN
    -- Already updated today, return current values
    v_new_streak := v_streak.current_streak;
    v_new_longest := v_streak.longest_streak;
  ELSIF v_streak.last_activity_date = v_yesterday THEN
    -- Consecutive day - increment streak
    v_new_streak := v_streak.current_streak + 1;
    v_new_longest := GREATEST(v_new_streak, v_streak.longest_streak);
    
    -- Check if this is a milestone (7, 30, 100 days)
    IF v_new_streak IN (7, 30, 100) THEN
      v_is_milestone := TRUE;
      v_milestone_value := v_new_streak;
    END IF;
    
    UPDATE learning_streaks
    SET current_streak = v_new_streak,
        longest_streak = v_new_longest,
        last_activity_date = v_today,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSE
    -- Streak broken - reset to 1
    v_new_streak := 1;
    v_new_longest := v_streak.longest_streak;
    
    UPDATE learning_streaks
    SET current_streak = v_new_streak,
        last_activity_date = v_today,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  RETURN QUERY SELECT v_new_streak, v_new_longest, v_is_milestone, v_milestone_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_learning_streak(UUID) TO authenticated;

-- Add comment
COMMENT ON TABLE learning_streaks IS 'Tracks daily learning activity and streaks for gamification';
COMMENT ON FUNCTION update_learning_streak IS 'Updates user learning streak and returns milestone information';
