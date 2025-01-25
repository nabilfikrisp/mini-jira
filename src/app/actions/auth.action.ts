"use server";

import { LoginFormSchema } from "../lib/types";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { createSession, deleteSession } from "@/lib/session";
import { verify } from "argon2";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function login(prevState: unknown, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  try {
    const data = await db.select().from(users).where(eq(users.username, username)).limit(1);

    const user = data[0];

    if (!user) {
      return {
        message: "Invalid username or password",
      };
    }

    const isValidPassword = await verify(user.password, password);
    if (!isValidPassword) {
      return {
        message: "Invalid username or password",
      };
    }

    await createSession(user.id.toString());
  } catch (error) {
    console.error("Login failed:", error);
    return {
      message: "An error occurred. Please try again later.",
    };
  }
  redirect("/");
}

export async function logout() {
  deleteSession();
  redirect("/login");
}
