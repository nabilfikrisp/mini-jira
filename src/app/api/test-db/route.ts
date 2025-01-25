import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { InferSelectModel, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

type User = InferSelectModel<typeof users>;

export async function GET() {
  try {
    const data = await db.execute(sql`
      SELECT id, username, role, created_at AS "createdAt"
      FROM users
    `);

    return NextResponse.json({
      users: data.rows as User[],
      message: "Success boss",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
