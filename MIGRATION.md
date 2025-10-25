# Migration from Clerk to Better Auth + OIDC + Para

This document outlines the changes made to migrate from Clerk authentication to Better Auth with OIDC Provider and Para wallet integration.

## Summary of Changes

### 1. Dependencies

**Removed:**
- `@clerk/nextjs`
- `@clerk/mcp-tools`

**Added:**
- `better-auth` - Authentication framework
- `pg` - PostgreSQL client
- `@types/pg` - TypeScript types for PostgreSQL

### 2. Authentication Architecture

**Before (Clerk):**
```
User → Clerk Auth → MCP Endpoint
```

**After (Better Auth + OIDC + Para):**
```
User → Better Auth (OIDC Provider) → MCP Endpoint
                ↓
         Para Wallet (optional)
```

### 3. File Changes

#### Created Files

1. **`src/lib/auth.ts`** - Better Auth server configuration
   - OIDC Provider plugin enabled
   - Email/password authentication
   - Social OAuth (Google)
   - Custom user fields for Para wallet

2. **`src/lib/auth-client.ts`** - Better Auth client configuration
   - OIDC client plugin
   - Client-side authentication methods

3. **`src/lib/para-integration.ts`** - Para wallet bridge
   - Client-side wallet initialization
   - Server-side wallet linking
   - OAuth configuration for Para

4. **`src/app/api/auth/[...all]/route.ts`** - Better Auth API handler
   - Handles all Better Auth endpoints
   - OIDC endpoints automatically mounted

5. **`src/app/api/auth/link-para-wallet/route.ts`** - Para wallet linking API
   - Links Para wallet to Better Auth user
   - Updates user record with wallet info

6. **`src/app/sign-in/page.tsx`** - Sign-in page example
   - Email/password sign-in
   - Google OAuth sign-in
   - Para wallet integration

7. **`database/schema.sql`** - PostgreSQL schema
   - User, session, account tables
   - OAuth application tables for OIDC
   - OAuth consent and token tables

8. **`SETUP.md`** - Comprehensive setup guide
9. **`MIGRATION.md`** - This file

#### Modified Files

1. **`src/app/mcp/route.ts`**
   - **Before:** Used Clerk's `verifyClerkToken`
   - **After:** Uses Better Auth's `getSession` API
   - Token verification now uses Better Auth session

2. **`src/middleware.ts`**
   - **Before:** Used `clerkMiddleware()`
   - **After:** Custom middleware with public route handling
   - Better Auth handles session via cookies

3. **`src/app/.well-known/oauth-protected-resource/route.ts`**
   - **Before:** Used Clerk's protected resource handler
   - **After:** Custom OAuth 2.0 resource metadata
   - Compliant with RFC 8414

4. **`package.json`**
   - Removed Clerk dependencies
   - Added Better Auth and PostgreSQL
   - Updated to use Bun package manager

5. **`.env.example`**
   - Removed Clerk environment variables
   - Added Better Auth configuration
   - Added Para configuration
   - Added database URL

## Key Differences

### Authentication Flow

**Clerk:**
```typescript
// Clerk automatically handled everything
const { userId } = await auth();
```

**Better Auth:**
```typescript
// More control over authentication
const session = await auth.api.getSession({ headers });
const userId = session?.user.id;
```

### OIDC Provider

**Clerk:**
- Clerk acted as the OIDC provider
- Limited customization

**Better Auth:**
- Full OIDC provider with customization
- Dynamic client registration
- Custom consent screens
- Full control over tokens and scopes

### Session Management

**Clerk:**
- Managed via Clerk's infrastructure
- Limited session customization

**Better Auth:**
- Sessions stored in your database
- Full control over expiration
- Custom session fields
- Cookie-based or token-based

### Para Wallet Integration

**New Feature:**
- Bridge between Better Auth and Para
- Automatic wallet creation on sign-up
- Email-based wallet linking
- Support for social OAuth → wallet flow

## Migration Steps

### 1. Remove Clerk

