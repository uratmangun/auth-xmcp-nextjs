import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next|\\.well-known|mcp).*)',
    '/',
    '/(api|trpc)(.*)'
  ],
};
