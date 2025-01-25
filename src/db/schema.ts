import {
  integer,
  text,
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["LEAD", "TEAM"]);
export const taskStatusEnum = pgEnum("task_status", [
  "NOT_STARTED",
  "ON_PROGRESS",
  "DONE",
  "REJECT",
]);

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
    createdBy: integer("created_by").references(() => users.id),
    assignedTo: integer("assigned_to").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [index("status_index").on(t.status)]
);

// Task Logs Table
export const taskLogs = pgTable("task_logs", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id),
  changedBy: integer("changed_by").references(() => users.id),
  oldStatus: varchar("old_status", { length: 50 }),
  newStatus: varchar("new_status", { length: 50 }),
  notes: text("notes"),
  changedAt: timestamp("changed_at").defaultNow(),
});
