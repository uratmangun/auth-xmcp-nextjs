CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "oauthAccessToken" (
	"id" text PRIMARY KEY NOT NULL,
	"accessToken" text NOT NULL,
	"refreshToken" text NOT NULL,
	"accessTokenExpiresAt" timestamp NOT NULL,
	"refreshTokenExpiresAt" timestamp NOT NULL,
	"clientId" text NOT NULL,
	"userId" text,
	"scopes" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "oauthAccessToken_accessToken_unique" UNIQUE("accessToken"),
	CONSTRAINT "oauthAccessToken_refreshToken_unique" UNIQUE("refreshToken")
);
--> statement-breakpoint
CREATE TABLE "oauthApplication" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"metadata" text,
	"clientId" text NOT NULL,
	"clientSecret" text,
	"redirectURLs" text NOT NULL,
	"type" text NOT NULL,
	"disabled" boolean,
	"userId" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "oauthApplication_clientId_unique" UNIQUE("clientId")
);
--> statement-breakpoint
CREATE TABLE "oauthConsent" (
	"id" text PRIMARY KEY NOT NULL,
	"clientId" text NOT NULL,
	"userId" text NOT NULL,
	"scopes" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"consentGiven" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"paraWalletId" text,
	"paraEmail" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_account_userId" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_account_providerId" ON "account" USING btree ("providerId");--> statement-breakpoint
CREATE INDEX "idx_oauthAccessToken_accessToken" ON "oauthAccessToken" USING btree ("accessToken");--> statement-breakpoint
CREATE INDEX "idx_oauthAccessToken_clientId" ON "oauthAccessToken" USING btree ("clientId");--> statement-breakpoint
CREATE INDEX "idx_oauthConsent_userId" ON "oauthConsent" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_oauthConsent_clientId" ON "oauthConsent" USING btree ("clientId");--> statement-breakpoint
CREATE INDEX "idx_session_userId" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_session_token" ON "session" USING btree ("token");