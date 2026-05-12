"use client";
import {
  X,
  Flag,
  Calendar as CalendarIcon,
  Clock,
  Tag,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";
import type { Task } from "@/lib/types";
import { PRIORITIES, FONT_HEADING, FONT } from "@/lib/types";
import { formatDate, isOverdue } from "@/lib/utils";

export function TaskDetailModal({
  task,
  onClose,
  onEdit,
  onToggle,
  onDelete,
}: {
  task: Task;
  onClose: () => void;
  onEdit: (t: Task) => void;
  onToggle: (t: Task) => void;
  onDelete: (t: Task) => void;
}) {
  const p = PRIORITIES.find((x) => x.id === task.priority)!;
  const overdue = isOverdue(task.dueDate, task.done);

  // Status badge config
  const status = task.done
    ? { label: "Selesai", class: "badge-done", icon: CheckCircle2 }
    : overdue
      ? { label: "Overdue", class: "badge-overdue", icon: AlertCircle }
      : { label: "Belum Selesai", class: "badge-pending", icon: Clock };

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
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--card-bg)",
          width: "100%",
          maxWidth: 420,
          borderRadius: "24px 24px 0 0",
          padding: "24px 20px 32px",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
          maxHeight: "85dvh",
          overflowY: "auto",
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
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                fontFamily: FONT_HEADING,
                color: "var(--foreground)",
                lineHeight: 1.3,
                wordBreak: "break-word",
              }}
            >
              {task.title}
            </h2>
            <div style={{ marginTop: 8 }}>
              <span className={`badge-status ${status.class}`}>
                <status.icon size={12} />
                {status.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
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
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        {task.description && (
          <div
            style={{
              background: "var(--info-item-bg)",
              borderRadius: 16,
              padding: "14px 16px",
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "var(--foreground-subtle)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.05em",
                marginBottom: 6,
              }}
            >
              Deskripsi
            </p>
            <p className="detail-description">{task.description}</p>
          </div>
        )}

        {/* Info Grid */}
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">
              <CalendarIcon
                size={10}
                style={{
                  display: "inline",
                  marginRight: 4,
                  verticalAlign: "middle",
                }}
              />
              Deadline
            </div>
            <div
              className="info-value"
              style={{
                color: overdue && !task.done ? "#DC2626" : "var(--foreground)",
              }}
            >
              {formatDate(task.dueDate)}
              {overdue && !task.done && (
                <span style={{ fontSize: 10, fontWeight: 600, marginLeft: 4 }}>
                  • Overdue
                </span>
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">
              <Flag
                size={10}
                style={{
                  display: "inline",
                  marginRight: 4,
                  verticalAlign: "middle",
                }}
              />
              Prioritas
            </div>
            <div className="info-value" style={{ color: p.color }}>
              {p.label}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">
              <Tag
                size={10}
                style={{
                  display: "inline",
                  marginRight: 4,
                  verticalAlign: "middle",
                }}
              />
              Kategori
            </div>
            <div className="info-value">{task.category}</div>
          </div>
          <div className="info-item">
            <div className="info-label">
              <Clock
                size={10}
                style={{
                  display: "inline",
                  marginRight: 4,
                  verticalAlign: "middle",
                }}
              />
              Dibuat
            </div>
            <div className="info-value" style={{ fontSize: 12 }}>
              {formatDate(task.createdAt?.slice(0, 10) || task.dueDate)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: 20,
          }}
        >
          {/* Primary actions row */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-primary"
              style={{ fontSize: 13, padding: "12px 16px" }}
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              <Pencil size={16} /> Edit Tugas
            </button>
            <button
              className="btn-secondary"
              style={{ fontSize: 13, padding: "12px 16px" }}
              onClick={() => {
                onToggle(task);
                onClose();
              }}
            >
              {task.done ? (
                <>
                  <RotateCcw size={16} /> Belum Selesai
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} /> Selesai
                </>
              )}
            </button>
          </div>

          {/* Delete button */}
          <button
            className="btn-ghost"
            style={{ color: "#ef4444", justifyContent: "center", marginTop: 4 }}
            onClick={() => {
              onClose();
              onDelete(task);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Trash2 size={14} /> Hapus Tugas
          </button>
        </div>
      </div>
    </div>
  );
}
