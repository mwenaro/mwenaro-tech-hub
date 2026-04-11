# Labs App Implementation Plan

## Overview
Build a project management platform where clients submit app ideas, and admins manage the full project lifecycle from proposal to completion.

---

## Tech Stack
- **Frontend**: Next.js 16 (existing labs app)
- **Database**: MongoDB via Mongoose (separate from Supabase)
- **Auth**: Custom JWT-based (separate from Academy)
- **Payments**: Stripe + M-Pesa (reuse from Academy)
- **Email**: Nodemailer (same provider as Academy)
- **Styling**: Tailwind CSS 4 + @mwenaro/ui components

---

## Architecture Decisions

| Aspect | Decision |
|--------|----------|
| **Auth** | Separate auth system (JWT-based, custom user tables in MongoDB) |
| **Database** | Separate MongoDB via Mongoose (not Supabase) |
| **Frontend** | Next.js 16 (existing labs app) |
| **Styling** | Tailwind CSS 4 + existing @mwenaro/ui components |

---

## Phase 1: Foundation (Week 1)

### 1.1 MongoDB Setup
- Add Mongoose to labs package.json
- Create connection utility in `src/lib/mongodb.ts`
- Add `MONGODB_URI` to `.env.local`

### 1.2 Schema Models
```
src/lib/models/
├── User.ts          - Admin, Client, Team members
├── Project.ts       - Projects with full lifecycle
├── Milestone.ts     - Project milestones
├── Payment.ts       - Payment records
├── Notification.ts  - In-app notifications
├── Comment.ts       - Project comments/reactions
└── Template.ts      - Project templates
```

---

## Phase 2: Authentication (Week 1-2)

