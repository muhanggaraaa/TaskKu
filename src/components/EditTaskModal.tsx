"use client";
import { useState } from "react";
import { toast } from "sonner";
import { X, Save, Loader2, Flag, CheckCircle2 } from "lucide-react";
import type { Task } from "@/lib/types";
import { PRIORITIES, CATEGORIES, FONT_HEADING, FONT } from "@/lib/types";
import { updateTaskAction } from "@/lib/actions/task-actions";
import type { TaskFieldErrors } from "@/lib/schemas";
import { todayISO } from "@/lib/utils";

export function EditTaskModal({
  task,
  onClose,
  onTaskUpdated,
  allowLocalFallback,
}: {
  task: Task;
  onClose: () => void;
  onTaskUpdated: (task: Task, persistence?: "remote" | "local") => void;
  allowLocalFallback: boolean;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState<Task["priority"]>(task.priority);
  const [category, setCategory] = useState(task.category);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<TaskFieldErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.warning("Judul tugas wajib diisi");
    setSubmitting(true);
    try {
      const updatedTask: Task = {
        ...task,
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
        category,
      };
      const result = await updateTaskAction(updatedTask);
      // Jika validasi gagal, tampilkan error per field
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
        return;
      }
      setFieldErrors({});
      if (result.source === "auth") {
        toast.error("Session berakhir", {
          description: result.error ?? "Silakan login ulang.",
        });
        return;
      }
      if (result.success && result.source === "supabase") {
        toast.success("Tugas berhasil diperbarui! ☁️", {
          description: `"${title.trim()}" tersimpan ke database.`,
          icon: <CheckCircle2 size={18} />,
        });
        onTaskUpdated(result.task || updatedTask, "remote");
      } else {
        if (!allowLocalFallback) {
          toast.error("Gagal memperbarui tugas", {
            description: result.error ?? "Perubahan dibatalkan.",
          });
          return;
        }
        // Fallback lokal dipersist oleh TaskKuApp dengan storage key per user.
        toast.success("Tugas diperbarui (lokal) 📱", {
          description: result.error
            ? `DB error: ${result.error}`
            : "Perubahan tersimpan di browser ini saja.",
          icon: <CheckCircle2 size={18} />,
        });
        onTaskUpdated(updatedTask, "local");
      }
      onClose();
    } catch (err) {
      toast.error("Gagal memperbarui tugas", { description: String(err) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="animate-fade-in-fast"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
      }}
      onClick={() => !submitting && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="animate-slide-up"
        style={{
          background: "var(--card-bg)",
          width: "100%",
          maxWidth: 420,
          borderRadius: "24px 24px 0 0",
          padding: "24px 20px 32px",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* Handle bar */}
        <div
          style={{
            width: 36,
            height: 4,
            background: "var(--card-border)",
            borderRadius: 4,
            margin: "0 auto 16px",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              fontFamily: FONT_HEADING,
              color: "var(--foreground)",
            }}
          >
            Edit Tugas
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{
              cursor: "pointer",
              color: "var(--foreground-subtle)",
              background: "var(--hover-bg)",
              border: "none",
              borderRadius: 10,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>
        <p style={{ fontSize: 11, color: "var(--foreground-subtle)", marginBottom: 20 }}>
          Perubahan disimpan via{" "}
          <span
            style={{
              color: "var(--notif-pill-text)",
              background: "var(--notif-pill)",
              padding: "1px 6px",
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 10,
            }}
          >
            Server Action
          </span>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Title */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--foreground-muted)",
                marginBottom: 6,
                display: "block",
              }}
            >
              Judul *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title)
                  setFieldErrors((p) => ({ ...p, title: undefined }));
              }}
              placeholder="Contoh: Submit laporan UX"
              maxLength={120}
              disabled={submitting}
              className="input-field"
              style={{
                fontSize: 14,
                borderColor: fieldErrors.title ? "#ef4444" : undefined,
              }}
            />
            {fieldErrors.title && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: 11,
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                {fieldErrors.title[0]}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--foreground-muted)",
                marginBottom: 6,
                display: "block",
              }}
            >
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description)
                  setFieldErrors((p) => ({ ...p, description: undefined }));
              }}
              placeholder="Detail tambahan (opsional)"
              rows={2}
              maxLength={500}
              disabled={submitting}
              className="input-field"
              style={{
                fontSize: 14,
                resize: "none",
                minHeight: 72,
                borderColor: fieldErrors.description ? "#ef4444" : undefined,
              }}
            />
            {fieldErrors.description && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: 11,
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                {fieldErrors.description[0]}
              </p>
            )}
          </div>

          {/* Date & Category */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--foreground-muted)",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Tanggal *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (fieldErrors.dueDate)
                    setFieldErrors((p) => ({ ...p, dueDate: undefined }));
                }}
                disabled={submitting}
                className="input-field"
                style={{
                  fontSize: 13,
                  borderColor: fieldErrors.dueDate ? "#ef4444" : undefined,
                }}
              />
              {/* Quick-pick chips */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginTop: 6,
                  flexWrap: "wrap",
                }}
              >
                {(() => {
                  const today = todayISO();
                  const t = new Date();
                  t.setDate(t.getDate() + 1);
                  const tomorrow = t.toISOString().slice(0, 10);
                  const w = new Date();
                  w.setDate(w.getDate() + 7);
                  const nextWeek = w.toISOString().slice(0, 10);
                  return (
                    <>
                      <button
                        type="button"
                        className="date-chip"
                        data-active={dueDate === today}
                        disabled={submitting}
                        onClick={() => setDueDate(today)}
                      >
                        Hari Ini
                      </button>
                      <button
                        type="button"
                        className="date-chip"
                        data-active={dueDate === tomorrow}
                        disabled={submitting}
                        onClick={() => setDueDate(tomorrow)}
                      >
                        Besok
                      </button>
                      <button
                        type="button"
                        className="date-chip"
                        data-active={dueDate === nextWeek}
                        disabled={submitting}
                        onClick={() => setDueDate(nextWeek)}
                      >
                        + 7 hari
                      </button>
                    </>
                  );
                })()}
              </div>
              {fieldErrors.dueDate && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: 11,
                    marginTop: 4,
                    fontWeight: 600,
                  }}
                >
                  {fieldErrors.dueDate[0]}
                </p>
              )}
            </div>
            <div>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--foreground-muted)",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={submitting}
                className="input-field"
                style={{ fontSize: 13 }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--foreground-muted)",
                marginBottom: 6,
                display: "block",
              }}
            >
              Prioritas
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
              }}
            >
              {PRIORITIES.map((pr) => (
                <button
                  key={pr.id}
                  type="button"
                  onClick={() => setPriority(pr.id)}
                  disabled={submitting}
                  style={{
                    padding: "10px 0",
                    borderRadius: 12,
                    cursor: "pointer",
                    border:
                      priority === pr.id ? "none" : "2px solid var(--card-border)",
                    background: priority === pr.id ? pr.bg : "var(--card-bg)",
                    color: priority === pr.id ? pr.color : "var(--foreground-muted)",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: FONT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    transition: "all 0.15s ease",
                  }}
                >
                  <Flag size={11} /> {pr.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
          style={{ marginTop: 20 }}
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Menyimpan…
            </>
          ) : (
            <>
              <Save size={18} /> Simpan Perubahan
            </>
          )}
        </button>
      </form>
    </div>
  );
}
