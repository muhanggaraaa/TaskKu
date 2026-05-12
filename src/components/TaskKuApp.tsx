"use client";

/**
 * TaskKu Main Client Component — Revamped Mobile-First Design
 *
 * Perubahan Tugas 9:
 * - Login dipindah ke /login (dilindungi middleware)
 * - Search menggunakan URL as State (useSearchParams)
 * - Optimistic UI menggunakan useOptimistic
 * - Logout via Server Action (hapus cookie)
 *
 * Improvement:
 * - Task Detail Modal (lihat detail lengkap)
 * - Edit Task Modal (edit tugas yang sudah ada)
 * - Konfirmasi Hapus (dialog konfirmasi sebelum hapus)
 */

import {
  useEffect,
  useMemo,
  useState,
  useOptimistic,
  useCallback,
  startTransition,
} from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  CheckCircle2,
  Plus,
  Home,
  User as UserIcon,
  Calendar as CalendarIcon,
  Bell,
  Moon,
  Sun,
  Clock,
  Search,
  X,
} from "lucide-react";
import type { Task, Screen } from "@/lib/types";
import { FONT, FONT_HEADING } from "@/lib/types";
import { todayISO } from "@/lib/utils";
import { toggleTaskAction, deleteTaskAction } from "@/lib/actions/task-actions";
import { useTheme } from "@/lib/useTheme";
import { TaskCard } from "@/components/TaskCard";
import { CalendarScreen } from "@/components/CalendarScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { AddTaskModal } from "@/components/AddTaskModal";
import { TaskDetailModal } from "@/components/TaskDetailModal";
import { EditTaskModal } from "@/components/EditTaskModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  NotificationPanel,
  useActiveNotifications,
} from "@/components/NotificationPanel";

const STORAGE_KEY = "taskku_tasks";

type OptimisticAction =
  | { type: "toggle"; id: string }
  | { type: "delete"; id: string }
  | { type: "add"; task: Task }
  | { type: "update"; task: Task };

