# Course Restructure & Quiz Review Implementation Plan

## Overview
This plan outlines the architectural shifts required to transition from a flat `Course -> Lesson` structure to a nested `Course -> Phase -> Lesson` hierarchy. It also includes the designs for maximizing lesson reusability and introducing a detailed Quiz Review UI for students.

---

## Part 1: Course "Phases" Architecture

### Current State
Currently, a Course is directly linked to Lessons via the `course_lessons` join table (many-to-many).

### Proposed State
To support modular learning tracks (e.g., "Web Dev Fundamentals" -> "Frontend Phase" -> "Backend Phase"), we will introduce **Phases** (also known as modules or sections). 

**Hierarchy:** `Course` 1---* `Phases` 1---* `Lessons`

To simplify logic across the app, **all courses should use the Phase architecture**. For simple courses that don't need distinct phases, they will simply have a single default phase (e.g., "Course Content").

### 1. Database Schema Changes

#### A. Create `phases` Table
```sql
CREATE TABLE public.phases (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### B. Create `phase_lessons` Join Table
Since we want lessons to be highly reusable across multiple courses AND multiple phases, we will map lessons to phases via a new join table.
```sql
CREATE TABLE public.phase_lessons (
    phase_id uuid REFERENCES public.phases(id) ON DELETE CASCADE,
    lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (phase_id, lesson_id)
);
```

### 2. Migration Strategy
To ensure no existing data is lost during rollout:
1. **Create Tables**: Run the SQL to create `phases` and `phase_lessons`.
2. **Auto-migrate Data**:
   - For every existing Course, automatically create an initial Phase named "Main Content" or "Module 1".
   - Select all existing links from `course_lessons`, and insert them into `phase_lessons` attached to the newly created default Phase for that course.
3. **Deprecate**: Drop the old `course_lessons` table.

---

## Part 2: Lesson Reusability

Because of our many-to-many setup (`phase_lessons`), a single `lesson_id` can easily be attached to:
- "Frontend Phase" in the Fullstack Course
- "Web Dev Fundamentals" in a separate Beginner HTML/CSS Course

### Admin UI Updates Required:
1. **Course Builder UI**: The instructor dashboard must be updated to support a nested drag-and-drop interface (Phases containing Lessons).
2. **Lesson Selection**: When adding content to a Phase, the instructor should have two options:
   - **"Create New Lesson"**: Generates a new lesson from scratch.
   - **"Browse Library"**: Opens a search modal to find existing lessons and attach them to the current phase without duplicating the underlying Markdown content.

---

## Part 3: Enhanced Quiz Review Feature

Currently, the `quiz_submissions` table records the `answers` array, `score`, and `passed` boolean. The `questions` table already cleverly contains an `explanation` column and the `correct_answer` index.

### The Problem
When a student finishes a quiz, they just see their score. They cannot see which specific questions they failed.

### Implementation Plan

**1. API / Data Fetching**
Create a new endpoint or Server Action: `getQuizReview(lessonId, userId)`.
This function will:
- Fetch the student's latest entry from `quiz_submissions`.
- Fetch all `questions` associated with the `lesson_id`.
- Zip them together so the Frontend has the Question, the Correct Answer, and the User's Answer.

**2. Frontend UI (`<QuizReview />` component)**
After submission, transition the user from the active `<QuizForm />` state into a `<QuizReview />` state.
For each question:
- Display the question text.
- Render all options.
- **Visual Feedback**:
  - If the user selected the right option: Highlight it Green.
  - If the user selected the wrong option: Highlight their choice Red, and highlight the actual correct option Green.
- **Explanations**: Render the `explanation` text from the database directly below the question to explain *why* the answer is correct (vital for actual learning).

---

## Implementation Roadmap

- **Phase 1: Database Foundation**
  - Write and execute the SQL migration script (Create `phases`, `phase_lessons`, migrate data, drop `course_lessons`).
- **Phase 2: API & Data Layer Updates**
  - Refactor `src/lib/courses.ts` and `lessons.ts` to fetch the nested hierarchy (`Course -> Phases -> Lessons`).
- **Phase 3: Instructor UI (Course Builder)**
  - Build the nested drag-and-drop UI for managing Phases and injecting existing Lessons.
- **Phase 4: Student UI Updates**
  - Update the Course Overview page to render the syllabus grouped by Phases.
  - Implement the `<QuizReview />` component for post-quiz feedback.
