# Checklist Tugas Minggu 10

Tema: The Grand Launch - Final Release Cross-Testing, Quality Assurance, & Deployment

Dokumen ini merangkum bukti final release untuk aplikasi TaskKu.

## 1. Readiness Audit

- [x] Source produksi bersih dari `console.*` dan `debugger`.
- [x] `npm run lint` lulus tanpa warning.
- [x] `npm run build` lulus tanpa warning produksi.
- [x] Link publik `/login`, `/register`, fallback 404, dan recovery error memakai `next/link`.
- [x] Custom `src/app/not-found.tsx` mencegah dead-end untuk URL tidak dikenal.
- [x] Custom `src/app/error.tsx` menyediakan recovery action tanpa menampilkan detail error sensitif.

Evidence:
- `src/app/not-found.tsx`
- `src/app/error.tsx`
- `src/app/login/LoginForm.tsx`
- `src/app/register/RegisterForm.tsx`

## 2. Performance & UX

- [x] Optimistic UI tersedia untuk toggle dan delete task.
- [x] Rollback/feedback error muncul lewat toast jika Server Action gagal.
- [x] Skeleton route tersedia di `src/app/dashboard/loading.tsx`.
- [x] Search memakai URL state dan sekarang membersihkan URL tanpa trailing `?` saat query kosong.
- [x] Fallback localStorage dipisah per user untuk browser yang dipakai bergantian.
- [x] Tombol FAB, filter, bottom navigation, search, dan checkbox task punya label/pressed state aksesibel.
- [x] Layout memakai `min-height: 100dvh`, safe-area bottom nav, dan container 320px+ mobile-first.

Evidence:
- `src/components/TaskKuApp.tsx`
- `src/components/TaskCard.tsx`
- `src/app/dashboard/loading.tsx`
- `src/app/globals.css`

## 3. Naughty User QA

- [x] User tanpa session ke `/dashboard` diarahkan ke `/login` oleh `src/proxy.ts` dan double-check server page.
- [x] URL tidak dikenal menampilkan 404 yang punya jalan kembali ke dashboard/login.
- [x] Task kosong/spasi ditolak oleh Zod `.trim()` validation.
- [x] Tanggal mustahil seperti `2026-02-31` ditolak oleh validasi ISO date.
- [x] Task mutation di Supabase discoping ke email dari HttpOnly session cookie.
- [x] Local fallback tidak saling bercampur antar email akun.

Evidence:
- `src/proxy.ts`
- `src/lib/schemas.ts`
- `src/lib/actions/task-actions.ts`
- `src/components/TaskKuApp.tsx`

## 4. Infrastructure & Deployment

- [x] Edge request guard memakai Next.js 16 `proxy.ts`.
- [x] Supabase JS client singleton dipakai ulang; production database pooling diarahkan ke Supabase Pooler/Vercel environment.
- [x] Automated CI/CD tersedia melalui GitHub Actions release quality gate.
- [x] Build tetap aman saat Supabase env belum diisi karena aplikasi fallback ke localStorage.

Evidence:
- `src/proxy.ts`
- `src/lib/supabase.ts`
- `.github/workflows/release.yml`
- `README.md`

## Final Verification

Jalankan sebelum deploy:

```bash
npm run lint
npm run build
```


Runtime smoke test lokal (`next start --port 3100`):

| Route | Expected | Result |
|-------|----------|--------|
| `/login` | Public page loads | `200` |
| `/register` | Public page loads | `200` |
| `/dashboard` tanpa session | Protected redirect | `307 -> /login` |
| `/` tanpa session | Auth-aware redirect | `307 -> /login` |
| `/not-real` | Custom not found path | `404` |

Target deploy:
- Vercel project connected to GitHub repository.
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Supabase schema: `tasks.user_email` indexed and `users.email` unique.
