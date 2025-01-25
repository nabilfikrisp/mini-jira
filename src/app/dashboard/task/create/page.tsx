import { getUser } from "@/lib/data-access-layer";
import { redirect } from "next/navigation";
import CreateTaskForm from "./form";
import { getAllUsersDTO } from "@/lib/data-transfer-object";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

export default async function CreateTaskPage() {
  const user = await getUser();
  const users = await getAllUsersDTO();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "LEAD") {
    redirect("/dashboard");
  }

  return (
    <div className="p-5">
      <Link
        href="/dashboard"
        className="flex w-fit items-center rounded-md border border-my-accent-one px-4 py-2 text-sm font-medium text-my-paragraph hover:text-my-accent-one"
      >
        <ChevronLeftIcon size={16} className="mr-1 inline-block" />
        Back to Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-my-paragraph">Create Task</h1>
      <div className="mt-4">
        <CreateTaskForm users={users} />
      </div>
    </div>
  );
}
