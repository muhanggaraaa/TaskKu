/**
 * Dashboard Page — Server Component
 *
 * Halaman utama yang dilindungi oleh proxy (sebelumnya middleware).
 * 1. Baca nama user dari session cookie
 * 2. Fetch tasks dari Supabase via Server Action
 * 3. Pass data ke TaskKuApp (Client Component)
 *
 * Suspense boundary dibutuhkan karena TaskKuApp menggunakan
 * useSearchParams() yang memerlukan boundary ini.
 */

import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTasks } from "@/lib/actions/task-actions";
import { TaskKuApp } from "@/components/TaskKuApp";
import DashboardLoading from "./loading";

export default async function DashboardPage() {
  // Baca session cookie (async di Next.js 16)
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  // Double-check: jika tidak ada session, redirect ke login
  if (!session) {
    redirect("/login");
  }

  const user = session.value;

  // Server-side data fetching via Server Action
  const initialTasks = await getTasks();

  return (
    <Suspense fallback={<DashboardLoading />}>
      <TaskKuApp initialTasks={initialTasks} user={user} />
    </Suspense>
  );
}
