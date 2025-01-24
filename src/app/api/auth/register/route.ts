import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { User } from "@prisma/client";

export async function POST(request: Request) {
  const { email, password, role, name } = await request.json();

  try {
    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Use a transaction to check for existing user and create a new user
    const newUser = await db.$transaction(async (tx) => {
      // Check if user already exists
      const existingUser = await tx.$queryRaw<User[]>`
        SELECT * FROM "User"
        WHERE email = ${email}
        LIMIT 1
      `;

      if (existingUser.length > 0) {
        throw new Error("User already exists");
      }

      // Create the user
      // Insert the new user using executeRaw
      await tx.$executeRaw`
        INSERT INTO "User" (email, name, password, role)
        VALUES (${email}, ${name}, ${hashedPassword}, ${role}::"Role")
      `;

      // Fetch the newly created user
      const result = await tx.$queryRaw<User[]>`
        SELECT * FROM "User"
        WHERE email = ${email}
        LIMIT 1
      `;

      return result[0]; // Return the newly created user
    });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    if ((error as Error).message === "User already exists") {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
}
