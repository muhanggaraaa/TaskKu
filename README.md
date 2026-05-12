# ✅ TaskKu — Atur Tugasmu, Raih Nilaimu

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1?logo=zod&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

**Aplikasi manajemen tugas mobile-first berbasis Next.js App Router**

</div>

---

## 📖 Tentang

TaskKu adalah aplikasi manajemen tugas interaktif yang dibangun sebagai project kuliah **Next.js Masterclass — "From Code to Product"**. Aplikasi ini mendemonstrasikan implementasi fitur-fitur produksi nyata:

- 🔒 **Proteksi rute** dengan Proxy (Middleware)
- 🛡️ **Validasi data** dengan Zod schema
- 🔗 **URL as State** untuk pencarian persisten
- ⚡ **Optimistic UI** untuk pengalaman instan
- 💀 **Skeleton Loading** saat transisi rute
- ☁️ **Supabase** sebagai backend database

---

## 🚀 Fitur Utama

### 🔐 Keamanan (Proxy)
- Rute `/dashboard` dilindungi — tidak bisa diakses tanpa login
- Session berbasis **HttpOnly cookie** (aman dari XSS)
- Auto-redirect: `/` → `/dashboard` (jika login) atau `/login` (jika belum)

### 🛡️ Validasi Data (Zod)
- Schema validasi di **Server Action** dengan `.safeParse()`
- Error ditampilkan **per-field** langsung di bawah input yang bermasalah
- Validasi: judul wajib, max 120 karakter, deskripsi max 500, format tanggal, priority enum

### 🔍 Pencarian via URL
- Search bar menggunakan `useSearchParams` + `usePathname`
- URL berubah real-time saat mengetik (`/dashboard?search=xxx`)
- Hasil pencarian **tetap ada** setelah refresh halaman
- Client-side navigation tanpa reload penuh

### ⚡ Optimistic UI & Loading
- **`useOptimistic`** — toggle & hapus tugas terasa instan
- **`loading.tsx`** — Skeleton UI otomatis saat berpindah rute
- **`startTransition`** — integrasi proper dengan React 19 concurrent features
- Toast notification untuk feedback aksi

### 📱 Mobile-First Design
- UI mirip aplikasi native dengan bottom navigation
- Glassmorphism header + gradient design
- Animasi staggered untuk list items
- Floating Action Button (FAB)
- Responsive — tampil optimal di mobile dan desktop

---

## 🏗️ Tech Stack

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **Next.js** | 16.2.4 | Framework React (App Router) |
| **React** | 19.2.4 | UI Library |
| **TypeScript** | 5.x | Type safety |
| **Supabase** | 2.x | Backend database (PostgreSQL) |
| **Zod** | 4.x | Schema validation |
| **Tailwind CSS** | 4.x | Utility-first CSS |
| **Sonner** | 2.x | Toast notifications |
| **Lucide React** | 1.x | Icon library |
| **date-fns** | 4.x | Date utilities |

---

## 📂 Struktur Project

```
src/
├── app/                          # Next.js App Router
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard page (Server Component)
│   │   └── loading.tsx           # Skeleton UI (auto Suspense)
│   ├── login/
│   │   ├── page.tsx              # Login page (Server Component)
│   │   └── LoginForm.tsx         # Login form (Client Component)
│   ├── layout.tsx                # Root layout + metadata + Toaster
│   ├── page.tsx                  # Root redirect (handled by proxy)
│   └── globals.css               # Design system + animations
│
├── components/                   # Shared UI Components
│   ├── TaskKuApp.tsx             # Main app shell (Client Component)
│   ├── TaskCard.tsx              # Task item card
│   ├── AddTaskModal.tsx          # Bottom sheet form + Zod validation
│   ├── CalendarScreen.tsx        # Calendar view
│   └── ProfileScreen.tsx         # User profile + stats
│
├── lib/                          # Shared utilities & logic
│   ├── actions/
│   │   ├── auth-actions.ts       # Server Actions: login, logout
│   │   └── task-actions.ts       # Server Actions: CRUD tasks
│   ├── schemas.ts                # Zod validation schemas
│   ├── supabase.ts               # Supabase client + transformers
│   ├── types.ts                  # TypeScript types & constants
│   └── utils.ts                  # Helper functions
│
└── proxy.ts                      # Route protection (auth check)
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** 18.17+ 
- **npm** atau **pnpm**

### 1. Clone & Install

```bash
git clone https://github.com/muhanggaraaa/TaskKu.git
cd TaskKu
npm install
```

### 2. Setup Environment

Buat file `.env.local` di root project:

```env
# Supabase Configuration
# Dapatkan dari: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **💡 Tanpa Supabase?** Aplikasi tetap berjalan — data disimpan di `localStorage` browser.

