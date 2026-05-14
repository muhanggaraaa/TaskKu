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

import { cookies } from "next/headers";
import {
  supabase,
  isSupabaseConfigured,
  dbToTask,
  taskToDb,
} from "@/lib/supabase";
import type { Task } from "@/lib/types";
import { TaskFormSchema, type TaskFieldErrors } from "@/lib/schemas";
import { parseSession } from "@/lib/session";

const SESSION_COOKIE = "session";

async function getSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  const session = parseSession(sessionCookie);
  return session.email || null;
}

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
    return [];
  }

  const sessionEmail = await getSessionEmail();
  if (!sessionEmail) return [];

  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_email", sessionEmail)
      .order("duedate", { ascending: true });

    if (error) {
      return [];
    }

    return data ? data.map(dbToTask) : [];
  } catch {
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
export async function createTaskAction(
  task: Task,
): Promise<{
  success: boolean;
  task?: Task;
  error?: string;
  source?: string;
  fieldErrors?: TaskFieldErrors;
}> {
  // === Zod Validation ===
  const validation = TaskFormSchema.safeParse({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    category: task.category,
  });

  if (!validation.success) {
    const fieldErrors = validation.error.flatten()
      .fieldErrors as TaskFieldErrors;
    return {
      success: false,
      error: "Validasi gagal",
      fieldErrors,
      source: "validation",
    };
  }

  const taskData = validation.data;
  const validatedTask: Task = {
    ...task,
    title: taskData.title,
    description: taskData.description,
    dueDate: taskData.dueDate,
    priority: taskData.priority,
    category: taskData.category,
  };

  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: "Supabase not configured", source: "none" };
  }

  const sessionEmail = await getSessionEmail();
  if (!sessionEmail) {
    return {
      success: false,
      error: "Session tidak valid. Silakan login ulang.",
      source: "auth",
    };
  }

  try {
    const dbRecord = {
      ...taskToDb(validatedTask),
      user_email: sessionEmail,
    };
    const { data, error } = await supabase
      .from("tasks")
      .insert([dbRecord])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message, source: "supabase_error" };
    }

    return { success: true, task: dbToTask(data), source: "supabase" };
  } catch (err) {
    return { success: false, error: String(err), source: "exception" };
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
export async function toggleTaskAction(
  id: string,
): Promise<{ success: boolean; task?: Task; error?: string; source?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true, source: "none" }; // Client handles localStorage
  }

  const sessionEmail = await getSessionEmail();
  if (!sessionEmail) {
    return {
      success: false,
      error: "Session tidak valid. Silakan login ulang.",
      source: "auth",
    };
  }

  try {
    // Get current task scoped to the logged-in user
    const { data: current, error: fetchError } = await supabase
      .from("tasks")
      .select("done")
      .eq("id", id)
      .eq("user_email", sessionEmail)
      .single();

    if (fetchError || !current) {
      return {
        success: false,
        error: fetchError?.message || "Task not found",
        source: "supabase_error",
      };
    }

    // Toggle status
    const { data, error } = await supabase
      .from("tasks")
      .update({ done: !current.done })
      .eq("id", id)
      .eq("user_email", sessionEmail)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message, source: "supabase_error" };
    }

    return { success: true, task: dbToTask(data), source: "supabase" };
  } catch (err) {
    return { success: false, error: String(err), source: "exception" };
  }
}

// ==================== UPDATE (Full Edit) ====================

/**
 * Server Action: Update Task
 *
 * Memperbarui seluruh data task di Supabase database.
 * Digunakan ketika user mengedit tugas via EditTaskModal.
 *
 * Validasi menggunakan Zod schema yang sama dengan createTaskAction
 * untuk memastikan konsistensi data.
 *
 * @returns Task yang sudah diupdate, atau error
 */
export async function updateTaskAction(task: Task): Promise<{
  success: boolean;
  task?: Task;
  error?: string;
  source?: string;
  fieldErrors?: TaskFieldErrors;
}> {
  // === Zod Validation ===
  const validation = TaskFormSchema.safeParse({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    category: task.category,
  });

  if (!validation.success) {
    const fieldErrors = validation.error.flatten()
      .fieldErrors as TaskFieldErrors;
    return {
      success: false,
      error: "Validasi gagal",
      fieldErrors,
      source: "validation",
    };
  }

  const taskData = validation.data;

  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: "Supabase not configured", source: "none" };
  }

  const sessionEmail = await getSessionEmail();
  if (!sessionEmail) {
    return {
      success: false,
      error: "Session tidak valid. Silakan login ulang.",
      source: "auth",
    };
  }

  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: taskData.title,
        description: taskData.description,
        duedate: taskData.dueDate,
        priority: taskData.priority,
        category: taskData.category,
        done: task.done,
      })
      .eq("id", task.id)
      .eq("user_email", sessionEmail)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message, source: "supabase_error" };
    }

    return { success: true, task: dbToTask(data), source: "supabase" };
  } catch (err) {
    return { success: false, error: String(err), source: "exception" };
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
export async function deleteTaskAction(
  id: string,
): Promise<{ success: boolean; error?: string; source?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true, source: "none" }; // Client handles localStorage
  }

  const sessionEmail = await getSessionEmail();
  if (!sessionEmail) {
    return {
      success: false,
      error: "Session tidak valid. Silakan login ulang.",
      source: "auth",
    };
  }

  try {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_email", sessionEmail);

    if (error) {
      return { success: false, error: error.message, source: "supabase_error" };
    }

    return { success: true, source: "supabase" };
  } catch (err) {
    return { success: false, error: String(err), source: "exception" };
  }
}
