import { pgTable, text, boolean, timestamp, index } from "drizzle-orm/pg-core";

// User table for storing user information
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  paraWalletId: text("paraWalletId"),
  paraEmail: text("paraEmail"),
});

// Session table for managing user sessions
export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userIdIdx: index("idx_session_userId").on(table.userId),
    tokenIdx: index("idx_session_token").on(table.token),
  })
);

// Account table for OAuth and local authentication
export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_account_userId").on(table.userId),
    providerIdIdx: index("idx_account_providerId").on(table.providerId),
  })
);

// Verification table for email verification and password resets
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// OAuth application table for OAuth provider functionality
export const oauthApplication = pgTable("oauthApplication", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  metadata: text("metadata"),
  clientId: text("clientId").notNull().unique(),
  clientSecret: text("clientSecret"),
  redirectURLs: text("redirectURLs").notNull(),
  type: text("type").notNull(),
  disabled: boolean("disabled"),
  userId: text("userId"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

// OAuth access token table
export const oauthAccessToken = pgTable(
  "oauthAccessToken",
  {
    id: text("id").primaryKey(),
    accessToken: text("accessToken").notNull().unique(),
    refreshToken: text("refreshToken").notNull().unique(),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt").notNull(),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt").notNull(),
    clientId: text("clientId").notNull(),
    userId: text("userId"),
    scopes: text("scopes").notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => ({
    accessTokenIdx: index("idx_oauthAccessToken_accessToken").on(table.accessToken),
    clientIdIdx: index("idx_oauthAccessToken_clientId").on(table.clientId),
  })
);

// OAuth consent table for managing user consent
export const oauthConsent = pgTable(
  "oauthConsent",
  {
    id: text("id").primaryKey(),
    clientId: text("clientId").notNull(),
    userId: text("userId").notNull(),
    scopes: text("scopes").notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    consentGiven: boolean("consentGiven").notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_oauthConsent_userId").on(table.userId),
    clientIdIdx: index("idx_oauthConsent_clientId").on(table.clientId),
  })
);
