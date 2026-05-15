"use client";
import { AlertTriangle } from "lucide-react";
import { FONT_HEADING, FONT } from "@/lib/types";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Hapus",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="animate-fade-in-fast"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        padding: 20,
      }}
      onClick={onCancel}
    >
      <div
        className="animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--card-bg)",
          borderRadius: 24,
          padding: "28px 24px 24px",
          width: "100%",
          maxWidth: 340,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "rgba(239, 68, 68, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <AlertTriangle size={24} color="#EF4444" />
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: 17,
            fontWeight: 800,
            fontFamily: FONT_HEADING,
            color: "var(--foreground)",
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          {title}
        </h3>

        {/* Message */}
        <p
          style={{
            fontSize: 13,
            color: "var(--foreground-muted)",
            textAlign: "center",
            lineHeight: 1.5,
            fontFamily: FONT,
          }}
        >
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-secondary" onClick={onCancel}>
            Batal
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
