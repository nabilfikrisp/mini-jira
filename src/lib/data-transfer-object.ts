import { db } from "@/db/drizzle";
import { CreateTaskFormType, Task, TaskLogs, TaskLogType, User, UserWithPassword } from "./types";
import { sql } from "drizzle-orm";
import { LogTypeEnum, UserRoleEnum } from "@/db/schema";
import { hash } from "argon2";

export async function getUserByUsernameDTO(username: string) {
  try {
    const data = await db.execute<UserWithPassword>(sql`
      SELECT
        id,
        username,
        password,
        role,
        created_at AS "createdAt"
      FROM users
      WHERE username = ${username}
      LIMIT 1
    `);

    return data.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}

export async function getAllUsersDTO() {
  try {
    const data = await db.execute<User>(sql`
      SELECT id, username, role, created_at as createdAt
      FROM users
    `);

    return data.rows || [];
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

export async function createTaskDTO({
  title,
  description,
  assignedTo,
  createdBy,
}: CreateTaskFormType & { createdBy: number }) {
  try {
    const data = await db.execute<Task>(sql`
      INSERT INTO tasks (title, description, created_by, assigned_to)
      VALUES (${title}, ${description}, ${createdBy}, ${assignedTo || null})
      RETURNING
        id,
        title,
        description,
        status,
        created_by AS "createdBy",
        assigned_to AS "assignedTo",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `);

    return data.rows[0] || null;
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
}

export async function getAllTaskDTO() {
  try {
    const data = await db.execute<Task>(sql`
      SELECT
        id,
        title,
        description,
        status,
        created_by AS "createdBy",
        assigned_to AS "assignedTo",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM tasks
    `);

    return data.rows || [];
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    return [];
  }
}

export async function getTaskByIdDTO(id: number) {
  try {
    const data = await db.execute<Task>(sql`
      SELECT
        id,
        title,
        description,
        status,
        created_by AS "createdBy",
        assigned_to AS "assignedTo",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM tasks
      WHERE id = ${id}
      LIMIT 1
    `);

    return data.rows[0] || null;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    return null;
  }
}

export async function updateTaskDTO(id: number, updates: Partial<Task>) {
  try {
    const data = await db.execute<Task>(sql`
      UPDATE tasks
      SET
        title = ${updates.title},
        description = ${updates.description || null},
        status = ${updates.status},
        assigned_to = ${updates.assignedTo || null}
      WHERE id = ${id}
      RETURNING
        id,
        title,
        description,
        status,
        created_by AS "createdBy",
        assigned_to AS "assignedTo",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `);

    return data.rows[0] || null;
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
}

export async function deleteTaskDTO(id: number) {
  try {
    const data = await db.execute(sql`
      DELETE FROM tasks
      WHERE id = ${id}
      RETURNING
        id,
        title,
        description,
        status,
        created_by AS "createdBy",
        assigned_to AS "assignedTo",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `);

    return data.rows[0] || null;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
}

export async function createTaskLogDTO({
  taskId,
  changedBy,
  logType,
  oldStatus,
  newStatus,
  notes,
}: {
  taskId: number;
  changedBy: number;
  logType: (typeof LogTypeEnum)[number];
  oldStatus: TaskLogType;
  newStatus: TaskLogType;
  notes?: string;
}) {
  try {
    const data = await db.execute(sql`
      INSERT INTO task_logs (
        task_id,
        changed_by,
        log_type,
        old_status,
        new_status,
        notes
      ) VALUES (
        ${taskId},
        ${changedBy},
        ${logType},
        ${oldStatus ? JSON.stringify(oldStatus) : null},
        ${newStatus ? JSON.stringify(newStatus) : null},
        ${notes || null}
      )
      RETURNING id
    `);

    return data.rows[0] || null;
  } catch (error) {
    console.error("Error creating task log:", error);
    return null;
  }
}

export async function getTaskLogsByTaskIdDTO(taskId: number) {
  try {
    const data = await db.execute(sql`
      SELECT
        id,
        task_id AS "taskId",
        changed_by AS "changedBy",
        log_type AS "logType",
        old_status AS "oldStatus",
        new_status AS "newStatus",
        notes,
        changed_at AS "changedAt"
      FROM task_logs
      WHERE task_id = ${taskId}
      ORDER BY changed_at DESC
    `);

    return data.rows || [];
  } catch (error) {
    console.error("Error fetching task logs:", error);
    return [];
  }
}

export async function getAllTaskLogsDTO() {
  try {
    const data = await db.execute<TaskLogs>(sql`
      SELECT
        id,
        task_id AS "taskId",
        changed_by AS "changedBy",
        log_type AS "logType",
        old_status AS "oldStatus",
        new_status AS "newStatus",
        notes,
        changed_at AS "changedAt"
      FROM task_logs
      ORDER BY changed_at DESC
    `);

    return data.rows || [];
  } catch (error) {
    console.error("Error fetching all task logs:", error);
    return null;
  }
}

export async function createUserDTO(data: {
  username: string;
  password: string;
  role: (typeof UserRoleEnum)[number];
}) {
  const hashedPassword = await hash(data.password);

  const result = await db.execute<User>(
    sql`
      INSERT INTO users
        (username, password, role)
      VALUES
        (${data.username}, ${hashedPassword}, ${data.role})
      RETURNING
        id,
        username,
        role,
        created_at as "createdAt"
    `
  );

  return result.rows[0];
}
