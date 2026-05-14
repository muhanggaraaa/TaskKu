/**
 * Zod Validation Schemas
 * 
 * Schema validasi untuk memastikan data yang masuk
 * ke database 100% valid dan aman.
 * 
 * Digunakan di Server Actions dengan metode .safeParse()
 */

import { z } from "zod";

function isValidISODate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/**
 * Schema untuk membuat Task baru
 * 
 * Validasi:
 * - title: wajib, minimal 1 karakter, maksimal 120
 * - description: opsional, maksimal 500 karakter
 * - dueDate: wajib, format YYYY-MM-DD
 * - priority: wajib, harus salah satu dari low/medium/high
 * - category: wajib, string tidak boleh kosong
 */
export const TaskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Judul tugas wajib diisi" })
    .max(120, { message: "Judul maksimal 120 karakter" }),
  description: z
    .string()
    .trim()
    .max(500, { message: "Deskripsi maksimal 500 karakter" })
    .optional()
    .default(""),
  dueDate: z
    .string()
    .trim()
    .min(1, { message: "Tanggal wajib diisi" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Format tanggal tidak valid (YYYY-MM-DD)" })
    .refine(isValidISODate, { message: "Tanggal tidak valid" }),
  priority: z.enum(["low", "medium", "high"], {
    message: "Prioritas harus dipilih (Rendah/Sedang/Tinggi)",
  }),
  category: z
    .string()
    .trim()
    .min(1, { message: "Kategori wajib dipilih" }),
});

/**
 * Tipe untuk field errors yang dikembalikan ke UI
 */
export type TaskFieldErrors = {
  title?: string[];
  description?: string[];
  dueDate?: string[];
  priority?: string[];
  category?: string[];
};
