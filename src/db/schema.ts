import {
  integer,
  text,
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
  index,
  jsonb,
} from "drizzle-orm/pg-core";

// Enums
export const UserRoleEnum = ["LEAD", "TEAM"] as const;
export const userRoleEnum = pgEnum("user_role", UserRoleEnum);

export const TaskStatusEnum = ["NOT_STARTED", "ON_PROGRESS", "DONE", "REJECT"] as const;
export const taskStatusEnum = pgEnum("task_status", TaskStatusEnum);

export const LogTypeEnum = ["CREATE", "UPDATE", "DELETE"] as const;
export const logTypeEnum = pgEnum("log_type", LogTypeEnum);

// Users Table
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    role: userRoleEnum().default("TEAM").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("username_index").on(t.username)]
);

// Tasks Table
export const tasks = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: taskStatusEnum().default("NOT_STARTED").notNull(),
    createdBy: integer("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Cascade delete if the user is deleted
    assignedTo: integer("assigned_to").references(() => users.id, { onDelete: "set null" }), // Set to null if the assigned user is deleted
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("assigned_to_index").on(t.assignedTo)] // Index on the status field for faster queries
);

// Task Logs Table
export const taskLogs = pgTable("task_logs", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull(), // No foreign key constraint
  changedBy: integer("changed_by").notNull(),
  logType: logTypeEnum("log_type").notNull(),
  oldStatus: jsonb("old_status"),
  newStatus: jsonb("new_status"),
  notes: text("notes"),
  changedAt: timestamp("changed_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

// JSONB strcucture
// {
//  title: "Task Title",
//  description: "Task Description",
//  status: "Task Status",
//  assignedTo: "Assigned User ID",
// }
