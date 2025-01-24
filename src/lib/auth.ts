import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { hash, verify } from "@node-rs/argon2";
import { JWTExpired, JWTInvalid } from "jose/errors";

// Define the JWT secret
export const JWT_SECRET = process.env.JWT_SECRET || "random";
const secret = new TextEncoder().encode(JWT_SECRET);

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return hash(password);
}

// Compare a password with its hash
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  if (!password) {
    throw new Error("Password are required");
  }
  if (!hash) {
    throw new Error("Hash are required");
  }

  return verify(hash, password);
}

// Generate a JWT token
export async function generateToken(userId: number): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" }) // Use HMAC SHA-256 algorithm
    .setIssuedAt() // Set issued at time
    .setExpirationTime("1h") // Set token expiration time
    .sign(secret); // Sign the token with the secret
}

// Verify a JWT token
export async function verifyToken(
  token: string
): Promise<{ userId: number } | { error: string }> {
  try {
    const { payload } = await jwtVerify<JWTPayload & { userId: number }>(
      token,
      secret
    );

    if (!payload.userId) {
      return { error: "Invalid token payload." };
    }

    return { userId: payload.userId };
  } catch (error) {
    if (error instanceof JWTExpired) {
      return { error: "Token has expired. Please log in again." };
    } else if (error instanceof JWTInvalid) {
      return { error: "Invalid token. Please provide a valid token." };
    }

    return { error: "An error occurred while verifying the token." };
  }
}
