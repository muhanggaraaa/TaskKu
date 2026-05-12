"use client";

/**
 * LoginForm — Client Component
 *
 * Form login dengan UI yang sama seperti sebelumnya.
 * Memanggil loginAction (Server Action) untuk set session cookie.
 */

import { useState, useTransition } from "react";
import { Check, LogIn, Sparkles, Loader2 } from "lucide-react";
import { FONT, FONT_HEADING } from "@/lib/types";
import { loginAction } from "@/lib/actions/auth-actions";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(undefined, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div
      style={{ fontFamily: FONT, minHeight: "100dvh", background: "#e2e8f0" }}
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

        {/* Top section — branding */}
        <div
          style={{
            flex: "0 0 auto",
            padding: "48px 24px 36px",
            textAlign: "center",
            color: "white",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            className="animate-float"
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              margin: "0 auto 16px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            <Check size={28} color="white" strokeWidth={3} />
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              fontFamily: FONT_HEADING,
              letterSpacing: "-0.02em",
            }}
          >
            TaskKu
          </h1>
          <p
            style={{
              fontSize: 13,
              opacity: 0.75,
              marginTop: 6,
              fontWeight: 400,
            }}
          >
            Atur Tugasmu, Raih Nilaimu
          </p>
        </div>

        {/* Bottom section — white card form */}
        <div
          className="animate-slide-up"
          style={{
            flex: 1,
            background: "#f8fafc",
            borderRadius: "28px 28px 0 0",
            padding: "32px 24px 40px",
            position: "relative",
            zIndex: 1,
            boxShadow: "0 -4px 30px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              fontFamily: FONT_HEADING,
              color: "#0f172a",
              marginBottom: 4,
            }}
          >
            Selamat Datang!
          </h2>
          <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
            Masuk untuk mengelola tugasmu
          </p>

          {/* Error message */}
          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 12,
                color: "#dc2626",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#475569",
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
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input-field"
                disabled={pending}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: 4 }}
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Masuk…
                </>
              ) : (
                <>
                  <LogIn size={18} /> Masuk
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: 24,
              display: "flex",
              justifyContent: "center",
              gap: 16,
              fontSize: 11,
              color: "#94a3b8",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Check size={10} /> TaskKu
            </span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Sparkles size={10} /> Professional Upgrade
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
