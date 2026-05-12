/**
 * TaskKu Type Definitions & Constants
 *
 * Shared types dan constants untuk seluruh aplikasi
 */

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  category: string;
  done: boolean;
  createdAt: string;
};

export type Screen = "home" | "calendar" | "profile";

/**
 * Priority levels dengan warna untuk UI
 */
export const PRIORITIES: {
  id: Task["priority"];
  label: string;
  color: string;
  bg: string;
}[] = [
  {
    id: "low",
    label: "Rendah",
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.15)",
  },
  {
    id: "medium",
    label: "Sedang",
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.15)",
  },
  {
    id: "high",
    label: "Tinggi",
    color: "#EF4444",
    bg: "rgba(239, 68, 68, 0.15)",
  },
];

export const CATEGORIES = ["Umum", "Kuliah", "Pekerjaan", "Pribadi", "Belanja"];

/**
 * Font constants
 */
export const FONT = "'Inter', sans-serif";
export const FONT_HEADING = "'Poppins', sans-serif";
