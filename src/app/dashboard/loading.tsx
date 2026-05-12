/**
 * Dashboard Loading — Skeleton UI
 * 
 * File loading.tsx ditampilkan secara otomatis oleh Next.js
 * saat transisi ke route /dashboard menggunakan React Suspense.
 * 
 * Skeleton ini menyerupai layout dashboard asli untuk
 * memberikan feedback instan kepada pengguna.
 */

export default function DashboardLoading() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100dvh", background: "#f1f5f9" }}>
      <div className="app-container">
        {/* Header Skeleton */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e40af 0%, #4338ca 50%, #6366f1 100%)",
            padding: "20px 20px 28px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top bar skeleton */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="skeleton-pulse" style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.12)" }} />
              <div>
                <div className="skeleton-pulse" style={{ width: 40, height: 10, borderRadius: 4, background: "rgba(255,255,255,0.12)", marginBottom: 6 }} />
                <div className="skeleton-pulse" style={{ width: 100, height: 14, borderRadius: 4, background: "rgba(255,255,255,0.15)" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div className="skeleton-pulse" style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.1)" }} />
              <div className="skeleton-pulse" style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.1)" }} />
            </div>
          </div>

          {/* Title skeleton */}
          <div className="skeleton-pulse" style={{ width: "70%", height: 20, borderRadius: 6, background: "rgba(255,255,255,0.12)", marginTop: 20 }} />

          {/* Stats skeleton */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 16 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ borderRadius: 16, padding: "12px 10px", background: "rgba(255,255,255,0.08)" }}>
                <div className="skeleton-pulse" style={{ width: 50, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", marginBottom: 8 }} />
                <div className="skeleton-pulse" style={{ width: 30, height: 22, borderRadius: 4, background: "rgba(255,255,255,0.15)" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div style={{ padding: "0 16px", marginTop: -12, paddingBottom: 100, position: "relative", zIndex: 2 }}>
          {/* Search bar skeleton */}
          <div
            className="card"
            style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}
          >
            <div className="skeleton-pulse" style={{ width: 16, height: 16, borderRadius: 4, background: "#e2e8f0" }} />
            <div className="skeleton-pulse" style={{ flex: 1, height: 14, borderRadius: 4, background: "#e2e8f0" }} />
          </div>

          {/* Section title skeleton */}
          <div className="skeleton-pulse" style={{ width: 100, height: 12, borderRadius: 4, background: "#e2e8f0", marginBottom: 10, marginLeft: 4 }} />

          {/* Task card skeletons */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "14px 16px",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 10,
              }}
            >
              {/* Checkbox skeleton */}
              <div className="skeleton-pulse" style={{ width: 24, height: 24, borderRadius: 8, background: "#e2e8f0", flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                {/* Title */}
                <div className="skeleton-pulse" style={{ width: `${70 - i * 10}%`, height: 14, borderRadius: 4, background: "#e2e8f0", marginBottom: 8 }} />
                {/* Description */}
                <div className="skeleton-pulse" style={{ width: "90%", height: 10, borderRadius: 4, background: "#f1f5f9", marginBottom: 10 }} />
                {/* Tags */}
                <div style={{ display: "flex", gap: 6 }}>
                  <div className="skeleton-pulse" style={{ width: 60, height: 18, borderRadius: 20, background: "#f1f5f9" }} />
                  <div className="skeleton-pulse" style={{ width: 50, height: 18, borderRadius: 20, background: "#f1f5f9" }} />
                  <div className="skeleton-pulse" style={{ width: 80, height: 18, borderRadius: 20, background: "#f1f5f9" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skeleton-pulse {
          animation: skeletonPulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
