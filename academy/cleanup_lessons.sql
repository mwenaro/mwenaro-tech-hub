DO $$
DECLARE
    r RECORD;
    keep_id uuid;
BEGIN
    -- 1. Deduplicate Enrollments first
    -- If a user has multiple enrollments for the same course, keep the oldest one
    DELETE FROM enrollments a USING enrollments b
    WHERE a.user_id = b.user_id AND a.course_id = b.course_id AND a.enrolled_at > b.enrolled_at;

    -- 2. Deduplicate Lessons
    -- Loop through each course and title to find duplicates
    FOR r IN
        SELECT course_id, title
        FROM lessons
        GROUP BY course_id, title
        HAVING COUNT(*) > 1
    LOOP
        -- Find the ID to keep (prioritize one with details like has_project=true or existing questions)
        SELECT l.id INTO keep_id
        FROM lessons l
        LEFT JOIN questions q ON l.id = q.lesson_id
        WHERE l.title = r.title AND l.course_id = r.course_id
        GROUP BY l.id, l.created_at, l.has_project
        ORDER BY 
            COUNT(q.id) DESC, -- Prefer one with questions
            l.has_project DESC, -- Prefer one with project flag
            l.created_at ASC 
        LIMIT 1;

        RAISE NOTICE 'Processing Lesson: %, Keeping ID: %', r.title, keep_id;

        -- Move questions from duplicates to the kept lesson
        UPDATE questions
        SET lesson_id = keep_id
        WHERE lesson_id IN (SELECT id FROM lessons WHERE title = r.title AND course_id = r.course_id AND id != keep_id);

        -- Move progress records
        -- Note: This is tricky because of the composite primary key (user_id, lesson_id).
        -- We'll just delete progress on duplicates for now to be safe and simple, relying on the user to re-do if needed, 
        -- OR we could try to merge. Let's delete for safety to avoid PK conflicts.
        DELETE FROM lesson_progress
        WHERE lesson_id IN (SELECT id FROM lessons WHERE title = r.title AND course_id = r.course_id AND id != keep_id);

        -- Delete the duplicate lessons
        DELETE FROM lessons
        WHERE title = r.title AND course_id = r.course_id AND id != keep_id;
    END LOOP;
END $$;
