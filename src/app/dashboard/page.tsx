import DashboardFilter from "@/components/dashboard-filter";
import DashboardTasks from "@/components/dashboard-tasks";
import { getUser } from "@/lib/data-access-layer";
import { getAllTaskDTO } from "@/lib/data-transfer-object";
import { PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUser();
  const tasks = await getAllTaskDTO();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-full flex-col p-5 pb-3">
      <Header />
      <DashboardTasks tasks={tasks} user={user} />
    </div>
  );
}

async function Header() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <DashboardFilter />
      <SearchBar />
      {user.role === "LEAD" && <CreateTask />}
    </div>
  );
}

async function SearchBar() {
  return (
    <div className="flex-1">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg border border-my-paragraph bg-my-bg px-10 py-2 text-my-paragraph placeholder-my-paragraph/50 focus:border-my-accent-one focus:outline-none"
        />
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <SearchIcon className="h-5 w-5 text-my-paragraph" />
        </div>
      </div>
    </div>
  );
}

async function CreateTask() {
  return (
    <Link
      href="dashboard/task/create"
      className="flex items-center gap-2 rounded-lg bg-my-accent-one px-4 py-2 text-my-bg hover:bg-my-accent-one/90 focus:outline-none"
    >
      <PlusIcon className="h-5 w-5" />
      <span>Create Task</span>
    </Link>
  );
}
