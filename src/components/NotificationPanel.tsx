"use client";

/**
 * NotificationPanel — Dropdown notifikasi aktif
 *
 * Menampilkan notifikasi berdasarkan kondisi tugas:
 * - Tugas overdue (peringatan, prioritas tinggi)
 * - Tugas jatuh tempo hari ini (reminder)
 * - Tugas selesai (konfirmasi)
 *
 * Notifikasi dapat di-dismiss secara individual.
 * State dismiss disimpan di localStorage agar persisten.
 */

import { useEffect, useMemo, useRef, useState } from "react";

import {
  AlarmClock,
  AlertTriangle,
  Bell,
  CheckCircle2,
  X,
} from "lucide-react";
import type { Task } from "@/lib/types";
import { FONT, FONT_HEADING } from "@/lib/types";
import { formatDate, todayISO } from "@/lib/utils";

const DISMISSED_KEY = "taskku_notifications_dismissed";

type NotificationKind = "overdue" | "today" | "done";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  taskId: string;
};

function loadDismissed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      return new Set(arr.filter((x): x is string => typeof x === "string"));
    }
  } catch {}
  return new Set();
}

function persistDismissed(set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

function buildNotifications(tasks: Task[]): AppNotification[] {
  const today = todayISO();
  const list: AppNotification[] = [];

  for (const t of tasks) {
    if (!t.done && t.dueDate < today) {
      list.push({
        id: `overdue-${t.id}`,
        kind: "overdue",
        title: "Tugas Terlewat",
        message: `"${t.title}" sudah lewat tenggat (${formatDate(t.dueDate)})`,
        taskId: t.id,
      });
    } else if (!t.done && t.dueDate === today) {
      list.push({
        id: `today-${t.id}`,
        kind: "today",
        title: "Jatuh Tempo Hari Ini",
        message: `"${t.title}" harus diselesaikan hari ini`,
        taskId: t.id,
      });
    } else if (t.done) {
      list.push({
        id: `done-${t.id}`,
        kind: "done",
        title: "Tugas Selesai",
        message: `"${t.title}" sudah ditandai selesai`,
        taskId: t.id,
      });
    }
  }

  const order: Record<NotificationKind, number> = {
    overdue: 0,
    today: 1,
    done: 2,
  };
  list.sort((a, b) => order[a.kind] - order[b.kind]);
  return list;
}

const KIND_META: Record<
  NotificationKind,
  { color: string; bg: string; icon: typeof Bell; label: string }
> = {
  overdue: {
    color: "#dc2626",
    bg: "rgba(220, 38, 38, 0.12)",
    icon: AlertTriangle,
    label: "Overdue",
  },
  today: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
    icon: AlarmClock,
    label: "Hari Ini",
  },
  done: {
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.12)",
    icon: CheckCircle2,
    label: "Selesai",
  },
};

export function useActiveNotifications(tasks: Task[]) {
  const [dismissed, setDismissed] = useState<Set<string>>(() =>
    typeof window === "undefined" ? new Set() : loadDismissed(),
  );

  const all = useMemo(() => buildNotifications(tasks), [tasks]);
  const active = useMemo(
    () => all.filter((n) => !dismissed.has(n.id)),
    [all, dismissed],
  );

  const dismiss = (id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      persistDismissed(next);
      return next;
    });
  };

  const clearAll = () => {
    setDismissed((prev) => {
      const next = new Set(prev);
      for (const n of all) next.add(n.id);
      persistDismissed(next);
      return next;
    });
  };

  // Bersihkan dismissed yang tidak relevan lagi (id sudah tidak ada di list).
  // Dilakukan dalam effect karena bergantung pada hasil `buildNotifications`
  // (tasks dari props), dan state lokal `dismissed` perlu di-sinkronkan.
  useEffect(() => {
    if (dismissed.size === 0) return;
    const validIds = new Set(all.map((n) => n.id));
    let changed = false;
    const next = new Set<string>();
    for (const id of dismissed) {
      if (validIds.has(id)) next.add(id);
      else changed = true;
    }
    if (changed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDismissed(next);
      persistDismissed(next);
    }
  }, [all, dismissed]);

  return { active, all, dismiss, clearAll };
}

export function NotificationPanel({
  notifications,
  open,
  onClose,
  onDismiss,
  onClearAll,
  onSelect,
}: {
  notifications: AppNotification[];
  open: boolean;
  onClose: () => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onSelect: (taskId: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Notifikasi"
      className="animate-slide-down"
      style={{
        position: "absolute",
        top: 52,
        right: 0,
        width: "min(320px, calc(100vw - 32px))",
        maxHeight: 420,
        background: "var(--card-bg)",
        color: "var(--foreground)",
        border: "1px solid var(--card-border)",
        borderRadius: 16,
        boxShadow:
          "0 12px 32px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.10)",
        zIndex: 50,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: "1px solid var(--card-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 700,
            fontFamily: FONT_HEADING,
            fontSize: 14,
          }}
        >
          <Bell size={16} /> Notifikasi
          {notifications.length > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 999,
                background: "var(--notif-pill)",
                color: "var(--notif-pill-text)",
              }}
            >
              {notifications.length}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--foreground-subtle)",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
              padding: 4,
            }}
          >
            Hapus Semua
          </button>
        )}
      </div>

      <div
        style={{
          overflowY: "auto",
          maxHeight: 360,
        }}
      >
        {notifications.length === 0 ? (
          <div
            style={{
              padding: "32px 20px",
              textAlign: "center",
              color: "var(--foreground-subtle)",
              fontSize: 13,
            }}
          >
            <Bell
              size={28}
              style={{ margin: "0 auto 8px", opacity: 0.4 }}
            />
            <div style={{ fontWeight: 600 }}>Tidak ada notifikasi</div>
            <div style={{ marginTop: 4, fontSize: 11 }}>
              Semua tugas sudah tertangani 👍
            </div>
          </div>
        ) : (
          notifications.map((n) => {
            const meta = KIND_META[n.kind];
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  onSelect(n.taskId);
                  onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 14px",
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--card-border)",
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: FONT,
                  color: "var(--foreground)",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: meta.bg,
                    color: meta.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--foreground)",
                      fontFamily: FONT_HEADING,
                    }}
                  >
                    {n.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--foreground-muted)",
                      marginTop: 2,
                      lineHeight: 1.4,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {n.message}
                  </div>
                </div>
                <span
                  role="button"
                  aria-label="Tutup notifikasi"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(n.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      onDismiss(n.id);
                    }
                  }}
                  style={{
                    color: "var(--foreground-subtle)",
                    padding: 4,
                    borderRadius: 6,
                    flexShrink: 0,
                    cursor: "pointer",
                    display: "inline-flex",
                  }}
                >
                  <X size={14} />
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
