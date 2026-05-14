# Checklist Tugas Minggu 9

Tema: The Professional Upgrade: Refinement & Fortification

Dokumen ini merangkum bukti implementasi Tugas Minggu 9 untuk aplikasi TaskKu.

## Task 1: Keamanan Route

- [x] Menggunakan Next.js 16 `proxy.ts`, bukan `middleware.ts`.
- [x] Proxy membaca cookie `session` dengan `NextRequest`.
- [x] Route `/dashboard` dan sub-route dijaga oleh `config.matcher`.
- [x] User tanpa session diarahkan ke `/login`.
- [x] Route `/` diarahkan ke `/dashboard` jika sudah login, atau `/login` jika belum.

Evidence:
- `src/proxy.ts`
- `src/app/dashboard/page.tsx`
- `src/lib/session.ts`

## Task 2: Integritas Data

- [x] Zod terpasang sebagai dependency project.
- [x] Schema `TaskFormSchema` memvalidasi title, description, due date, priority, dan category.
- [x] Server Action memakai `.safeParse()` sebelum create/update task.
- [x] Field error dikirim kembali ke UI.
- [x] Modal tambah/edit tugas menampilkan error di field yang relevan.

Evidence:
- `package.json`
- `src/lib/schemas.ts`
- `src/lib/actions/task-actions.ts`
- `src/components/AddTaskModal.tsx`
- `src/components/EditTaskModal.tsx`

## Task 3: URL Sebagai State

- [x] Search bar membaca query `search` dari URL.
- [x] `useSearchParams`, `usePathname`, dan `useRouter` dipakai di client component.
- [x] `router.replace()` memperbarui URL tanpa full reload.
- [x] Query pencarian tetap aktif setelah refresh.
- [x] Data tugas difilter dari nilai query URL.

Evidence:
- `src/components/TaskKuApp.tsx`

## Task 4: Kecepatan UX

- [x] `src/app/dashboard/loading.tsx` menyediakan skeleton UI.
- [x] `useOptimistic` dipakai untuk toggle dan delete.
- [x] `startTransition` membungkus optimistic update.
- [x] UI berubah instan ketika user toggle/hapus task.
- [x] State aktual hanya dikomit setelah Server Action berhasil.

Evidence:
- `src/app/dashboard/loading.tsx`
- `src/components/TaskKuApp.tsx`
- `src/lib/actions/task-actions.ts`

## Definition of Done

- [x] Dashboard tidak bisa diakses tanpa login.
- [x] Form menolak input salah dengan pesan error jelas.
- [x] Pencarian persisten di URL.
- [x] Toggle dan delete memiliki optimistic feedback.
- [x] Skeleton loading tersedia saat route dashboard memuat.
- [x] `npm run lint` lulus tanpa warning.
- [x] `npm run build` lulus untuk production release.
