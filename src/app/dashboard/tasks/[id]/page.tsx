import { getAllUsersDTO, getTaskByIdDTO } from "@/lib/data-transfer-object";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import TaskDetailForm from "./form";
import { getUser } from "@/lib/data-access-layer";

type Params = Promise<{ id: string }>;

export default async function TaskDetailPage(props: { params: Params }) {
  const params = await props.params;
  const taskId = params.id;

  if (!taskId || isNaN(parseInt(taskId, 10))) {
    redirect("/dashboard");
  }

  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const task = await getTaskByIdDTO(parseInt(taskId, 10));
  const users = await getAllUsersDTO();

  // Handle task not found
  if (!task) {
    return (
      <div className="p-5">
        <Link
          href="/dashboard"
          className="flex w-fit items-center rounded-md border border-my-accent-one px-4 py-2 text-sm font-medium text-my-paragraph hover:bg-my-accent-one/10"
        >
          <ChevronLeftIcon size={16} className="mr-1 inline-block" />
          Back to Dashboard
        </Link>
        <p className="mt-4 text-my-paragraph">Task not found.</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="flex w-fit items-center rounded-md border border-my-accent-one px-4 py-2 text-sm font-medium text-my-paragraph hover:bg-my-accent-one/10"
      >
        <ChevronLeftIcon size={16} className="mr-1 inline-block" />
        Back to Dashboard
      </Link>

      {/* Task Details From */}
      <TaskDetailForm task={task} users={users} user={user} />
    </div>
  );
}
