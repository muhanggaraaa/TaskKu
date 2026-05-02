"use client";

/**
 * TaskKu Main Client Component — Revamped Mobile-First Design
 */

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Check, CheckCircle2, Plus, Loader2, Home, User as UserIcon,
  Calendar as CalendarIcon, Bell, LogIn, LogOut, Clock, Search, X,
  Sparkles,
} from "lucide-react";
import type { Task, Screen } from "@/lib/types";
import { FONT, FONT_HEADING } from "@/lib/types";
import { todayISO } from "@/lib/utils";
import { toggleTaskAction, deleteTaskAction } from "@/app/actions/task-actions";
import { TaskCard } from "./TaskCard";
import { CalendarScreen } from "./CalendarScreen";
import { ProfileScreen } from "./ProfileScreen";
import { AddTaskModal } from "./AddTaskModal";

const STORAGE_KEY = "taskku_tasks";

export function TaskKuApp({ initialTasks }: { initialTasks: Task[] }) {
  const [user, setUser] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [screen, setScreen] = useState<Screen>("home");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loadingTasks] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user && tasks.length === 0) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) { try { setTasks(JSON.parse(stored)); } catch {} }
    }
  }, [user]);

  useEffect(() => {
    if (user && tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return toast.warning("Masukkan email Anda");
    if (!pass.trim()) return toast.warning("Masukkan password");
    const name = email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    setUser(name);
    toast.success(`Selamat datang, ${name}!`);
  };

  const toggleTask = async (t: Task) => {
    setTasks((prev) => prev.map((p) => p.id === t.id ? { ...p, done: !p.done } : p));
    try {
      const result = await toggleTaskAction(t.id);
      if (!result.success) {
        const stored: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const found = stored.find((s) => s.id === t.id);
        if (found) { found.done = !t.done; localStorage.setItem(STORAGE_KEY, JSON.stringify(stored)); }
      }
      if (!t.done) toast.success("Tugas selesai 🎉");
    } catch (err) {
      setTasks((prev) => prev.map((p) => p.id === t.id ? { ...p, done: t.done } : p));
      toast.error("Gagal update status", { description: String(err) });
    }
  };

  const deleteTask = async (t: Task) => {
    const prev = tasks;
    setTasks((p) => p.filter((x) => x.id !== t.id));
    try {
      const result = await deleteTaskAction(t.id);
      if (!result.success) {
        const stored: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored.filter((s) => s.id !== t.id)));
      }
      toast.success("Tugas dihapus");
    } catch (err) {
      setTasks(prev);
      toast.error("Gagal menghapus tugas", { description: String(err) });
    }
  };

  const onTaskCreated = (task: Task) => {
    setTasks((prev) => [...prev, task].sort((a, b) => a.dueDate.localeCompare(b.dueDate)));
  };

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }, [tasks, search]);

  const stats = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter((t) => t.done).length,
    overdue: tasks.filter((t) => !t.done && t.dueDate < todayISO()).length,
    today: tasks.filter((t) => t.dueDate === todayISO() && !t.done).length,
  }), [tasks]);

  // ==================== LOGIN SCREEN ====================
  if (!user) {
    return (
      <div style={{ fontFamily: FONT, minHeight: '100dvh', background: '#e2e8f0' }}>
        <div className="app-container" style={{
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #1e40af 0%, #4338ca 50%, #6366f1 100%)',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -80, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', top: 120, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'absolute', bottom: -60, right: 40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

          {/* Top section — branding */}
          <div style={{ flex: '0 0 auto', padding: '48px 24px 36px', textAlign: 'center', color: 'white', position: 'relative', zIndex: 1 }}>
            <div className="animate-float" style={{
              width: 64, height: 64, borderRadius: 18, margin: '0 auto 16px',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}>
              <Check size={28} color="white" strokeWidth={3} />
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: FONT_HEADING, letterSpacing: '-0.02em' }}>TaskKu</h1>
            <p style={{ fontSize: 13, opacity: 0.75, marginTop: 6, fontWeight: 400 }}>Atur Tugasmu, Raih Nilaimu</p>
          </div>

          {/* Bottom section — white card form */}
          <div className="animate-slide-up" style={{
            flex: 1, background: '#f8fafc', borderRadius: '28px 28px 0 0',
            padding: '32px 24px 40px', position: 'relative', zIndex: 1,
            boxShadow: '0 -4px 30px rgba(0,0,0,0.08)',
            display: 'flex', flexDirection: 'column',
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: FONT_HEADING, color: '#0f172a', marginBottom: 4 }}>Selamat Datang!</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>Masuk untuk mengelola tugasmu</p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@kampus.ac.id" className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, display: 'block' }}>Password</label>
                <input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••" className="input-field" />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
                <LogIn size={18} /> Masuk
              </button>
            </form>

            {/* Footer */}
            <div style={{
              marginTop: 'auto', paddingTop: 24,
              display: 'flex', justifyContent: 'center', gap: 16,
              fontSize: 11, color: '#94a3b8',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={10} /> TaskKu
              </span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={10} /> Server Actions MVP
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN APP ====================
  return (
    <div style={{ fontFamily: FONT }} className="min-h-dvh bg-slate-100 md:bg-slate-200">
      <div className="app-container">
        {/* ===== HEADER ===== */}
        <div style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #4338ca 50%, #6366f1 100%)',
          color: 'white', position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circle */}
          <div style={{
            position: 'absolute', top: -60, right: -40, width: 180, height: 180,
            borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
          }} />
          <div style={{
            position: 'absolute', bottom: -30, left: -20, width: 120, height: 120,
            borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
          }} />

          <div style={{ padding: '20px 20px 28px', position: 'relative', zIndex: 1 }}>
            {/* Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="glass" style={{
                  width: 44, height: 44, borderRadius: 14, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={20} color="white" strokeWidth={3} />
                </div>
                <div>
                  <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500 }}>Halo,</div>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT_HEADING }}>{user}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="glass" style={{
                  width: 40, height: 40, borderRadius: 12, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative',
                }}>
                  <Bell size={17} />
                  {stats.today > 0 && (
                    <span className="animate-pulse-dot" style={{
                      position: 'absolute', top: 8, right: 8, width: 7, height: 7,
                      background: '#f87171', borderRadius: '50%', border: '2px solid rgba(30,64,175,0.8)',
                    }} />
                  )}
                </button>
                <button onClick={() => { setUser(null); setTasks([]); setEmail(""); setPass(""); }}
                  className="glass" style={{
                    width: 40, height: 40, borderRadius: 12, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}>
                  <LogOut size={17} />
                </button>
              </div>
            </div>

            {/* Screen-specific header content */}
            {screen === "home" && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: FONT_HEADING, marginTop: 20, lineHeight: 1.3 }}>
                  {stats.today > 0 ? `Kamu punya ${stats.today} tugas hari ini` : "Hari ini lapang ✨"}
                </h2>
                <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
                  {[
                    { label: "Total", val: stats.total, icon: Home },
                    { label: "Selesai", val: stats.done, icon: CheckCircle2 },
                    { label: "Overdue", val: stats.overdue, icon: Clock },
                  ].map((s) => (
                    <div key={s.label} className="glass" style={{ borderRadius: 16, padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 600, opacity: 0.7, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
                        <s.icon size={10} /> {s.label}
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 800, fontFamily: FONT_HEADING, marginTop: 2 }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {screen === "calendar" && (
              <h2 className="animate-fade-in" style={{ fontSize: 20, fontWeight: 800, fontFamily: FONT_HEADING, marginTop: 20 }}>Kalender Tugas</h2>
            )}
            {screen === "profile" && (
              <h2 className="animate-fade-in" style={{ fontSize: 20, fontWeight: 800, fontFamily: FONT_HEADING, marginTop: 20 }}>Profil</h2>
            )}
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div style={{ padding: '0 16px', marginTop: -12, paddingBottom: 100, position: 'relative', zIndex: 2 }}>
          {screen === "home" && (
            <div className="space-y-3 animate-fade-in">
              {/* Search */}
              <div className="card" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Search size={16} color="#94a3b8" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari tugas, kategori…"
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: FONT, color: '#334155' }} />
                {search && (
                  <button onClick={() => setSearch("")} style={{ cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Task list */}
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, fontFamily: FONT_HEADING, color: '#475569', marginBottom: 10, paddingLeft: 4 }}>
                  Daftar Tugas
                </h3>
                {loadingTasks ? (
                  <div className="card" style={{ padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8' }}>
                    <Loader2 size={28} className="animate-spin" style={{ color: '#3b82f6' }} />
                    <p style={{ marginTop: 12, fontSize: 13 }}>Memuat tugas dari Supabase…</p>
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="card" style={{ padding: '48px 20px', textAlign: 'center', color: '#94a3b8', borderStyle: 'dashed' }}>
                    <CheckCircle2 size={32} style={{ margin: '0 auto', opacity: 0.3 }} />
                    <p style={{ marginTop: 12, fontSize: 13 }}>Belum ada tugas. Klik + untuk tambah.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 stagger-children">
                    {filteredTasks.map((t) => <TaskCard key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} />)}
                  </div>
                )}
              </div>
            </div>
          )}
          {screen === "calendar" && <CalendarScreen tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />}
          {screen === "profile" && <ProfileScreen user={user} stats={stats} onLogout={() => { setUser(null); setTasks([]); }} />}
        </div>

        {/* ===== FAB ===== */}
        <button onClick={() => setOpen(true)} style={{
          position: 'fixed', bottom: 88, zIndex: 30,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
          color: 'white', border: 'none', cursor: 'pointer',
          boxShadow: '0 6px 24px rgba(37,99,235,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease',
          left: 'min(calc(50% + 145px), calc(100vw - 70px))',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
          <Plus size={24} strokeWidth={2.5} />
        </button>

        {/* ===== BOTTOM NAV — same width as app-container ===== */}
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 420, zIndex: 20,
          background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid #e2e8f0',
          borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0',
          borderRadius: '0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 0 12px' }}>
            {([
              { id: "home" as Screen, icon: Home, label: "Home" },
              { id: "calendar" as Screen, icon: CalendarIcon, label: "Kalender" },
              { id: "profile" as Screen, icon: UserIcon, label: "Profil" },
            ]).map((tab) => {
              const active = screen === tab.id;
              return (
                <button key={tab.id} onClick={() => setScreen(tab.id)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  minWidth: 64, padding: '6px 0', cursor: 'pointer',
                  background: 'none', border: 'none', position: 'relative',
                }}>
                  {active && (
                    <span style={{
                      position: 'absolute', top: -8, width: 24, height: 3,
                      background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                      borderRadius: 4,
                    }} />
                  )}
                  <tab.icon size={22} color={active ? "#2563EB" : "#94A3B8"} strokeWidth={active ? 2.3 : 1.8} />
                  <span style={{
                    fontSize: 10, fontWeight: active ? 700 : 500,
                    color: active ? "#2563EB" : "#94A3B8",
                    fontFamily: FONT,
                  }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal open={open} onClose={() => setOpen(false)} onTaskCreated={onTaskCreated} />
    </div>
  );
}
