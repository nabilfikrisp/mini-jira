"use client";

import { useActionState } from "react";
import { createTask } from "@/actions/task.action";
import { User } from "@/lib/types";

export default function CreateTaskForm({ users }: { users: User[] }) {
  const [state, formAction, isPending] = useActionState(createTask, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-my-headline">
          Title <span className="ml-1 text-my-accent-two">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
        {state?.errors?.title && (
          <p className="mt-2 text-sm text-my-accent-two">{state.errors.title.join(", ")}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-my-headline">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
        {state?.errors?.description && (
          <p className="mt-2 text-sm text-my-accent-two">{state.errors.description.join(", ")}</p>
        )}
      </div>

      {/* Assigned To Field */}
      <div>
        <label htmlFor="assignedTo" className="block text-sm font-medium text-my-headline">
          Assigned To
        </label>
        <select
          id="assignedTo"
          name="assignedTo"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        {state?.errors?.assignedTo && (
          <p className="mt-2 text-sm text-my-accent-two">{state.errors.assignedTo.join(", ")}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-my-accent-one px-4 py-2 text-my-bg hover:bg-my-accent-one/80 disabled:cursor-none disabled:bg-my-accent-one/60"
      >
        {isPending ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
