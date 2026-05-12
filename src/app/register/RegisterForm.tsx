"use client";

/**
 * RegisterForm — Client Component
 *
 * Form registrasi akun baru dengan validasi sisi server.
 */

import Link from "next/link";
import { useState, useTransition } from "react";
import { Check, UserPlus, Sparkles, Loader2, Moon, Sun } from "lucide-react";
import { FONT, FONT_HEADING } from "@/lib/types";
import { registerAction } from "@/lib/actions/auth-actions";
import { useTheme } from "@/lib/useTheme";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { theme, toggleTheme, mounted: themeMounted } = useTheme();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await registerAction(undefined, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div
      style={{
        fontFamily: FONT,
        minHeight: "100dvh",
        background: "var(--background-elevated)",
      }}
    >
      <div
        className="app-container"
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #1e40af 0%, #4338ca 50%, #6366f1 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 120,
            left: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: 40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />

        {/* Theme toggle (top-right) */}
        <button
          type="button"
          aria-label={
            theme === "dark"
              ? "Beralih ke mode terang"
              : "Beralih ke mode gelap"
          }
          aria-pressed={theme === "dark"}
          onClick={toggleTheme}
          className="glass"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 38,
            height: 38,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            border: "none",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          {themeMounted && theme === "dark" ? (
            <Sun size={16} />
          ) : (
            <Moon size={16} />
          )}
        </button>

        {/* Top section — branding */}
        <div
          style={{
            flex: "0 0 auto",
            padding: "40px 24px 24px",
            textAlign: "center",
            color: "white",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            className="animate-float"
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              margin: "0 auto 12px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            <Check size={24} color="white" strokeWidth={3} />
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              fontFamily: FONT_HEADING,
              letterSpacing: "-0.02em",
            }}
          >
            Daftar Akun TaskKu
          </h1>
          <p
            style={{
              fontSize: 12,
              opacity: 0.75,
              marginTop: 4,
              fontWeight: 400,
            }}
          >
            Buat akun baru untuk mulai mengatur tugasmu
          </p>
        </div>

        {/* Bottom section — card form (theme-aware) */}
        <div
          className="animate-slide-up"
          style={{
            flex: 1,
            background: "var(--card-bg)",
            color: "var(--foreground)",
            borderRadius: "28px 28px 0 0",
            padding: "28px 24px 32px",
            position: "relative",
            zIndex: 1,
            boxShadow: "0 -4px 30px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              fontFamily: FONT_HEADING,
              color: "var(--foreground)",
              marginBottom: 4,
            }}
          >
            Buat Akun Baru
          </h2>
          <p style={{ fontSize: 12, color: "var(--foreground-subtle)", marginBottom: 20 }}>
            Lengkapi data berikut untuk mendaftar
          </p>

          {error && (
            <div
              role="alert"
              style={{
                padding: "10px 14px",
                background: "rgba(220, 38, 38, 0.10)",
                border: "1px solid rgba(220, 38, 38, 0.30)",
                borderRadius: 12,
                color: "#dc2626",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--foreground-muted)",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                placeholder="Nama kamu"
                className="input-field"
                disabled={pending}
                required
                minLength={2}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--foreground-muted)",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@kampus.ac.id"
                className="input-field"
                disabled={pending}
                required
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--foreground-muted)",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Minimal 6 karakter"
                className="input-field"
                disabled={pending}
                required
                minLength={6}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--foreground-muted)",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Konfirmasi Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Ulangi password"
                className="input-field"
                disabled={pending}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: 8 }}
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Mendaftar…
                </>
              ) : (
                <>
                  <UserPlus size={18} /> Daftar Sekarang
                </>
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: 16,
              textAlign: "center",
              fontSize: 13,
              color: "var(--foreground-muted)",
            }}
          >
            Sudah punya akun?{" "}
            <Link
              href="/login"
              style={{
                color: "var(--notif-pill-text)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Masuk di sini
            </Link>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: 20,
              display: "flex",
              justifyContent: "center",
              gap: 16,
              fontSize: 11,
              color: "var(--foreground-subtle)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Check size={10} /> TaskKu
            </span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Sparkles size={10} /> Professional Upgrade
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
