-- 1. Add questions table
create table if not exists questions (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references lessons(id) not null,
  question_text text not null,
  options jsonb not null,
  correct_answer integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add lesson_progress table
create table if not exists lesson_progress (
  user_id uuid references auth.users not null,
  lesson_id uuid references lessons(id) not null,
  is_completed boolean default false,
  quiz_attempts integer default 0,
  highest_quiz_score integer default 0,
  project_repo_link text,
  completed_at timestamp with time zone,
  primary key (user_id, lesson_id)
);

-- 3. Add has_project column to lessons safe check
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'has_project') THEN
        ALTER TABLE lessons ADD COLUMN has_project boolean DEFAULT false;
    END IF;
END $$;

-- 4. Seed Quiz Data (Intro to React)
DO $$
DECLARE
    react_course_id uuid;
    lesson_components_id uuid;
    lesson_state_id uuid;
BEGIN
    SELECT id INTO react_course_id FROM courses WHERE title = 'Intro to React' LIMIT 1;
    
    IF react_course_id IS NOT NULL THEN
        -- Get lesson IDs
        SELECT id INTO lesson_components_id FROM lessons WHERE course_id = react_course_id AND title = 'Introduction to Components' LIMIT 1;
        SELECT id INTO lesson_state_id FROM lessons WHERE course_id = react_course_id AND title = 'State and Props' LIMIT 1;

        -- Update "State and Props" to require a project
        IF lesson_state_id IS NOT NULL THEN
            UPDATE lessons SET has_project = true WHERE id = lesson_state_id;
        END IF;

        -- Add questions for "Introduction to Components"
        IF lesson_components_id IS NOT NULL THEN
            INSERT INTO questions (lesson_id, question_text, options, correct_answer) VALUES
            (lesson_components_id, 'What is a React Component?', '["A function or class that returns UI", "A database table", "A server-side script"]'::jsonb, 0),
            (lesson_components_id, 'How do you pass data to a component?', '["State", "Props", "Hooks"]'::jsonb, 1)
            ON CONFLICT DO NOTHING; 
        END IF;
    END IF;
END $$;
