"use client";

import { Task, TaskStatus, User } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function DashboardTasks({ tasks, user }: { tasks: Task[]; user: User }) {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const validFilter = filter === "my-task" ? "my-task" : "all-task";

  const filteredTasks =
    validFilter === "my-task" ? tasks.filter((task) => task.assignedTo === user.id) : tasks;

  // Group tasks by status
  const groupedTasks: Record<TaskStatus, Task[]> = {
    NOT_STARTED: [],
    ON_PROGRESS: [],
    DONE: [],
    REJECT: [],
  };

  filteredTasks.forEach((task) => {
    groupedTasks[task.status].push(task);
  });

  const columns: TaskStatus[] = ["NOT_STARTED", "ON_PROGRESS", "DONE", "REJECT"];

  const statusColors: Record<TaskStatus, string> = {
    NOT_STARTED: "bg-my-paragraph/75",
    ON_PROGRESS: "bg-my-accent-blue",
    DONE: "bg-my-accent-green",
    REJECT: "bg-my-accent-two",
  };

  const statusHeaderColors: Record<TaskStatus, string> = {
    NOT_STARTED: "text-my-paragraph",
    ON_PROGRESS: "text-my-accent-blue",
    DONE: "text-my-accent-green",
    REJECT: "text-my-accent-two",
  };

  return (
    <>
      <h2 className="mb-4 mt-4 text-2xl font-bold uppercase md:mt-8">
        {validFilter.replace("-", " ")}
      </h2>
      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        {columns.map((status) => (
          <div
            key={status}
            className="min-w-60 flex-1 overflow-y-auto rounded-lg border border-my-paragraph p-4 shadow-sm"
          >
            <h3 className={`mb-4 text-lg font-semibold capitalize ${statusHeaderColors[status]}`}>
              {status.replace("_", " ")}
            </h3>
            <div className="flex flex-col gap-2">
              {groupedTasks[status].map((task) => (
                <Link href={`/dashboard/tasks/${task.id}`} key={task.id}>
                  <div
                    className={`rounded-lg border p-3 transition-all hover:translate-x-1 ${statusColors[status]}`}
                  >
                    <h4 className="font-medium text-my-bg">{task.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
