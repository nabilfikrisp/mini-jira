import { tasks, users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().min(2, { message: "Name must be at least 2 characters long." }).trim(),
  password: z
    .string()
    .min(5, { message: "Be at least 5 characters long" })
    // .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    // .regex(/[0-9]/, { message: "Contain at least one number." })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "Contain at least one special character.",
    // })
    .trim(),
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

export type User = Omit<InferSelectModel<typeof users>, "password">;
export type UserWithPassword = InferSelectModel<typeof users>;
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
