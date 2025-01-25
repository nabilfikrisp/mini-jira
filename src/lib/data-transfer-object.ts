import { db } from "@/db/drizzle";
import { CreateTaskFormType, Task, User, UserWithPassword } from "./types";
import { sql } from "drizzle-orm";

export async function getUserByUsernameDTO(username: string) {
  try {
    const data = await db.execute<UserWithPassword>(sql`
      SELECT
        id,
        username,
        password,
        role,
        created_at AS "createdAt",
      FROM users
      WHERE username = ${username}
      LIMIT 1
    `);

    // If no user is found, return null
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
