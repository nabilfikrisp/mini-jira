"use client";

import { Task, TaskStatus, User } from "@/lib/types";
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

  return (
    <>
      <h2 className="mb-4 mt-4 text-2xl font-bold uppercase md:mt-8">
        {validFilter.replace("-", " ")}
      </h2>
      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        {columns.map((status) => (
          <div
            key={status}
            className="min-w-60 overflow-y-auto rounded-lg border border-my-paragraph p-4 shadow-sm xl:min-w-96"
          >
            <h3 className="mb-4 text-lg font-semibold capitalize text-my-headline">
              {status.replace("_", " ")}
            </h3>
            <div className="space-y-3">
              {groupedTasks[status].map((task) => (
                <div key={task.id} className="rounded-lg border border-my-accent-one p-3">
                  <h4 className="font-medium text-my-headline">{task.title}</h4>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
