"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { FONT, FONT_HEADING } from "@/lib/types";

export default function ErrorPage({
  unstable_retry,
}: {
  unstable_retry: () => void;
}) {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--background-elevated)",
        fontFamily: FONT,
      }}
    >
      <div
        className="app-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background:
            "radial-gradient(circle at 15% 15%, rgba(239,68,68,0.14), transparent 34%), var(--app-container-bg)",
        }}
      >
        <section
          className="card animate-scale-in"
          role="alert"
          style={{
            width: "100%",
            padding: "34px 24px",
            textAlign: "center",
          }}
        >
          <div
            aria-hidden
            style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              margin: "0 auto 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#dc2626",
              background: "rgba(220, 38, 38, 0.12)",
            }}
          >
            <AlertTriangle size={34} strokeWidth={2.4} />
          </div>
          <p
            style={{
              color: "#dc2626",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Recovery Mode
          </p>
          <h1
            style={{
              color: "var(--foreground)",
              fontFamily: FONT_HEADING,
              fontSize: 24,
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 10,
            }}
          >
            Ada gangguan sementara.
          </h1>
          <p
            style={{
              color: "var(--foreground-muted)",
              fontSize: 13,
              lineHeight: 1.7,
              marginBottom: 22,
            }}
          >
            Data tugas tetap aman. Coba muat ulang segmen ini, atau kembali ke
            dashboard untuk memulai ulang alur.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button type="button" onClick={unstable_retry} className="btn-primary">
              <RotateCcw size={17} /> Coba Lagi
            </button>
            <Link href="/dashboard" className="btn-secondary" style={{ textDecoration: "none" }}>
              <Home size={17} /> Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
