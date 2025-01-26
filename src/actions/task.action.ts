"use server";

import { getUser } from "@/lib/data-access-layer";
import {
  createTaskDTO,
  createTaskLogDTO,
  deleteTaskDTO,
  getTaskByIdDTO,
  updateTaskDTO,
} from "@/lib/data-transfer-object";
import { CreateTaskFormSchema, UpdateTaskFormSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTask(prevState: unknown, formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }
  if (user.role !== "LEAD") {
    return null;
  }

  const validatedFields = CreateTaskFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    assignedTo: formData.get("assignedTo"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, description, assignedTo } = validatedFields.data;

  const newTask = await createTaskDTO({
    createdBy: user.id,
    title,
    description,
    assignedTo: assignedTo,
  });

  if (!newTask) {
    return {
      message: "Error creating task",
    };
  }

  await createTaskLogDTO({
    taskId: newTask.id,
    changedBy: user.id,
    logType: "CREATE",
    oldStatus: {},
    newStatus: {
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      assignedTo: newTask.assignedTo,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateTask(prevState: unknown, formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const validatedFields = UpdateTaskFormSchema.safeParse({
    taskId: formData.get("taskId"),
    title: formData.get("title"),
    description: formData.get("description"),
    assignedTo: formData.get("assignedTo"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { taskId, title, description, assignedTo, status } = validatedFields.data;

  const currentTask = await getTaskByIdDTO(taskId);
  if (!currentTask) {
    return {
      message: "Task not found",
    };
  }

  const isTeamRole = user.role === "TEAM";

  if (isTeamRole) {
    if (title !== currentTask.title) {
      return {
        message: "Team members cannot modify the title",
      };
    }

    if (assignedTo !== currentTask.assignedTo) {
      return {
        message: "Team members cannot modify the assigned user",
      };
    }
  }

  const updatedTask = await updateTaskDTO(taskId, { title, description, status, assignedTo });
  if (!updatedTask) {
    return {
      message: "Error updating task",
    };
  }

  await createTaskLogDTO({
    taskId: updatedTask.id,
    changedBy: user.id,
    logType: "UPDATE",
    oldStatus: {
      title: currentTask.title,
      description: currentTask.description,
      status: currentTask.status,
      assignedTo: currentTask.assignedTo,
    },
    newStatus: {
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      assignedTo: updatedTask.assignedTo,
    },
  });

  revalidatePath(`/dashboard/tasks/${taskId}`);
  redirect(`/dashboard/tasks/${taskId}`);
}

export async function deleteTask(taskId: number) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the current task to log its details
  const currentTask = await getTaskByIdDTO(taskId);
  if (!currentTask) {
    return {
      message: "Task not found",
    };
  }

  // Delete the task (assuming you have a deleteTaskDTO function)
  const deletedTask = await deleteTaskDTO(taskId);
  if (!deletedTask) {
    return {
      message: "Error deleting task",
    };
  }

  // Log the task deletion
  await createTaskLogDTO({
    taskId: taskId, // ID of the deleted task
    changedBy: user.id, // User who deleted the task
    logType: "DELETE", // Log type
    oldStatus: {
      title: currentTask.title,
      description: currentTask.description,
      status: currentTask.status,
      assignedTo: currentTask.assignedTo,
    },
    newStatus: {}, // No new status for deletions
    notes: "Task deleted", // Optional notes
  });

  // Revalidate the dashboard path and redirect
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
