/**
 * TaskKu — Home Page (Server Component)
 * 
 * Ini adalah Server Component yang:
 * 1. Fetch initial tasks dari Supabase via Server Action
 * 2. Pass data ke Client Component untuk interaktivitas
 * 
 * Server Component berjalan di server saat request,
 * sehingga data sudah siap sebelum dikirim ke browser.
 */

import { getTasks } from "./actions/task-actions";
import { TaskKuApp } from "./components/TaskKuApp";

export default async function HomePage() {
  // Server-side data fetching via Server Action
  const initialTasks = await getTasks();

  return <TaskKuApp initialTasks={initialTasks} />;
}
