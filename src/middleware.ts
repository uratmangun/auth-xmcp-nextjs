import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Better Auth Middleware
 * Handles authentication for protected routes
 */
export async function middleware(request: NextRequest) {
  // Allow public routes
  const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/api/auth",
    "/.well-known",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, Better Auth will handle authentication
  // via the session cookie automatically
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
