-- Create courses table
create table if not exists courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert dummy data
insert into courses (title, description, price, image_url) values
('Intro to React', 'Learn the basics of React from scratch.', 49.99, 'https://placehold.co/600x400/png'),
('Advanced Next.js', 'Master Server Components, Server Actions, and more.', 79.99, 'https://placehold.co/600x400/png'),
('Fullstack Supabase', 'Build production-grade apps with Supabase.', 59.99, 'https://placehold.co/600x400/png');

-- Create enrollments table
create table if not exists enrollments (
  user_id uuid references auth.users not null,
  course_id uuid references courses(id) not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, course_id)
);

-- Create lessons table
create table if not exists lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses(id) not null,
  title text not null,
  content text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed lessons for 'Intro to React'
DO $$
DECLARE
    react_course_id uuid;
BEGIN
    SELECT id INTO react_course_id FROM courses WHERE title = 'Intro to React' LIMIT 1;

    IF react_course_id IS NOT NULL THEN
        INSERT INTO lessons (course_id, title, content, order_index) VALUES
        (react_course_id, 'Introduction to Components', 'Components are the building blocks of React applications...', 1),
        (react_course_id, 'State and Props', 'State allows components to change over time, while props allow data to be passed...', 2),
        (react_course_id, 'useEffect Hook', 'The useEffect hook lets you perform side effects in functional components...', 3)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

