import { betterAuth } from "better-auth";
import { oidcProvider } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "super-secret-key-change-this-in-production",
  
  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  // Social providers configuration
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
  },

  plugins: [
    // OIDC Provider plugin for custom OIDC
    oidcProvider({
      loginPage: "/sign-in",
      // Enable dynamic client registration
      allowDynamicClientRegistration: true,
      // Consent screen configuration
      consentPage: "/consent",
      // JWKS configuration
      jwks: {
        enabled: true,
      },
    }),
  ],

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  // User configuration
  user: {
    additionalFields: {
      paraWalletId: {
        type: "string",
        required: false,
      },
      paraEmail: {
        type: "string",
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