```bash
# Remove Clerk packages
bun remove @clerk/nextjs @clerk/mcp-tools
```

### 2. Install Better Auth

```bash
# Install Better Auth and dependencies
bun add better-auth pg @types/pg
```

### 3. Set Up Database

```bash
# Create PostgreSQL database
createdb auth_xmcp

# Run schema
psql auth_xmcp < database/schema.sql
```

### 4. Update Environment Variables

```bash
# Remove Clerk variables
# CLERK_SECRET_KEY=...
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...

# Add Better Auth variables
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_BASE_URL=http://localhost:3000
```

### 5. Update Code

All code changes are already implemented in this migration. Key changes:

- `src/app/mcp/route.ts` - Updated token verification
- `src/middleware.ts` - New middleware
- `src/lib/auth.ts` - Better Auth configuration
- `.well-known` endpoints - OAuth metadata

### 6. Test

```bash
# Start development server
bun run dev

# Test OIDC discovery
curl http://localhost:3000/.well-known/openid-configuration

# Test sign-in
# Visit http://localhost:3000/sign-in
```

## Breaking Changes

### 1. Session Structure

**Clerk:**
```typescript
const { userId, sessionId } = await auth();
```

**Better Auth:**
```typescript
const session = await auth.api.getSession({ headers });
const userId = session?.user.id;
const sessionId = session?.session.id;
```

### 2. Client-Side Auth

**Clerk:**
```typescript
import { useAuth } from "@clerk/nextjs";
const { userId } = useAuth();
```

**Better Auth:**
```typescript
import { authClient } from "@/lib/auth-client";
const session = await authClient.getSession();
const userId = session?.user.id;
```

### 3. Middleware

**Clerk:**
```typescript
export default clerkMiddleware();
```

**Better Auth:**
```typescript
export async function middleware(request: NextRequest) {
  // Custom logic
  return NextResponse.next();
}
```

## New Capabilities

### 1. Custom OIDC Provider

You can now act as an OIDC provider for other services:

```typescript
// Register OAuth clients
const app = await authClient.oauth2.register({
  client_name: "My App",
  redirect_uris: ["https://myapp.com/callback"],
});
```

### 2. Para Wallet Integration

Automatic wallet creation for authenticated users:

```typescript
// After sign-in
const walletInfo = await paraClientIntegration.initializeWallet(email);
```

### 3. Social OAuth + Wallet

Combined social login with wallet creation:

```typescript
// Sign in with Google
await authClient.signIn.social({ provider: "google" });

// Wallet automatically created with Google email
```

### 4. Full Database Control

All auth data in your PostgreSQL database:
- Users
- Sessions
- OAuth applications
- Tokens
- Consent records

## Rollback Plan

If you need to rollback to Clerk:

1. Restore `package.json` from git history
2. Run `bun install`
3. Restore Clerk environment variables
4. Restore original files:
   - `src/app/mcp/route.ts`
   - `src/middleware.ts`
   - `.well-known` endpoints

## Support

For issues or questions:

1. **Better Auth:** https://www.better-auth.com/docs
2. **Para:** https://docs.getpara.com/
3. **xMCP:** https://xmcp.dev/docs

## Next Steps

1. ✅ Database setup
2. ✅ Environment configuration
3. ✅ Better Auth integration
4. ✅ OIDC Provider setup
5. ✅ Para wallet bridge
6. 🔲 Implement Para SDK on client
7. 🔲 Create sign-up page
8. 🔲 Add consent screen
9. 🔲 Configure additional OAuth providers
10. 🔲 Production deployment

## Notes

- **OIDC Plugin Status:** The OIDC Provider plugin is in active development. Some features like JWKS are not fully implemented yet.
- **Para Integration:** The Para integration is a bridge pattern. You'll need to implement the actual Para SDK calls on the client side.
- **Security:** Always use HTTPS in production for OIDC flows.
- **Database:** Consider using a managed PostgreSQL service like Neon or Supabase for production.
