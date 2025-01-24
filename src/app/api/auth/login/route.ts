import { NextResponse } from "next/server";
import db from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";
import { User } from "@prisma/client";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // Find the user by email
    const users = await db.$queryRaw<User[]>`
      SELECT * FROM "User" WHERE email = ${email} LIMIT 1
      `;

    if (!users) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = users[0];

    // Compare the password with the hashed password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = await generateToken(user.id);

    // Set the token in an HTTP-only cookie
    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
