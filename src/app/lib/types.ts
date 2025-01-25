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