### API Routes
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Client self-register |
| POST | `/api/auth/login` | Login (issues JWT) |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/invite` | Admin invite client |
| POST | `/api/auth/accept-invite` | Accept invite + register |

### Implementation
- JWT with HTTP-only cookies
- Role-based access (admin, client, team)
- Team roles: lead, developer, designer, pm, qa

---

## Phase 3: Client Features (Week 2-3)

### Pages
| Route | Description |
|-------|-------------|
| `/login` | Login page |
| `/register` | Registration + invite code support |
| `/dashboard` | Project list, stats, notifications |
| `/projects/new` | 5-step proposal wizard |
| `/projects/[id]` | Project details, timeline, payments |
| `/projects/[id]/features` | Feature list with priorities |
| `/payments` | Payment history |

### Proposal Wizard Steps
1. **Project Info**: Name, type, description
2. **Goals**: Problem solved, target users
3. **Features**: Add/edit features with priority (must-have, nice-to-have, can wait)
4. **Preferences**: Timeline, budget, tech preferences, optional uploads
5. **Review & Submit**

---

## Phase 4: Admin Features (Week 3-4)

### Pages
| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Stats: total projects, revenue, active clients |
| `/admin/clients` | Client list, invite, activate/deactivate |
| `/admin/proposals` | Queue of submitted proposals |
| `/admin/proposals/[id]` | Review proposal, accept/reject |
| `/admin/projects` | All projects with filters |
| `/admin/projects/[id]/edit` | Full project management |
| `/admin/projects/[id]/team` | Assign team members |
| `/admin/projects/[id]/milestones` | Manage milestones |
| `/admin/templates` | Project template management |
| `/admin/team` | Team member management |

### Admin Capabilities
- Invite clients via email with custom link
- Accept/reject proposals with notes
- Create project from accepted proposal
- Set pricing (milestone/upfront/retainer)
- Configure milestones, timeline, tech stack
- Assign team (lead + members)
- Post client-visible updates (not raw team notes)
- Generate invoices

---

## Phase 5: Payments (Week 4-5)

### Integration
- **Stripe**: Checkout sessions, webhooks
- **M-Pesa**: STK Push (reuse from Academy)
- **Direct Munually pay**: Updated manualy and type and proove recorded

### Features
- Milestone-based payments
- Upfront full payment
- Monthly retainer tracking
- Payment reminders
- Invoice/receipt generation

---

## Phase 6: Notifications (Week 5)

### Types
- In-app notifications (real-time)
- Email notifications:
  - Welcome (on registration/invite)
  - Proposal status changes
  - Milestone updates
  - Payment due/reminders

---

## Phase 7: Templates & Polish (Week 5-6)

### Project Templates
| Template | Milestones | Payment |
|----------|-------------|---------|
| E-commerce | Discovery → Design → Frontend → Backend → Testing → Launch | 6 installments |
| SaaS App | Discovery → Design → MVP → Beta → Launch | 5 installments |
| Mobile App | UI/UX → MVP → Beta → Launch | 4 installments |
| Landing Page | Design → Development → Launch | 3 installments |
| Web App | Discovery → Design → Dev → Testing → Deploy | 5 installments |
| API/Backend | Design → Development → Documentation → Deploy | 4 installments |

### UI Polish
- Loading states, skeleton loaders
- Error boundaries
- Empty states
- Mobile responsiveness

---

## Database Schema

### User
```
User
├── _id
├── email
├── passwordHash
├── name
├── role: "admin" | "client" | "team"
├── roleType: "lead" | "dev" | "designer" | "pm" | "qa" (for team)
├── isActive
├── invitedBy (if invited)
├── company (optional)
├── phone (optional)
├── avatar (optional)
├── createdAt
└── updatedAt
```

### Project
```
Project
├── _id
├── clientId (ref: User)
├── title
├── description
├── type: "web" | "mobile" | "both" | "api"
├── status: "draft" | "submitted" | "under_review" | "accepted" | "rejected" | "active" | "completed" | "cancelled"
├── proposalDetails
│   ├── problem
│   ├── targetUsers
│   ├── features[]
│   ├── budget
│   └── timeline
├── featurePriorities[]
│   ├── featureId
│   └── priority: "must_have" | "nice_to_have" | "can_wait"
├── pricing
│   ├── model: "milestone" | "upfront" | "retainer"
│   ├── totalAmount
│   └── installments[]
├── assignedTeam
│   ├── lead
│   └── members[]
├── milestones[]
│   ├── title
│   ├── description
│   ├── amount
│   ├── dueDate
│   ├── status
│   └── deliverables[]
├── timeline
│   ├── startDate
│   ├── endDate
│   └── estimatedCompletion
├── technology
│   ├── frameworks[]
│   ├── languages[]
│   └── resources
├── clientVisibleUpdates[] (admin-approved)
│   ├── title
│   ├── description
│   └── createdAt
├── attachments[] (optional files)
│   ├── name
│   ├── url
│   └── type
├── templateType (e.g., "ecommerce", "saas", "mobile")
├── activities[]
│   ├── type (comment, status_change, milestone_update, payment)
│   ├── userId
│   ├── content
│   └── createdAt
├── createdAt
└── updatedAt
```

### Payment
```
Payment
├── _id
├── projectId
├── milestoneId (optional)
├── amount
├── status: "pending" | "paid" | "failed" | "refunded"
├── method: "stripe" | "mpesa" | "bank_transfer"
├── stripePaymentId
├── dueDate
├── paidAt
└── createdAt
```

### Notification
```
Notification
├── _id
├── userId
├── type
├── title
├── message
├── link (optional)
├── read: boolean
├── createdAt
└── readAt
```

### Comment
```
Comment
├── _id
├── projectId
├── userId
├── content
├── reactions[]
│   ├── userId
│   └── emoji
├── parentId (optional, for replies)
├── isPrivate (admin-only)
├── createdAt
└── updatedAt
```

### Template
```
Template
├── _id
├── name
├── type (e.g., "ecommerce", "saas", "mobile")
├── description
├── milestones[]
│   ├── name
│   ├── description
│   ├── defaultPercentage
│   └── order
├── estimatedDuration (weeks)
├── isDefault: boolean
├── isActive: boolean
└── createdAt
```

---

## File Structure

```
labs/src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (client)/
│   │   ├── dashboard/page.tsx
│   │   ├── projects/
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── payments/page.tsx
│   │   └── layout.tsx
│   ├── admin/
│   │   ├── dashboard/page.tsx
│   │   ├── clients/page.tsx
│   │   ├── proposals/page.tsx
│   │   ├── projects/page.tsx
│   │   └── layout.tsx
│   └── api/
│       ├── auth/[...]/route.ts
│       ├── projects/route.ts
│       ├── payments/route.ts
│       └── notifications/route.ts
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── projects/
│   ├── admin/
│   └── ui/
└── lib/
    ├── models/
    ├── auth.ts
    ├── db.ts
    ├── email.ts
    └── payments/
```

---

## Clarifying Answers (from user)

1. **Client Types**: All of the above (startups, small businesses, individuals)
2. **Authentication**: Separate auth (JWT-based)
3. **Payment Models**: All options (milestone, upfront, retainer)
4. **Project Workflow**: Full workflow (Proposal → Review → Accept/Reject → Active → Completed)
5. **Team Assignment**: Manual assignment by admin
6. **Notifications**: Both in-app and email
7. **Database**: Separate MongoDB via Mongoose
8. **Client Registration**: Both self-register and admin invite via email
9. **Feature Prioritization**: Yes, clients can prioritize features
10. **File Uploads**: Optional where possible
11. **Team Accounts**: Yes, with role-based permissions
12. **Client View**: Only admin-approved updates visible
13. **Project Templates**: All types (e-commerce, SaaS, mobile, landing page, web app, API/backend)