"use server";

import { getUser } from "@/lib/data-access-layer";
import { createTaskDTO } from "@/lib/data-transfer-object";
import { CreateTaskFormSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTask(prevState: unknown, formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }
  if (user.role !== "LEAD") {
    return null;
  }

  const validatedFields = CreateTaskFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    assignedTo: formData.get("assignedTo"),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, description, assignedTo } = validatedFields.data;

  await createTaskDTO({
    createdBy: user.id,
    title,
    description,
    assignedTo: assignedTo,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
