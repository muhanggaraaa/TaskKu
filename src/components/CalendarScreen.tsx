"use client";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Task } from "@/lib/types";
import { FONT_HEADING, FONT } from "@/lib/types";
import { todayISO, formatDate } from "@/lib/utils";
import { TaskCard } from "@/components/TaskCard";

export function CalendarScreen({
  tasks,
  onToggle,
  onDelete,
  onDetail,
}: {
  tasks: Task[];
  onToggle: (t: Task) => void;
  onDelete: (t: Task) => void;
  onDetail: (t: Task) => void;
}) {
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState(todayISO());
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(
      `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    );
  }
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      if (!t.done) map[t.dueDate] = (map[t.dueDate] ?? 0) + 1;
    });
    return map;
  }, [tasks]);
  const dayTasks = tasks.filter((t) => t.dueDate === selected);
  const monthLabel = month.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      {/* Calendar grid */}
      <div className="card" style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <button
            onClick={() => setMonth(new Date(year, m - 1, 1))}
            style={{
              padding: 6,
              cursor: "pointer",
              background: "var(--hover-bg)",
              border: "none",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              color: "var(--foreground-muted)",
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              fontFamily: FONT_HEADING,
              color: "var(--foreground)",
              textTransform: "capitalize" as const,
            }}
          >
            {monthLabel}
          </span>
          <button
            onClick={() => setMonth(new Date(year, m + 1, 1))}
            style={{
              padding: 6,
              cursor: "pointer",
              background: "var(--hover-bg)",
              border: "none",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              color: "var(--foreground-muted)",
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 2,
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d, i) => (
            <div
              key={`h-${i}`}
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "var(--foreground-subtle)",
                padding: 4,
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 2,
          }}
        >
          {cells.map((iso, idx) => {
            if (!iso) return <div key={`e-${idx}`} />;
            const isToday = iso === todayISO();
            const isSel = iso === selected;
            const count = counts[iso] ?? 0;
            return (
              <button
                key={iso}
                onClick={() => setSelected(iso)}
                style={{
                  aspectRatio: "1",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: isSel || isToday ? 700 : 500,
                  fontFamily: FONT,
                  background: isSel
                    ? "linear-gradient(135deg, #2563eb, #4f46e5)"
                    : isToday
                      ? "var(--notif-pill)"
                      : "transparent",
                  color: isSel
                    ? "white"
                    : isToday
                      ? "var(--notif-pill-text)"
                      : "var(--foreground-muted)",
                  transition: "all 0.15s ease",
                }}
              >
                {Number(iso.slice(8))}
                {count > 0 && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      marginTop: 2,
                      background: isSel ? "white" : "#3b82f6",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tasks for selected date */}
      <div>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            fontFamily: FONT_HEADING,
            color: "var(--foreground-muted)",
            marginBottom: 10,
            paddingLeft: 4,
          }}
        >
          Tugas pada {formatDate(selected)}
        </h3>
        {dayTasks.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "36px 20px",
              textAlign: "center",
              color: "var(--foreground-subtle)",
              borderStyle: "dashed",
            }}
          >
            <p style={{ fontSize: 13 }}>Tidak ada tugas pada tanggal ini.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {dayTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onToggle={onToggle}
                onDetail={onDetail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
