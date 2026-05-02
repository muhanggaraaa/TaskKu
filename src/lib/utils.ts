/**
 * Utility Functions
 */

/** Get today's date dalam format ISO (YYYY-MM-DD) */
export const todayISO = () => new Date().toISOString().slice(0, 10);

/** Format ISO date ke format lokal Indonesia (e.g., "15 Mei 2024") */
export const formatDate = (iso: string) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/** Cek apakah task sudah overdue (belum selesai dan sudah lewat deadline) */
export const isOverdue = (iso: string, done: boolean) =>
  !done && iso < todayISO();
