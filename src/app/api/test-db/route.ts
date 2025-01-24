import db from "@/lib/db";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await db.$queryRaw<User[]>`SELECT * FROM "User"`;
    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