export function TaskKuApp({
  initialTasks,
  user,
}: {
  initialTasks: Task[];
  user: string;
}) {
  const [screen, setScreen] = useState<Screen>("home");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // === Theme (dark/light) ===
  const { theme, toggleTheme, mounted: themeMounted } = useTheme();

  // === New States for Detail, Edit, Delete Confirm ===
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // === Task 3: URL as State — Search via URL search params ===
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const search = searchParams.get("search") || "";

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set("search", term);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  // === Task 4: Optimistic UI dengan useOptimistic ===
  const [optimisticTasks, addOptimistic] = useOptimistic(
    tasks,
    (state: Task[], action: OptimisticAction) => {
      switch (action.type) {
        case "toggle":
          return state.map((t) =>
            t.id === action.id ? { ...t, done: !t.done } : t,
          );
        case "delete":
          return state.filter((t) => t.id !== action.id);
        case "add":
          return [...state, action.task].sort((a, b) =>
            a.dueDate.localeCompare(b.dueDate),
          );
        case "update":
          return state
            .map((t) => (t.id === action.task.id ? action.task : t))
            .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        default:
          return state;
      }
    },
  );

  useEffect(() => {
    if (tasks.length === 0) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setTasks(JSON.parse(stored));
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const toggleTask = (t: Task) => {
    startTransition(async () => {
      // Optimistic update — UI berubah instan
      addOptimistic({ type: "toggle", id: t.id });
      try {
        const result = await toggleTaskAction(t.id);
        if (!result.success) {
          const stored: Task[] = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]",
          );
          const found = stored.find((s) => s.id === t.id);
          if (found) {
            found.done = !t.done;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
          }
        }
        // Update actual state setelah server response
        setTasks((prev) =>
          prev.map((p) => (p.id === t.id ? { ...p, done: !p.done } : p)),
        );
        if (!t.done) toast.success("Tugas selesai 🎉");
      } catch (err) {
        toast.error("Gagal update status", { description: String(err) });
      }
    });
  };

  const deleteTask = (t: Task) => {
    startTransition(async () => {
      // Optimistic update — item langsung hilang
      addOptimistic({ type: "delete", id: t.id });
      try {
        const result = await deleteTaskAction(t.id);
        if (!result.success) {
          const stored: Task[] = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]",
          );
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(stored.filter((s) => s.id !== t.id)),
          );
        }
        // Update actual state
        setTasks((p) => p.filter((x) => x.id !== t.id));
        toast.success("Tugas dihapus");
      } catch (err) {
        toast.error("Gagal menghapus tugas", { description: String(err) });
      }
    });
  };

  // Confirm delete flow
  const handleDeleteRequest = (t: Task) => {
    setDeletingTask(t);
  };

  const confirmDelete = () => {
    if (deletingTask) {
      deleteTask(deletingTask);
      setDeletingTask(null);
    }
  };

  const onTaskCreated = (task: Task) => {
    setTasks((prev) =>
      [...prev, task].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    );
  };

  const onTaskUpdated = (updatedTask: Task) => {
    startTransition(() => {
      addOptimistic({ type: "update", task: updatedTask });
    });
    setTasks((prev) =>
      prev
        .map((t) => (t.id === updatedTask.id ? updatedTask : t))
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    );
  };

  // Filter menggunakan optimisticTasks (bukan tasks) agar sinkron
  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return optimisticTasks;
    return optimisticTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  }, [optimisticTasks, search]);

  const stats = useMemo(
    () => ({
      total: optimisticTasks.length,
      done: optimisticTasks.filter((t) => t.done).length,
      overdue: optimisticTasks.filter((t) => !t.done && t.dueDate < todayISO())
        .length,
      today: optimisticTasks.filter((t) => t.dueDate === todayISO() && !t.done)
        .length,
    }),
    [optimisticTasks],
  );

  // === Active notifications ===
  const {
    active: activeNotifications,
    dismiss: dismissNotification,
    clearAll: clearAllNotifications,
  } = useActiveNotifications(optimisticTasks);

  const handleNotificationSelect = (taskId: string) => {
    const task = optimisticTasks.find((t) => t.id === taskId);
    if (task) setSelectedTask(task);
  };

  // ==================== MAIN APP ====================
  return (
    <div style={{ fontFamily: FONT }} className="min-h-dvh">
      <div className="app-container">
        {/* ===== HEADER ===== */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #1e40af 0%, #4338ca 50%, #6366f1 100%)",
            color: "white",
            position: "relative",
          }}
        >
          {/* Decorative circles — wrapped in their own clipping layer so the
              header itself can keep overflow:visible (needed for the
              notification panel dropdown to escape the gradient bounds). */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -60,
                right: -40,
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -30,
                left: -20,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
              }}
            />
          </div>

          <div
            style={{
              padding: "20px 20px 28px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Top bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  className="glass"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={20} color="white" strokeWidth={3} />
                </div>
                <div>
                  <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500 }}>
                    Halo,
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      fontFamily: FONT_HEADING,
                    }}
                  >
                    {user}
                  </div>
                </div>
              </div>
              <div
                style={{ display: "flex", gap: 10, position: "relative" }}
              >
                <button
                  type="button"
                  aria-label="Buka notifikasi"
                  aria-haspopup="dialog"
                  aria-expanded={notifOpen}
                  onClick={() => setNotifOpen((v) => !v)}
                  className="glass header-icon-btn"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    position: "relative",
                    color: "white",
                    border: "none",
                  }}
                >
                  <Bell size={17} />
                  {activeNotifications.length > 0 && (
                    <span
                      aria-label={`${activeNotifications.length} notifikasi baru`}
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        minWidth: 18,
                        height: 18,
                        padding: "0 5px",
                        background:
                          "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        borderRadius: 999,
                        border: "2px solid rgba(30, 64, 175, 0.95)",
                        boxShadow: "0 2px 6px rgba(220, 38, 38, 0.45)",
                        fontSize: 10,
                        fontWeight: 800,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1,
                      }}
                    >
                      {activeNotifications.length > 9
                        ? "9+"
                        : activeNotifications.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  aria-label={
                    theme === "dark"
                      ? "Beralih ke mode terang"
                      : "Beralih ke mode gelap"
                  }
                  aria-pressed={theme === "dark"}
                  onClick={toggleTheme}
                  className="glass header-icon-btn"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                    border: "none",
                  }}
                >
                  {themeMounted && theme === "dark" ? (
                    <Sun size={17} />
                  ) : (
                    <Moon size={17} />
                  )}
                </button>
                <NotificationPanel
                  notifications={activeNotifications}
                  open={notifOpen}
                  onClose={() => setNotifOpen(false)}
                  onDismiss={dismissNotification}
                  onClearAll={clearAllNotifications}
                  onSelect={handleNotificationSelect}
                />
              </div>
            </div>

            {/* Screen-specific header content */}
            {screen === "home" && (
              <div className="animate-fade-in">
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    fontFamily: FONT_HEADING,
                    marginTop: 20,
                    lineHeight: 1.3,
                  }}
                >
                  {stats.today > 0
                    ? `Kamu punya ${stats.today} tugas hari ini`
                    : "Hari ini lapang ✨"}
                </h2>
                <div
                  className="stagger-children"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 10,
                    marginTop: 16,
                  }}
                >
                  {[
                    { label: "Total", val: stats.total, icon: Home },
                    { label: "Selesai", val: stats.done, icon: CheckCircle2 },
                    { label: "Overdue", val: stats.overdue, icon: Clock },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="glass"
                      style={{ borderRadius: 16, padding: "12px 10px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 9,
                          fontWeight: 600,
                          opacity: 0.7,
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.05em",
                        }}
                      >
                        <s.icon size={10} /> {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          fontFamily: FONT_HEADING,
                          marginTop: 2,
                        }}
                      >
                        {s.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {screen === "calendar" && (
              <h2
                className="animate-fade-in"
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  fontFamily: FONT_HEADING,
                  marginTop: 20,
                }}
              >
                Kalender Tugas
              </h2>
            )}
            {screen === "profile" && (
              <h2
                className="animate-fade-in"
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  fontFamily: FONT_HEADING,
                  marginTop: 20,
                }}
              >
                Profil
              </h2>
            )}
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div
          style={{
            padding: "0 16px",
            marginTop: -12,
            paddingBottom: 100,
            position: "relative",
            zIndex: 2,
          }}
        >
          {screen === "home" && (
            <div className="space-y-4 animate-fade-in">
              {/* Search — URL as State */}
              <div
                className="card"
                style={{
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Search size={16} color="var(--foreground-subtle)" />
                <input
                  defaultValue={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Cari tugas, kategori…"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 14,
                    fontFamily: FONT,
                    color: "var(--foreground)",
                  }}
                />
                {search && (
                  <button
                    type="button"
                    aria-label="Bersihkan pencarian"
                    onClick={() => handleSearch("")}
                    style={{
                      cursor: "pointer",
                      color: "var(--foreground-subtle)",
                      display: "flex",
                      background: "transparent",
                      border: "none",
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Task list */}
              <div style={{ marginTop: 4 }}>
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: FONT_HEADING,
                    color: "var(--foreground-muted)",
                    marginBottom: 12,
                    paddingLeft: 4,
                  }}
                >
                  Daftar Tugas
                </h3>
                {filteredTasks.length === 0 ? (
                  <div
                    className="card"
                    style={{
                      padding: "44px 24px 36px",
                      textAlign: "center",
                      color: "var(--foreground-subtle)",
                      borderStyle: "dashed",
                    }}
                  >
                    <div
                      className="animate-float"
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 22,
                        margin: "0 auto 16px",
                        background:
                          "linear-gradient(135deg, var(--notif-pill) 0%, var(--hover-bg) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--notif-pill-text)",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 24px -8px rgba(37, 99, 235, 0.25)",
                      }}
                    >
                      <CheckCircle2 size={36} strokeWidth={2} />
                    </div>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        fontFamily: FONT_HEADING,
                        color: "var(--foreground)",
                        marginBottom: 4,
                      }}
                    >
                      {search ? "Tidak ada hasil" : "Belum ada tugas"}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--foreground-subtle)",
                        marginBottom: 16,
                      }}
                    >
                      {search
                        ? `Tidak ada tugas cocok dengan "${search}".`
                        : "Mulai dengan menambahkan tugas pertamamu."}
                    </p>
                    {!search && (
                      <button
                        type="button"
                        onClick={() => setOpen(true)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "8px 16px",
                          background:
                            "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: FONT_HEADING,
                          cursor: "pointer",
                          boxShadow:
                            "0 4px 12px rgba(37, 99, 235, 0.3)",
                          transition: "transform 0.15s ease, box-shadow 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 16px rgba(37, 99, 235, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(37, 99, 235, 0.3)";
                        }}
                      >
                        <Plus size={14} /> Tambah Tugas
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="stagger-children">
                    {filteredTasks.map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        onToggle={toggleTask}
                        onDetail={setSelectedTask}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {screen === "calendar" && (
            <CalendarScreen
              tasks={optimisticTasks}
              onToggle={toggleTask}
              onDelete={handleDeleteRequest}
              onDetail={setSelectedTask}
            />
          )}
          {screen === "profile" && <ProfileScreen user={user} stats={stats} />}
        </div>

        {/* ===== FAB ===== */}
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 88,
            zIndex: 30,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
            color: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 6px 24px rgba(37,99,235,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            right: "max(calc(50% - 180px), 16px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>

        {/* ===== BOTTOM NAV — same width as app-container ===== */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 420,
            zIndex: 20,
            background: "var(--bottom-nav-bg)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid var(--bottom-nav-border)",
            borderLeft: "1px solid var(--bottom-nav-border)",
            borderRight: "1px solid var(--bottom-nav-border)",
            borderRadius: "0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "8px 0 12px",
            }}
          >
            {[
              { id: "home" as Screen, icon: Home, label: "Home" },
              {
                id: "calendar" as Screen,
                icon: CalendarIcon,
                label: "Kalender",
              },
              { id: "profile" as Screen, icon: UserIcon, label: "Profil" },
            ].map((tab) => {
              const active = screen === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setScreen(tab.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    minWidth: 64,
                    padding: "6px 0",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    position: "relative",
                  }}
                >
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        top: -8,
                        width: 24,
                        height: 3,
                        background: "linear-gradient(90deg, #2563eb, #4f46e5)",
                        borderRadius: 4,
                      }}
                    />
                  )}
                  <tab.icon
                    size={22}
                    color={active ? "#2563EB" : "var(--foreground-subtle)"}
                    strokeWidth={active ? 2.3 : 1.8}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: active ? 700 : 500,
                      color: active ? "#2563EB" : "var(--foreground-subtle)",
                      fontFamily: FONT,
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={open}
        onClose={() => setOpen(false)}
        onTaskCreated={onTaskCreated}
      />

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={(t) => {
            setSelectedTask(null);
            setEditingTask(t);
          }}
          onToggle={(t) => {
            toggleTask(t);
            setSelectedTask(null);
          }}
          onDelete={(t) => {
            setSelectedTask(null);
            handleDeleteRequest(t);
          }}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={(updatedTask) => {
            onTaskUpdated(updatedTask);
            setEditingTask(null);
          }}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deletingTask}
        title="Hapus Tugas?"
        message={`Tugas "${deletingTask?.title}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}
