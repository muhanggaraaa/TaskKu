/**
 * Supabase Client Configuration (Server-side)
 * 
 * Initialize Supabase client untuk digunakan di Server Actions.
 * Credentials TIDAK terekspos ke browser karena tidak pakai NEXT_PUBLIC_ prefix.
 * 
 * Jika env vars belum diset, client tetap dibuat tapi akan gagal saat query
 * dan fallback ke localStorage di client side.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Cek apakah Supabase sudah dikonfigurasi
 */
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * Supabase client instance
 * Bisa dipakai di server actions maupun client components
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Transform database columns ke camelCase untuk JS
 */
export const dbToTask = (dbRow: Record<string, unknown>) => ({
  id: dbRow.id as string,
  title: dbRow.title as string,
  description: dbRow.description as string,
  dueDate: dbRow.duedate as string,
  priority: dbRow.priority as "low" | "medium" | "high",
  category: dbRow.category as string,
  done: dbRow.done as boolean,
  createdAt: dbRow.created_at as string,
});

/**
 * Transform camelCase dari JS ke database columns
 */
export const taskToDb = (task: {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  category: string;
  done: boolean;
  createdAt: string;
}) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  duedate: task.dueDate,
  priority: task.priority,
  category: task.category,
  done: task.done,
  created_at: task.createdAt,
});
