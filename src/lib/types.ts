import { taskLogs, tasks, TaskStatusEnum, UserRoleEnum, users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().min(2, { message: "Name must be at least 2 characters long." }).trim(),
  password: z.string().min(5, { message: "Be at least 5 characters long" }).trim(),
});

export type LoginFormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export type UserWithPassword = InferSelectModel<typeof users>;
export type User = Omit<UserWithPassword, "password">;
export type Task = InferSelectModel<typeof tasks>;
export type TaskStatus = Task["status"];

export const CreateTaskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignedTo: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : null)),
});

export type CreateTaskFormType = z.infer<typeof CreateTaskFormSchema>;

export const UpdateTaskFormSchema = z.object({
  taskId: z
    .string()
    .min(1, "Task ID is required")
    .transform((val) => parseInt(val, 10)),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignedTo: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : null)),
  status: z.enum(TaskStatusEnum),
});

export type TaskLogType = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  assignedTo?: number | null;
};

export type TaskLogs = InferSelectModel<typeof taskLogs> & {
  oldStatus: TaskLogType;
  newStatus: TaskLogType;
};

export const RegisterFormSchema = z
  .object({
    username: z.string().min(2, "Username is required"),
    password: z.string().min(5, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(4, "Confirm Password is required"),
    role: z.enum(UserRoleEnum),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
