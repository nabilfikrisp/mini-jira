import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "./session";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db/drizzle";
import { sql } from "drizzle-orm";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId as string };
});

type User = {
  id: number;
  username: string;
  role: string;
};

export const getUser = cache(async (): Promise<User | null> => {
  const session = await verifySession(); // This ensures the user is authenticated

  try {
    const data = await db.execute(
      sql`SELECT id, username, role FROM users WHERE id = ${session.userId} LIMIT 1`
    );

    const user = data.rows[0];

    if (!user) {
      console.log("User not found");
      return null;
    }

    return user as User;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
});
