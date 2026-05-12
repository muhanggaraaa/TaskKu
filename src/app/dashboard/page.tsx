import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTasks } from "@/lib/actions/task-actions";
import { TaskKuApp } from "@/components/TaskKuApp";
import DashboardLoading from "./loading";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/login");
  }

  const user = session.value;
  const initialTasks = await getTasks();

  return (
    <Suspense fallback={<DashboardLoading />}>
      <TaskKuApp initialTasks={initialTasks} user={user} />
    </Suspense>
  );
}
