"use client";

import { Check, Flag, Calendar as CalendarIcon } from "lucide-react";
import type { Task } from "@/lib/types";
import { PRIORITIES, FONT_HEADING, FONT } from "@/lib/types";
import { formatDate, isOverdue } from "@/lib/utils";

export function TaskCard({
  task,
  onToggle,
  onDetail,
}: {
  task: Task;
  onToggle: (t: Task) => void;
  onDetail: (t: Task) => void;
}) {
  const priority = PRIORITIES.find((x) => x.id === task.priority)!;
  const overdue = isOverdue(task.dueDate, task.done);

  return (
    <div
      className="card card-clickable"
      role="button"
      tabIndex={0}
      onClick={() => onDetail(task)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onDetail(task);
        }
      }}
      style={{
        padding: "14px 16px",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        opacity: task.done ? 0.65 : 1,
        borderColor: overdue && !task.done ? "#fecaca" : undefined,
        borderLeft: overdue && !task.done ? "3px solid #ef4444" : undefined,
        transition: "all 0.2s ease",
      }}
    >
      <button
        type="button"
        aria-label={
          task.done
            ? `Tandai ${task.title} belum selesai`
            : `Tandai ${task.title} selesai`
        }
        aria-pressed={task.done}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task);
        }}
        onKeyDown={(e) => e.stopPropagation()}
        style={{
          marginTop: 2,
          width: 24,
          height: 24,
          borderRadius: 8,
          flexShrink: 0,
          border: task.done ? "none" : "2px solid var(--card-border)",
          background: task.done
            ? "linear-gradient(135deg, #2563eb, #4f46e5)"
            : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
      >
        {task.done && <Check size={14} color="white" strokeWidth={3} />}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            fontSize: 14,
            fontWeight: 700,
            fontFamily: FONT_HEADING,
            color: task.done ? "var(--foreground-subtle)" : "var(--foreground)",
            textDecoration: task.done ? "line-through" : "none",
            lineHeight: 1.4,
          }}
        >
          {task.title}
        </h4>

        {task.description && (
          <p
            style={{
              fontSize: 12,
              color: "var(--foreground-subtle)",
              marginTop: 3,
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {task.description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 6,
            marginTop: 8,
          }}
        >
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: priority.bg,
              color: priority.color,
              fontSize: 10,
              fontWeight: 700,
              fontFamily: FONT,
            }}
          >
            <Flag size={9} /> {priority.label}
          </span>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 20,
              background: "var(--hover-bg)",
              color: "var(--foreground-muted)",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            {task.category}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              color: overdue ? "#dc2626" : "var(--foreground-subtle)",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            <CalendarIcon size={10} /> {formatDate(task.dueDate)}{" "}
            {overdue && "• Overdue"}
          </span>
        </div>
      </div>
    </div>
  );
}
