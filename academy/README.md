# Mwenaro Tech Academy

Mwenaro Tech Academy is a premium, AI-powered ed-tech platform designed to empower the next generation of tech leaders. Built with a modern tech stack and a focus on interactive learning, it provides a seamless experience for students, instructors, and administrators.

## 🚀 Key Features

### 🧠 AI-Powered Project Marking
Students receive immediate, constructive feedback on their project submissions. The platform leverages **OpenAI GPT-4o** to analyze code repositories and provide suggested ratings and detailed improvement tips before final instructor review.

### 💬 Real-Time Communication
A robust, Supabase-powered chat system connects everyone on the platform. 
- **Learners**: Can initiate support or educational chats via a global floating widget.
- **Staff**: Dedicated messaging dashboards for instructors and admins to manage high-volume communications.

### 🔔 Dynamic Notification Engine
Never miss an update. The platform features a real-time notification system:
- **In-App Alerts**: A persistent notification bell in the navbar for messages, session updates, and project reviews.
- **Email Notifications**: Automated email alerts for critical events (simulated via configured service).

### 📊 Professional Dashboards
Tailored experiences for every user role:
- **Learner Dashboard**: Track course progress with visual indicators and sequential lesson unlocking.
- **Instructor Dashboard**: Manage cohorts, schedule live sessions, and review project submissions with AI-assisted insights.
- **Admin Dashboard**: Comprehensive control over users, courses, and platform-wide analytics.

## 🛠 Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, `proxy.ts` middleware)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **Backend & Real-time**: [Supabase](https://supabase.com/) (PostgreSQL, Realtime, Auth, SSR)
- **AI Integration**: [OpenAI API](https://openai.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

This application is part of the [Mwenaro Tech Monorepo](../README.md).

### Prerequisites
- Node.js 20+
- A Supabase Project
- OpenAI API Key (Optional for mock mode)

### Installation & Development

1. **Install dependencies** (from the monorepo root):
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev:academy
   ```

Open [http://localhost:3001](http://localhost:3001) to see the platform in action.

## 📦 Deployment

The platform is optimized for [Vercel](https://vercel.com/) and utilizes Next.js Server Actions and Middleware for high performance.

---

© 2026 Mwenaro Tech Academy. All rights reserved.
