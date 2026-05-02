"use client";
import { useState } from "react";
import { toast } from "sonner";
import { X, Plus, Loader2, Flag, CheckCircle2 } from "lucide-react";
import type { Task } from "@/lib/types";
import { PRIORITIES, CATEGORIES, FONT_HEADING, FONT } from "@/lib/types";
import { todayISO } from "@/lib/utils";
import { createTaskAction } from "@/app/actions/task-actions";

export function AddTaskModal({ open, onClose, onTaskCreated }: {
  open: boolean; onClose: () => void; onTaskCreated: (task: Task) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(todayISO());
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setTitle(""); setDescription(""); setDueDate(todayISO());
    setPriority("medium"); setCategory(CATEGORIES[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.warning("Judul tugas wajib diisi");
    setSubmitting(true);
    try {
      const id = `task:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
      const record: Task = {
        id, title: title.trim(), description: description.trim(),
        dueDate, priority, category, done: false, createdAt: new Date().toISOString(),
      };
      const result = await createTaskAction(record);
      if (result.success) {
        toast.success("Tugas berhasil disimpan!", {
          description: `"${title.trim()}" tersimpan via Server Action.`,
          icon: <CheckCircle2 size={18} />,
        });
        onTaskCreated(result.task || record);
      } else {
        const stored = JSON.parse(localStorage.getItem("taskku_tasks") || "[]");
        stored.push(record);
        localStorage.setItem("taskku_tasks", JSON.stringify(stored));
        toast.success("Tugas disimpan (localStorage)", { icon: <CheckCircle2 size={18} /> });
        onTaskCreated(record);
      }
      resetForm();
      onClose();
    } catch (err) {
      toast.error("Gagal menyimpan tugas", { description: String(err) });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="animate-fade-in-fast" style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
    }}
      onClick={() => !submitting && onClose()}>

      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}
        className="animate-slide-up" style={{
          background: 'white', width: '100%', maxWidth: 420,
          borderRadius: '24px 24px 0 0', padding: '24px 20px 32px',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
        }}>

        {/* Handle bar */}
        <div style={{ width: 36, height: 4, background: '#e2e8f0', borderRadius: 4, margin: '0 auto 16px' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, fontFamily: FONT_HEADING, color: '#0f172a' }}>Tambah Tugas</h2>
          <button type="button" onClick={onClose} disabled={submitting} style={{
            cursor: 'pointer', color: '#94a3b8', background: '#f1f5f9',
            border: 'none', borderRadius: 10, width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={16} />
          </button>
        </div>
        <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 20 }}>
          Disimpan via <span style={{ color: '#3b82f6', background: '#eff6ff', padding: '1px 6px', borderRadius: 4, fontWeight: 600, fontSize: 10 }}>Server Action</span>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Judul *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Submit laporan UX" maxLength={120} disabled={submitting}
              className="input-field" style={{ fontSize: 14 }} />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Deskripsi</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail tambahan (opsional)" rows={2} maxLength={500} disabled={submitting}
              className="input-field" style={{ fontSize: 14, resize: 'none', minHeight: 72 }} />
          </div>

          {/* Date & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Tanggal *</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={submitting}
                className="input-field" style={{ fontSize: 13 }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={submitting}
                className="input-field" style={{ fontSize: 13 }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Prioritas</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {PRIORITIES.map((p) => (
                <button key={p.id} type="button" onClick={() => setPriority(p.id)} disabled={submitting}
                  style={{
                    padding: '10px 0', borderRadius: 12, cursor: 'pointer',
                    border: priority === p.id ? 'none' : '2px solid #e2e8f0',
                    background: priority === p.id ? p.bg : 'white',
                    color: priority === p.id ? p.color : '#64748b',
                    fontSize: 11, fontWeight: 700, fontFamily: FONT,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    transition: 'all 0.15s ease',
                  }}>
                  <Flag size={11} /> {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={submitting} className="btn-primary" style={{ marginTop: 20 }}>
          {submitting ? (
            <><Loader2 size={18} className="animate-spin" /> Menyimpan…</>
          ) : (
            <><Plus size={18} /> Simpan Tugas</>
          )}
        </button>
      </form>
    </div>
  );
}
