/**
 * TaskKu Server Actions
 * 
 * ============================================
 * BAGIAN INTI: SERVER ACTIONS
 * ============================================
 * 
 * Server Actions adalah fungsi asinkron yang berjalan EKSKLUSIF di server,
 * namun bisa dipanggil langsung dari komponen UI (Client Components).
 * 
 * Keunggulan dibanding API Routes tradisional:
 * - Aman: Kode rahasia tidak bocor ke browser
 * - Sederhana: Tidak butuh endpoint API terpisah
 * - Cepat: Terintegrasi langsung dengan form HTML
 * - Type Safety: End-to-end TypeScript
 * - Progressive Enhancement: Bawaan (tetap jalan tanpa JS)
 * 
 * Directive "use server" menandai file ini HANYA berjalan di server.
 */

"use server";

import { supabase, isSupabaseConfigured, dbToTask, taskToDb } from "@/lib/supabase";
import type { Task } from "@/lib/types";

// ==================== READ ====================

/**
 * Server Action: Get All Tasks
 * 
 * Mengambil semua task dari Supabase database.
 * Jika Supabase belum dikonfigurasi, return array kosong
 * (client akan fallback ke localStorage).
 */
export async function getTasks(): Promise<Task[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.log("[Server Action] Supabase not configured, returning empty array");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("duedate", { ascending: true });

    if (error) {
      console.error("[Server Action] getTasks error:", error.message);
      return [];
    }

    return data ? data.map(dbToTask) : [];
  } catch (err) {
    console.error("[Server Action] getTasks exception:", err);
    return [];
  }
}

// ==================== CREATE ====================

/**
 * Server Action: Create Task
 * 
 * Membuat task baru di Supabase database.
 * Menerima Task object dan menyimpannya.
 * 
 * Ini adalah contoh Server Action yang dipanggil dari form:
 * - Form submit → Server Action → Insert ke DB → Return result
 * - Tidak perlu fetch() manual atau endpoint API terpisah!
 * 
 * @returns Task yang berhasil dibuat, atau null jika gagal
 */
export async function createTaskAction(task: Task): Promise<{ success: boolean; task?: Task; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    console.log("[Server Action] Supabase not configured, task not saved to DB");
    return { success: true, task }; // Return task as-is, client will save to localStorage
  }

  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert([taskToDb(task)])
      .select()
      .single();

    if (error) {
      console.error("[Server Action] createTask error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, task: dbToTask(data) };
  } catch (err) {
    console.error("[Server Action] createTask exception:", err);
    return { success: false, error: String(err) };
  }
}

// ==================== UPDATE ====================

/**
 * Server Action: Toggle Task Status
 * 
 * Toggle status done/undone dari sebuah task.
 * Menggunakan optimistic update pattern:
 * 1. Client update UI duluan (optimistic)
 * 2. Server Action dijalankan di background
 * 3. Jika gagal, client revert ke state sebelumnya
 * 
 * @returns Task yang sudah diupdate, atau error
 */
export async function toggleTaskAction(id: string): Promise<{ success: boolean; task?: Task; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true }; // Client handles localStorage
  }

  try {
    // Get current task
    const { data: current, error: fetchError } = await supabase
      .from("tasks")
      .select("done")
      .eq("id", id)
      .single();

    if (fetchError || !current) {
      return { success: false, error: fetchError?.message || "Task not found" };
    }

    // Toggle status
    const { data, error } = await supabase
      .from("tasks")
      .update({ done: !current.done })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, task: dbToTask(data) };
  } catch (err) {
    console.error("[Server Action] toggleTask exception:", err);
    return { success: false, error: String(err) };
  }
}

// ==================== DELETE ====================

/**
 * Server Action: Delete Task
 * 
 * Menghapus task dari Supabase database.
 * Juga menggunakan optimistic update pattern di client.
 * 
 * @returns Success status
 */
export async function deleteTaskAction(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true }; // Client handles localStorage
  }

  try {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[Server Action] deleteTask exception:", err);
    return { success: false, error: String(err) };
  }
}