### 3. Setup Database (Supabase)

Jalankan SQL berikut di Supabase SQL Editor:

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  duedate TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (opsional)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: allow all operations (untuk development)
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true);
```

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — akan redirect ke halaman login.

### 5. Build Production

```bash
npm run build
npm start
```

---

## 📋 Tugas Minggu 9 — Checklist

> **Tema:** *The Professional Upgrade: Refinement & Fortification*

### Task 1: Keamanan (Proxy / Middleware) ✅
- [x] File `proxy.ts` di root `src/`
- [x] Cek session cookie dengan `NextResponse`
- [x] `config.matcher` untuk `/dashboard/:path*`
- [x] Redirect ke `/login` jika tidak ada cookie

### Task 2: Integritas Data (Zod Validation) ✅
- [x] Library Zod terinstall (`zod@^4.4.3`)
- [x] Schema validasi di Server Action (`TaskFormSchema`)
- [x] Metode `.safeParse()` untuk memvalidasi input
- [x] Field errors ditampilkan di bawah input yang relevan

### Task 3: URL Sebagai State ✅
- [x] Search Bar di halaman daftar tugas
- [x] Hook `useSearchParams` & `usePathname`
- [x] `router.replace()` tanpa reload halaman
- [x] Filter data Supabase dari parameter URL

### Task 4: Kecepatan UX (Optimistic UI & Loading) ✅
- [x] `loading.tsx` di folder dashboard (Skeleton UI)
- [x] Hook `useOptimistic` untuk toggle & delete
- [x] UI berubah instan sebelum Server Action selesai
- [x] `startTransition` wrapper (React 19 best practice)

### Definition of Done ✅
- [x] Dashboard tidak bisa diakses tanpa login
- [x] Form menolak format salah dengan pesan error jelas
- [x] Hasil pencarian tetap ada di URL saat di-refresh
- [x] Hapus/update terasa instan (Optimistic UI)
- [x] Skeleton Loading aktif saat transisi antar rute

---

## 🖼️ Screenshots

### Login Page
Halaman login dengan gradient design dan form validation.

### Dashboard
Dashboard utama dengan statistik, search bar, dan daftar tugas.

### Add Task Modal
Bottom sheet form dengan Zod validation dan priority selector.

### Calendar View
Kalender interaktif dengan indikator tugas per tanggal.

### Profile
Profil pengguna dengan progress bar dan statistik.

---

## 📚 Konsep yang Diterapkan

| Konsep | Implementasi |
|--------|-------------|
| **Server Components** | `dashboard/page.tsx`, `login/page.tsx` |
| **Client Components** | `TaskKuApp.tsx`, `LoginForm.tsx`, semua komponen interaktif |
| **Server Actions** | `auth-actions.ts`, `task-actions.ts` (`"use server"`) |
| **Proxy (Middleware)** | `proxy.ts` — proteksi rute via cookie check |
| **Zod Validation** | `schemas.ts` — `TaskFormSchema.safeParse()` |
| **useOptimistic** | Toggle & delete task dengan feedback instan |
| **useSearchParams** | Pencarian persisten via URL query params |
| **Suspense / Loading** | `loading.tsx` — skeleton UI otomatis |
| **Cookie Auth** | HttpOnly session cookie via Server Action |

---

## 👥 Tim Pengembang

| Nama | GitHub |
|------|--------|
| **Hamzah Permata Putra** | [@nacht24](https://github.com/nacht24) |
| **Muhamad Anggara Ramadhan** | [@muhanggaraaa](https://github.com/muhanggaraaa) |
| **Murfid Muhyiddin** | [@Murfid-m](https://github.com/Murfid-m) |

kELOMPOK 5 BEGINNER

---

<div align="center">

*"Kode lebih sering dibaca daripada ditulis,*
*namun produk lebih sering digunakan daripada dikodekan."*

— Next.js Masterclass Philosophy

</div>
