# Mwenaro Tech Ecosystem: Remaining Features & Improvements Plan

Following a comprehensive deep dive into the Mwenaro Tech Academy monorepo and its Supabase database, this document outlines the remaining features, technical debt, and improvements needed to fully realize the platform's vision.

---

## 1. Student Learning Experience & Dashboard
While the core Next.js App Router patterns and Supabase data fetching are in place, the student experience requires several feature completions and polish:

- **Advanced Progress Tracking:** Wire up robust tracking for lesson completion directly to the `lesson_progress` table, ensuring the UI accurately reflects completed modules, quiz attempts, and scores.
- **Certificate Generation System:** Implement the planned automated certificate generation (PDF/Image) upon course completion, likely utilizing an AI or templating service.
- **AI Course Recommendations:** Build the personalized recommendation engine to suggest new courses based on a user's role, completed courses, and quiz scores.
- **Dashboard Polish:** Fully integrate the `StatsCards`, `EnrolledCourseCard`, and `DashboardSidebar` with dynamic data, completely replacing any remaining mocked fallback data and ensuring parity with the premium source design.
- **Video Player Integration:** Ensure the existing `video-player.tsx` is seamlessly integrated into the lesson flow, tracking watch progress and handling external video sources efficiently.

## 2. Instructor Empowerment Suite
Instructors have the foundation for course and student management, but financial and advanced management tools remain unimplemented:

- **Revenue Calculations & Display:** Develop the financial dashboard for instructors, utilizing the `instructor_payments` database schema to dynamically calculate and display course revenue and payout statuses.
- **Advanced Student Management:** Implement powerful search functionality and robust course filter dropdowns in the instructor's student management interface.
- **Session Management UI:** While students can view upcoming sessions, the instructor interface needs a polished, intuitive UI to schedule, edit, and launch live cohort sessions (Zoom/Meet links).

## 3. Platform Administration & Analytics
The Admin portal contains the necessary structural routes, but features mocked data that must be connected to the live database:

- **Live Analytics Dashboard:** Replace the static mockup data in `academy/src/app/admin/analytics/page.tsx` with live real-time metrics (Active Learners, Enrollment Growth, System Uptime, AI Grading Accuracy).
- **Gamification & Streaks Implementation:** Fully roll out the `learning_streaks` system, tying database triggers to student activity to display daily streaks and gamified rewards across the platform.

## 4. Code Quality & Technical Debt
To ensure long-term maintainability and performance, several codebase cleanups are required:

- **Type Safety & React Warnings:** Methodically remove `any` types (specifically targeting `src/lib/instructor.ts` and related data-fetching utilities), fix stray React console warnings, and remove unused variables (e.g., `RoleBadge`, `qError`).
- **Role Enforcement Consistency:** Ensure that the `role` enum (`student`, `instructor`, `admin`) in the `profiles` table is strictly and consistently enforced universally across Frontend navigation guards and Supabase Row Level Security (RLS) policies.

## 5. Third-Party Integrations
Critical external integrations pending implementation:

- **Payments (Stripe/PayPal):** Develop the fully secure checkout flow for paid courses and the reverse payout system for instructors.
- **Email Notification System:** Integrate SendGrid or Supabase Email to automatically dispatch welcome emails, live session reminders, AI project review notifications, and payment receipts.

## 6. Ecosystem Expansion (Talent & Labs)
- **Flesh out Talent & Labs Applications:** The structural workspaces for `talent` and `labs` exist. These need to be developed into high-converting, premium landing pages mirroring the aesthetic standard established by the newly redesigned `hub` homepage.
- **API Foundation for Future Apps:** Begin structuring API outputs to support the planned future expansions into Mobile Applications and localized AI Tutors.
