import { createTaskLogDTO } from "@/lib/data-transfer-object";
import { getUser } from "@/lib/data-access-layer";
import { Task, TaskLogType } from "@/lib/types";
import { redirect } from "next/navigation";
import { LogTypeEnum } from "@/db/schema";

export async function createTaskLog(
  taskId: number,
  oldTask: Partial<Task>,
  newTask: Partial<Task>,
  logType: (typeof LogTypeEnum)[number]
) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const changes: TaskLogType = {};

  if (oldTask.title !== newTask.title) {
    changes.title = newTask.title;
  }
  if (oldTask.description !== newTask.description) {
    changes.description = newTask.description;
  }
  if (oldTask.status !== newTask.status) {
    changes.status = newTask.status;
  }
  if (oldTask.assignedTo !== newTask.assignedTo) {
    changes.assignedTo = newTask.assignedTo;
  }

  if (Object.keys(changes).length > 0) {
    await createTaskLogDTO({
      taskId,
      logType,
      changedBy: user.id,
      oldStatus: {
        title: oldTask.title,
        description: oldTask.description,
        status: oldTask.status,
        assignedTo: oldTask.assignedTo,
      },
      newStatus: {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        assignedTo: newTask.assignedTo,
      },
    });
  }
}
