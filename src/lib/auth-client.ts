import { createAuthClient } from "better-auth/client";
import { oidcClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL || "http://localhost:3000",
  plugins: [
    oidcClient(),
  ],
});

export type Session = typeof authClient.$Infer.Session;
