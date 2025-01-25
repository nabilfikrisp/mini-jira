import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "./session";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db/drizzle";
import { sql } from "drizzle-orm";
import { User } from "./types";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId as string };
});

export const getUser = cache(async () => {
  const session = await verifySession();

  try {
    const data = await db.execute<User>(sql`
      SELECT id, username, role, created_at FROM users
      WHERE id = ${session.userId}
      LIMIT 1
    `);

    const user = data.rows[0];

    if (!user) {
      console.log("User not found");
      return null;
    }

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
});
