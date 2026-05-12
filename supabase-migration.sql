-- =============================================
-- TaskKu: Migrasi Multi-User
-- =============================================
-- Jalankan SQL ini di Supabase Dashboard > SQL Editor
-- untuk mendukung banyak user.

-- 1. Buat tabel users
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tambah kolom user_email di tabel tasks (jika belum ada)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'user_email'
  ) THEN
    ALTER TABLE tasks ADD COLUMN user_email TEXT;
  END IF;
END $$;

-- 3. Index untuk query performa
CREATE INDEX IF NOT EXISTS idx_tasks_user_email ON tasks(user_email);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 4. (Opsional) Row Level Security — aktifkan jika pakai Supabase Auth
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can only see their own tasks"
--   ON tasks FOR SELECT USING (user_email = current_setting('request.jwt.claims')::json->>'email');
