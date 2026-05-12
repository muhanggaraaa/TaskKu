"use client";
import { LogOut } from "lucide-react";
import { FONT_HEADING } from "@/lib/types";
import { logoutAction } from "@/lib/actions/auth-actions";

function Stat({
  label,
  val,
  color,
  bg,
}: {
  label: string;
  val: number;
  color: string;
  bg: string;
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: "14px 12px",
        textAlign: "center",
        background: bg,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color,
          fontFamily: FONT_HEADING,
        }}
      >
        {val}
      </div>
      <div
        style={{
          marginTop: 2,
          fontSize: 10,
          fontWeight: 600,
          color,
          textTransform: "uppercase" as const,
          letterSpacing: "0.03em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function ProfileScreen({
  user,
  stats,
}: {
  user: string;
  stats: { total: number; done: number; overdue: number; today: number };
}) {
  const completion = stats.total
    ? Math.round((stats.done / stats.total) * 100)
    : 0;
  return (
    <div
      className="animate-fade-in stagger-children"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      {/* Avatar card */}
      <div
        className="card"
        style={{ padding: "28px 20px", textAlign: "center" }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            margin: "0 auto",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb 0%, #6366f1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 28,
            fontWeight: 800,
            fontFamily: FONT_HEADING,
            boxShadow: "0 6px 24px rgba(37,99,235,0.25)",
          }}
        >
          {user.charAt(0).toUpperCase()}
        </div>
        <h3
          style={{
            marginTop: 14,
            fontSize: 18,
            fontWeight: 800,
            fontFamily: FONT_HEADING,
            color: "var(--foreground)",
          }}
        >
          {user}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "var(--foreground-subtle)",
            marginTop: 2,
          }}
        >
          Pengguna TaskKu
        </p>
      </div>

      {/* Progress card */}
      <div className="card" style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--foreground-muted)",
            }}
          >
            Progress Keseluruhan
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              fontFamily: FONT_HEADING,
              color: "#2563eb",
            }}
          >
            {completion}%
          </span>
        </div>
        <div
          style={{
            height: 8,
            background: "var(--hover-bg)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 20,
              transition: "width 0.5s ease",
              background: "linear-gradient(90deg, #2563eb, #6366f1)",
              width: `${completion}%`,
            }}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginTop: 16,
          }}
        >
          <Stat
            label="Total"
            val={stats.total}
            color="#2563EB"
            bg="rgba(37, 99, 235, 0.10)"
          />
          <Stat
            label="Selesai"
            val={stats.done}
            color="#10B981"
            bg="rgba(16, 185, 129, 0.10)"
          />
          <Stat
            label="Overdue"
            val={stats.overdue}
            color="#EF4444"
            bg="rgba(239, 68, 68, 0.10)"
          />
        </div>
      </div>

      {/* About card */}
      <div className="card" style={{ padding: "20px" }}>
        <h4
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--foreground-muted)",
            marginBottom: 8,
          }}
        >
          Tentang TaskKu
        </h4>
        <p
          style={{
            fontSize: 12,
            color: "var(--foreground-muted)",
            lineHeight: 1.7,
          }}
        >
          Aplikasi manajemen tugas yang menerapkan{" "}
          <strong style={{ color: "var(--foreground)" }}>
            Professional Upgrade
          </strong>
          : proteksi rute dengan{" "}
          <strong style={{ color: "var(--foreground)" }}>Proxy</strong>,
          validasi data dengan{" "}
          <strong style={{ color: "var(--foreground)" }}>Zod</strong>,
          pencarian persisten via{" "}
          <strong style={{ color: "var(--foreground)" }}>URL as State</strong>,
          dan{" "}
          <strong style={{ color: "var(--foreground)" }}>Optimistic UI</strong>{" "}
          untuk UX yang responsif.
        </p>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}
        >
          {[
            "Proxy (Middleware)",
            "Zod Validation",
            "URL as State",
            "Optimistic UI",
            "Task Detail",
            "Edit Task",
            "Supabase DB",
          ].map((tag) => (
            <span
              key={tag}
              style={{
                padding: "4px 10px",
                background: "var(--notif-pill)",
                color: "var(--notif-pill-text)",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Logout via Server Action */}
      <form action={logoutAction}>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px 0",
            border: "2px solid #fecaca",
            borderRadius: 16,
            background: "var(--card-bg)",
            color: "#dc2626",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.15s ease",
          }}
        >
          <LogOut size={16} /> Keluar
        </button>
      </form>
    </div>
  );
}
