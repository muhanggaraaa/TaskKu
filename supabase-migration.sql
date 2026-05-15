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
