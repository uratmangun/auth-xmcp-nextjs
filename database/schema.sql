-- Better Auth Database Schema for PostgreSQL
-- This schema includes tables for OIDC Provider plugin

-- User table for storing user information
CREATE TABLE IF NOT EXISTS "user" (
  "id" text NOT NULL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL,
  "image" text,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL,
  "paraWalletId" text,
  "paraEmail" text
);

-- Session table for managing user sessions
CREATE TABLE IF NOT EXISTS "session" (
  "id" text NOT NULL PRIMARY KEY,
  "expiresAt" timestamp NOT NULL,
  "token" text NOT NULL UNIQUE,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);

-- Account table for OAuth and local authentication
CREATE TABLE IF NOT EXISTS "account" (
  "id" text NOT NULL PRIMARY KEY,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamp,
  "refreshTokenExpiresAt" timestamp,
  "scope" text,
  "password" text,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

-- Verification table for email verification and password resets
CREATE TABLE IF NOT EXISTS "verification" (
  "id" text NOT NULL PRIMARY KEY,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expiresAt" timestamp NOT NULL,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

-- OAuth application table for OAuth provider functionality
CREATE TABLE IF NOT EXISTS "oauthApplication" (
  "id" text NOT NULL PRIMARY KEY,
  "name" text NOT NULL,
  "icon" text,
  "metadata" text,
  "clientId" text NOT NULL UNIQUE,
  "clientSecret" text,
  "redirectURLs" text NOT NULL,
  "type" text NOT NULL,
  "disabled" boolean,
  "userId" text,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

-- OAuth access token table
CREATE TABLE IF NOT EXISTS "oauthAccessToken" (
  "id" text NOT NULL PRIMARY KEY,
  "accessToken" text NOT NULL UNIQUE,
  "refreshToken" text NOT NULL UNIQUE,
  "accessTokenExpiresAt" timestamp NOT NULL,
  "refreshTokenExpiresAt" timestamp NOT NULL,
  "clientId" text NOT NULL,
  "userId" text,
  "scopes" text NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

-- OAuth consent table for managing user consent
CREATE TABLE IF NOT EXISTS "oauthConsent" (
  "id" text NOT NULL PRIMARY KEY,
  "clientId" text NOT NULL,
  "userId" text NOT NULL,
  "scopes" text NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL,
  "consentGiven" boolean NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "session" ("userId");
CREATE INDEX IF NOT EXISTS "idx_session_token" ON "session" ("token");
CREATE INDEX IF NOT EXISTS "idx_account_userId" ON "account" ("userId");
CREATE INDEX IF NOT EXISTS "idx_account_providerId" ON "account" ("providerId");
CREATE INDEX IF NOT EXISTS "idx_oauthAccessToken_accessToken" ON "oauthAccessToken" ("accessToken");
CREATE INDEX IF NOT EXISTS "idx_oauthAccessToken_clientId" ON "oauthAccessToken" ("clientId");
CREATE INDEX IF NOT EXISTS "idx_oauthConsent_userId" ON "oauthConsent" ("userId");
CREATE INDEX IF NOT EXISTS "idx_oauthConsent_clientId" ON "oauthConsent" ("clientId");
