# TaskKu

TaskKu is a mobile-first task management web app built with Next.js App Router. It helps users organize assignments, deadlines, priorities, and daily progress with a fast app-like experience.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1?logo=zod&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## Overview

TaskKu focuses on a simple flow: sign in, add tasks, track deadlines, and finish work faster. The UI is optimized for mobile screens while still looking polished on desktop.

Core product goals:

- Keep task management quick and clear.
- Make deadlines visible through dashboard stats, notifications, and calendar view.
- Give instant feedback with optimistic UI.
- Stay usable with or without Supabase by falling back to browser storage.
- Keep production routes protected and recoverable.

---

## Features

### Authentication and Route Protection

- Register and login screens with server-side validation.
- Session stored in an HttpOnly cookie.
- `/dashboard` is protected by Next.js 16 `proxy.ts`.
- `/` redirects users based on session state.

### Task Management

- Create, edit, view detail, complete, and delete tasks.
- Priority levels: low, medium, high.
- Categories for task grouping.
- Due date tracking with overdue indicators.
- Confirmation dialog before destructive delete actions.

### Dashboard Experience

- Summary cards for total tasks, completed tasks, and overdue tasks.
- URL-based search using `useSearchParams`.
- Category and priority filters.
- Sort by date, priority, or title.
- Empty states for first-time users and filtered search results.

### Calendar and Notifications

- Calendar screen with task count per day.
- Day-based task listing.
- Notification panel for active deadline reminders.
- Badge indicators for urgent/today tasks.

### Performance and UX

- Optimistic UI for toggle and delete actions.
- Route skeleton loading via `src/app/dashboard/loading.tsx`.
- Toast feedback for success and error states.
- Local fallback storage separated per user.
- Responsive layout for 320px+ screens.
- Light/dark theme toggle.

### Reliability

- Zod validation for task forms.
- Custom 404 page for unknown routes.
- Custom error recovery screen for runtime failures.
- CI workflow for lint and production build checks.

---

## Tech Stack

| Technology | Version | Usage |
|------------|---------|-------|
| Next.js | 16.2.4 | App Router, Server Components, Server Actions, Proxy |
| React | 19.2.4 | Client UI and optimistic interactions |
| TypeScript | 5.x | Type safety |
| Supabase | 2.x | PostgreSQL backend |
| Zod | 4.x | Server-side validation |
| Tailwind CSS | 4.x | Global styling pipeline |
| Sonner | 2.x | Toast notifications |
| Lucide React | 1.x | Icons |
| date-fns | 4.x | Date utilities |

---

## Project Structure

```txt
src/
├── app/
│   ├── dashboard/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── login/
│   │   ├── LoginForm.tsx
│   │   └── page.tsx
│   ├── register/
│   │   ├── RegisterForm.tsx
│   │   └── page.tsx
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── AddTaskModal.tsx
│   ├── CalendarScreen.tsx
│   ├── ConfirmDialog.tsx
│   ├── EditTaskModal.tsx
│   ├── NotificationPanel.tsx
│   ├── ProfileScreen.tsx
│   ├── TaskCard.tsx
│   ├── TaskDetailModal.tsx
│   └── TaskKuApp.tsx
├── lib/
│   ├── actions/
│   │   ├── auth-actions.ts
│   │   └── task-actions.ts
│   ├── schemas.ts
│   ├── session.ts
│   ├── supabase.ts
│   ├── types.ts
│   ├── useTheme.ts
│   └── utils.ts
└── proxy.ts
```

---

## Getting Started

### Prerequisites

- Node.js 20 recommended
- npm
- Supabase project, optional but recommended

### Install

```bash
git clone https://github.com/muhanggaraaa/TaskKu.git
cd TaskKu
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If these variables are not set, the app still works with local browser storage.

### Database Setup

Run the SQL from [`supabase-migration.sql`](./supabase-migration.sql) in Supabase SQL Editor.

```sql
-- =============================================
-- TaskKu Production Schema
-- =============================================
-- Run this in Supabase Dashboard > SQL Editor.
-- Safe to run multiple times because it uses IF NOT EXISTS checks.

-- Users table for TaskKu custom cookie auth.
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tasks table. Dates are stored as YYYY-MM-DD text because the UI uses
-- native date input values directly.
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  duedate TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  user_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add columns for older databases that already had a tasks table.
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS done BOOLEAN DEFAULT false;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Indexes for login lookup and per-user task queries.
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tasks_user_email ON tasks(user_email);
CREATE INDEX IF NOT EXISTS idx_tasks_duedate ON tasks(duedate);

-- Important:
-- This app currently uses custom cookie auth through Next.js Server Actions,
-- not Supabase Auth JWT. Keep RLS disabled unless you also add policies that
-- match your auth strategy or move to Supabase Auth/service-role server access.
```

### Development

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production Build

```bash
npm run build
npm start
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server |
| `npm run lint` | Run ESLint checks |
| `npm run build` | Build production app |
| `npm start` | Start production server |

---

## Deployment

Recommended deployment target: Vercel.

Production checklist:

- Push only source/config files required for production.
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel.
- Run Supabase schema setup before first production use.
- Confirm `npm run lint` and `npm run build` pass.
- Confirm protected route behavior: `/dashboard` redirects to `/login` without session.

The repository includes a GitHub Actions workflow at `.github/workflows/release.yml` for automated lint and build checks.

---

## Quality Checks

Latest local verification:

```bash
npm run lint
npm run build
```

Runtime smoke test:

| Route | Expected Result |
|-------|-----------------|
| `/login` | Public page loads |
| `/register` | Public page loads |
| `/dashboard` without session | Redirects to `/login` |
| `/` without session | Redirects to `/login` |
| Unknown route | Shows custom 404 |

---

## Team

| Name | GitHub |
|------|--------|
| Hamzah Permata Putra | [@nacht24](https://github.com/nacht24) |
| Muhamad Anggara Ramadhan | [@muhanggaraaa](https://github.com/muhanggaraaa) |
| Murfid Muhyiddin | [@Murfid-m](https://github.com/Murfid-m) |

---

## License

This project is private and intended for TaskKu development and release use.
