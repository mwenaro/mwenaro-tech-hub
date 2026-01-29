DO $$
DECLARE
    r RECORD;
    keep_id uuid;
BEGIN
    -- Loop through each unique course title that has duplicates
    FOR r IN
        SELECT title
        FROM courses
        GROUP BY title
        HAVING COUNT(*) > 1
    LOOP
        -- Find the ID to keep (prioritize one with lessons, then oldest)
        SELECT c.id INTO keep_id
        FROM courses c
        LEFT JOIN lessons l ON c.id = l.course_id
        WHERE c.title = r.title
        GROUP BY c.id, c.created_at
        ORDER BY COUNT(l.id) DESC, c.created_at ASC
        LIMIT 1;

        RAISE NOTICE 'Processing title: %, Keeping ID: %', r.title, keep_id;

        -- 1. Handle Enrollments
        -- First, if a user is enrolled in BOTH the duplicate and the kept course, 
        -- we must delete the duplicate enrollment to avoid a primary key conflict when we try to move it.
        DELETE FROM enrollments
        WHERE course_id IN (SELECT id FROM courses WHERE title = r.title AND id != keep_id)
          AND user_id IN (SELECT user_id FROM enrollments WHERE course_id = keep_id);

        -- Now safe to move remaining enrollments from duplicate courses to the kept course
        UPDATE enrollments
        SET course_id = keep_id
        WHERE course_id IN (SELECT id FROM courses WHERE title = r.title AND id != keep_id);

        -- 2. Handle Lessons
        -- Move lessons from duplicates to kept course (just in case)
        UPDATE lessons
        SET course_id = keep_id
        WHERE course_id IN (SELECT id FROM courses WHERE title = r.title AND id != keep_id);

        -- 3. Delete the duplicate courses
        DELETE FROM courses
        WHERE title = r.title AND id != keep_id;
    END LOOP;
END $$;

-- Add unique constraint to prevent future duplicates
ALTER TABLE courses ADD CONSTRAINT courses_title_key UNIQUE (title);
