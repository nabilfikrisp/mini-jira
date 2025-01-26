"use server";

import { createUserDTO, getUserByUsernameDTO } from "@/lib/data-transfer-object";
import { createSession, deleteSession } from "@/lib/session";
import { LoginFormSchema, RegisterFormSchema } from "@/lib/types";
import { verify } from "argon2";
import { redirect } from "next/navigation";

export async function login(prevState: unknown, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  const user = await getUserByUsernameDTO(username);

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
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function register(prevState: unknown, formData: FormData) {
  const validatedFields = RegisterFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role"), // Add role field
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password, role } = validatedFields.data;
  // Create the user
  const user = await createUserDTO({ username, password, role });

  if (!user) {
    return {
      message: "Failed to create user",
    };
  }

  // Create session and redirect
  await createSession(user.id.toString());
  redirect("/dashboard");
}
