"use client";
import { Check, Trash2, Flag, Calendar as CalendarIcon } from "lucide-react";
import type { Task } from "@/lib/types";
import { PRIORITIES, FONT_HEADING, FONT } from "@/lib/types";
import { formatDate, isOverdue } from "@/lib/utils";

export function TaskCard({ task, onToggle, onDelete }: { task: Task; onToggle: (t: Task) => void; onDelete: (t: Task) => void }) {
  const p = PRIORITIES.find((x) => x.id === task.priority)!;
  const overdue = isOverdue(task.dueDate, task.done);

  return (
    <div className="card" style={{
      padding: '14px 16px',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      opacity: task.done ? 0.65 : 1,
      borderColor: overdue && !task.done ? '#fecaca' : undefined,
      borderLeft: overdue && !task.done ? '3px solid #ef4444' : undefined,
    }}>
      {/* Checkbox */}
      <button onClick={() => onToggle(task)} style={{
        marginTop: 2, width: 24, height: 24, borderRadius: 8, flexShrink: 0,
        border: task.done ? 'none' : '2px solid #cbd5e1',
        background: task.done ? 'linear-gradient(135deg, #2563eb, #4f46e5)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s ease',
      }}>
        {task.done && <Check size={14} color="white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <h4 style={{
            fontSize: 14, fontWeight: 700, fontFamily: FONT_HEADING, color: task.done ? '#94a3b8' : '#1e293b',
            textDecoration: task.done ? 'line-through' : 'none', lineHeight: 1.4,
          }}>{task.title}</h4>
          <button onClick={() => onDelete(task)} style={{
            flexShrink: 0, cursor: 'pointer', color: '#cbd5e1', background: 'none', border: 'none',
            padding: 4, borderRadius: 6, display: 'flex', transition: 'color 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; }}>
            <Trash2 size={15} />
          </button>
        </div>

        {task.description && (
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, lineHeight: 1.4 }}>{task.description}</p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {/* Priority */}
          <span style={{
            padding: '2px 8px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4,
            background: p.bg, color: p.color, fontSize: 10, fontWeight: 700, fontFamily: FONT,
          }}>
            <Flag size={9} /> {p.label}
          </span>
          {/* Category */}
          <span style={{
            padding: '2px 8px', borderRadius: 20,
            background: '#f1f5f9', color: '#64748b', fontSize: 10, fontWeight: 600,
          }}>
            {task.category}
          </span>
          {/* Date */}
          <span style={{
            display: 'flex', alignItems: 'center', gap: 3,
            color: overdue ? '#dc2626' : '#94a3b8', fontSize: 10, fontWeight: 600,
          }}>
            <CalendarIcon size={10} /> {formatDate(task.dueDate)} {overdue && "• Overdue"}
          </span>
        </div>
      </div>
    </div>
  );
}
