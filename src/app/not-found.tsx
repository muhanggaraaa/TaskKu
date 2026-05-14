import Link from "next/link";
import { CheckCircle2, Home, LogIn } from "lucide-react";
import { FONT, FONT_HEADING } from "@/lib/types";

export default function NotFound() {
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
            "radial-gradient(circle at 20% 10%, rgba(37,99,235,0.16), transparent 34%), var(--app-container-bg)",
        }}
      >
        <section
          className="card animate-scale-in"
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
              color: "var(--notif-pill-text)",
              background: "var(--notif-pill)",
            }}
          >
            <CheckCircle2 size={34} strokeWidth={2.4} />
          </div>
          <p
            style={{
              color: "var(--notif-pill-text)",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            404 / Rute Tidak Ditemukan
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
            Tidak ada dead-end di TaskKu.
          </h1>
          <p
            style={{
              color: "var(--foreground-muted)",
              fontSize: 13,
              lineHeight: 1.7,
              marginBottom: 22,
            }}
          >
            Link yang kamu buka tidak tersedia. Kembali ke dashboard jika sudah login,
            atau masuk ulang untuk melanjutkan.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Link href="/dashboard" className="btn-primary" style={{ textDecoration: "none" }}>
              <Home size={17} /> Dashboard
            </Link>
            <Link href="/login" className="btn-secondary" style={{ textDecoration: "none" }}>
              <LogIn size={17} /> Login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
