"use client";

import { deleteTask, updateTask } from "@/actions/task.action";
import { TaskStatusEnum } from "@/db/schema";
import { Task, User } from "@/lib/types";
import { SaveIcon, Trash2Icon } from "lucide-react";
import { useActionState } from "react";

export default function TaskDetailForm({
  task: initialTask,
  users,
  user,
}: {
  task: Task;
  users: User[];
  user: User;
}) {
  const [state, formAction, isPending] = useActionState(updateTask, undefined);

  const isTeamRole = user.role === "TEAM";

  async function handleDelete() {
    const isConfirmed = window.confirm("Are you sure you want to delete this?");
    if (!isConfirmed) return;

    await deleteTask(initialTask.id);
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize text-my-paragraph">
          {initialTask.title} Detail #{initialTask.id}
        </h1>
      </div>
      <form action={formAction} className="space-y-4">
        {/* Error Message */}
        {state?.message && <p className="text text-my-accent-two">{state.message}</p>}

        <input type="hidden" name="taskId" value={initialTask.id} />

        {/* Title Field (Disabled for Team Role) */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-my-paragraph">
            Title <span className="ml-1 text-my-accent-two">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={initialTask.title}
            className={`mt-1 w-full rounded-md border border-my-paragraph bg-my-bg p-2 text-my-paragraph focus:border-my-accent-one focus:outline-none ${isTeamRole && "hidden"}`}
          />
          {isTeamRole && <p className="mt-1 text-xl text-my-paragraph">{initialTask.title}</p>}
          {state?.errors?.title && (
            <p className="mt-2 text-sm text-my-accent-two">{state.errors.title.join(", ")}</p>
          )}
        </div>

        {/* Status Field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-my-headline">
            Status
          </label>
          <select
            id="status"
            name="status"
            className={`mt-1 block w-full rounded-md border border-my-paragraph p-2`}
            defaultValue={initialTask.status}
          >
            {TaskStatusEnum.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")} {status === initialTask.status ? "(Current)" : ""}
              </option>
            ))}
          </select>
          {state?.errors?.status && (
            <p className="mt-2 text-sm text-my-accent-two">{state.errors.status.join(", ")}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-my-paragraph">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={initialTask.description || ""}
            className="mt-1 w-full rounded-md border border-my-paragraph bg-my-bg p-2 text-my-paragraph focus:border-my-accent-one focus:outline-none"
            rows={4}
          />
          {state?.errors?.description && (
            <p className="mt-2 text-sm text-my-accent-two">{state.errors.description.join(", ")}</p>
          )}
        </div>

        {/* Assigned To Field (Disabled for Team Role) */}
        <div>
          <label htmlFor="assignedTo" className="block text-sm font-medium text-my-headline">
            Assigned To
          </label>
          <select
            id="assignedTo"
            name="assignedTo"
            className={`mt-1 block w-full rounded-md border border-my-paragraph p-2 disabled:opacity-50 ${isTeamRole && "hidden"}`}
            defaultValue={initialTask.assignedTo || ""}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          {isTeamRole && (
            <p className="mt-1 text-xl text-my-paragraph">
              {initialTask.assignedTo
                ? users.find((u) => u.id === initialTask.assignedTo)?.username
                : "Unassigned"}
            </p>
          )}
          {state?.errors?.assignedTo && (
            <p className="mt-2 text-sm text-my-accent-two">{state.errors.assignedTo.join(", ")}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center rounded-md bg-my-accent-one px-4 py-2 text-sm font-medium text-my-bg hover:bg-my-accent-one/90 disabled:bg-my-accent-one/60"
          >
            <SaveIcon size={16} className="mr-1" />
            {isPending ? "Saving..." : "Save Changes"}
          </button>
          {!isTeamRole && (
            <button
              type="button"
              className="flex items-center rounded-md bg-my-accent-two px-4 py-2 text-sm font-medium text-my-bg hover:bg-my-accent-two/90 disabled:bg-my-accent-two/60"
              onClick={handleDelete}
            >
              <Trash2Icon size={16} className="mr-1" />
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
