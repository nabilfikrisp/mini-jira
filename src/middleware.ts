import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Specify protected and public routes
const protectedRoutes = ["/"];
const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Get the JWT token from the cookie
  const token = req.cookies.get("token")?.value;

  // 4. Check if the token exists (without verification)
  const hasToken = !!token;

  // 5. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !hasToken) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 6. Redirect to / if the user is authenticated and tries to access a public route
  if (isPublicRoute && hasToken) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// 7. Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
