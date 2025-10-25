# 🔐 Better Auth + OIDC + Para Wallet Integration

## Overview

Successfully migrated from **Clerk** to **Better Auth** with **OIDC Provider** plugin and integrated **Para social login wallet** for MCP authentication.

## What Changed

### ✅ Authentication System
- **Replaced:** Clerk authentication
- **With:** Better Auth + OIDC Provider plugin
- **Benefits:**
  - Full control over authentication flow
  - Custom OIDC provider for MCP
  - Database-backed sessions
  - Extensible plugin system

### ✅ OIDC Provider
- **Feature:** Act as your own OpenID Connect provider
- **Capabilities:**
  - Dynamic client registration
  - Authorization Code flow
  - Token management (access + refresh)
  - UserInfo endpoint
  - JWKS endpoint (in development)
  - Consent screens

### ✅ Para Wallet Integration
- **Feature:** Crypto wallet creation/login via email
- **Flow:**
  1. User authenticates with Better Auth (email/password or OAuth)
  2. Email used to create/link Para wallet
  3. Wallet ID stored in Better Auth user record
  4. Seamless wallet access for authenticated users

### ✅ Database Schema
- **PostgreSQL** tables for:
  - Users and sessions
  - OAuth applications
  - Access tokens and refresh tokens
  - Consent records
  - Custom fields for Para wallet info

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User                                 │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              Better Auth (OIDC Provider)                     │
│  • Email/Password                                            │
│  • Social OAuth (Google, etc.)                               │
│  • Session Management                                        │
│  • Token Issuance                                            │
└───────────────────┬─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐      ┌──────────────────┐
│  MCP Server   │      │  Para Wallet     │
│  /mcp         │      │  • Create wallet │
│  • Tools      │      │  • Login wallet  │
│  • Resources  │      │  • Link to user  │
│  • Prompts    │      └──────────────────┘
└───────────────┘
```

## Files Created

### Core Authentication
- `src/lib/auth.ts` - Better Auth server configuration
- `src/lib/auth-client.ts` - Better Auth client setup
- `src/app/api/auth/[...all]/route.ts` - Auth API handler

### Para Integration
- `src/lib/para-integration.ts` - Para wallet bridge
- `src/app/api/auth/link-para-wallet/route.ts` - Wallet linking API

### Database
- `database/schema.sql` - PostgreSQL schema
- `scripts/setup-db.sh` - Database setup script

### UI
- `src/app/sign-in/page.tsx` - Sign-in page example

### Documentation
- `SETUP.md` - Comprehensive setup guide
- `MIGRATION.md` - Migration from Clerk guide
- `CHANGES.md` - This file

## Files Modified

### MCP Integration
- `src/app/mcp/route.ts`
  - Replaced Clerk token verification
  - Now uses Better Auth session API

### Middleware
- `src/middleware.ts`
  - Removed Clerk middleware
  - Custom middleware for public routes

### OAuth Metadata
- `src/app/.well-known/oauth-protected-resource/route.ts`
  - Custom OAuth 2.0 resource metadata
  - RFC 8414 compliant

### Configuration
- `package.json` - Updated dependencies
- `.env.example` - New environment variables

## Environment Variables

### Required
```env
DATABASE_URL=postgresql://user:password@host:port/database
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_BASE_URL=http://localhost:3000
```

### Optional
```env
# Social OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Para Wallet
NEXT_PUBLIC_PARA_API_KEY=...
PARA_CLIENT_ID=...
PARA_CLIENT_SECRET=...
```

## Quick Start

### 1. Install Dependencies
```bash
bun install
```

### 2. Set Up Database
```bash
./scripts/setup-db.sh
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Generate Secret
```bash
openssl rand -base64 32
```

### 5. Run Development Server
```bash
bun run dev
```

### 6. Test OIDC
```bash
curl http://localhost:3000/.well-known/openid-configuration
```

## OIDC Endpoints

Better Auth automatically provides:

- **Discovery:** `/.well-known/openid-configuration`
- **Authorization:** `/api/auth/authorize`
- **Token:** `/api/auth/token`
- **UserInfo:** `/api/auth/userinfo`
- **JWKS:** `/.well-known/jwks.json`
- **Register Client:** `/api/auth/oauth2/register`

## MCP Authentication Flow

1. **Register OAuth Client**
   ```typescript
   const app = await authClient.oauth2.register({
     client_name: "My MCP Client",
     redirect_uris: ["http://localhost:3000/callback"],
   });
   ```

2. **Authorization Request**
   ```
   GET /api/auth/authorize?
     client_id=CLIENT_ID&
     redirect_uri=REDIRECT_URI&
     response_type=code&
     scope=openid profile email
   ```

3. **Token Exchange**
   ```
   POST /api/auth/token
   {
     "grant_type": "authorization_code",
     "code": "AUTH_CODE",
     "client_id": "CLIENT_ID",
     "client_secret": "CLIENT_SECRET"
   }
   ```

4. **Access MCP**
   ```
   GET /mcp
   Authorization: Bearer ACCESS_TOKEN
   ```

## Para Wallet Flow

### New User
1. User signs up with Better Auth (email/password or OAuth)
2. Para SDK creates new wallet using user's email
3. Wallet ID stored in Better Auth user record
4. Recovery secret provided to user

### Existing User
1. User signs in with Better Auth
2. Para SDK logs in with existing wallet
3. Wallet linked to current session
4. User can access wallet features

### Code Example
```typescript
// After Better Auth sign-in
const session = await authClient.getSession();

if (session?.user?.email) {
  // Initialize Para wallet
  const walletInfo = await paraClientIntegration.initializeWallet(
    session.user.email
  );
  
  // Link to Better Auth user
  if (walletInfo) {
    await paraClientIntegration.linkWallet(
      session.user.email,
      walletInfo.walletId
    );
  }
}
```

## Testing

### Test Email/Password Auth
```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Test OIDC Discovery
```bash
curl http://localhost:3000/.well-known/openid-configuration | jq
```

### Test MCP Endpoint
```bash
# Get session token first, then:
curl http://localhost:3000/mcp \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Security Notes

1. ✅ **Secrets:** Never commit `.env` file
2. ✅ **HTTPS:** Required for production OIDC
3. ✅ **Database:** Use SSL for production database
4. ✅ **Tokens:** Rotate `BETTER_AUTH_SECRET` regularly
5. ✅ **Recovery:** Securely store Para wallet recovery secrets

## Known Limitations

1. **OIDC JWKS:** Not fully implemented (in active development)
2. **Para SDK:** Client-side implementation needed
3. **Consent Screen:** UI needs to be created
4. **Email Verification:** Optional, can be enabled

## Next Steps

- [ ] Implement Para SDK on client side
- [ ] Create sign-up page
- [ ] Add OAuth consent screen UI
- [ ] Configure additional OAuth providers (GitHub, Discord, etc.)
- [ ] Set up production database (Neon, Supabase)
- [ ] Deploy to production
- [ ] Add email verification flow
- [ ] Implement password reset
- [ ] Add 2FA support (Better Auth plugin available)

## Resources

- **Better Auth:** https://www.better-auth.com/
- **OIDC Plugin:** https://www.better-auth.com/docs/plugins/oidc-provider
- **Para Docs:** https://docs.getpara.com/
- **xMCP Docs:** https://xmcp.dev/docs
- **Generic OAuth:** https://www.better-auth.com/docs/plugins/generic-oauth

## Support

For questions or issues:
1. Check `SETUP.md` for detailed setup instructions
2. Check `MIGRATION.md` for migration details
3. Review Better Auth documentation
4. Review Para documentation

---

**Status:** ✅ Ready for development and testing
**Version:** 1.0.0
**Date:** 2025-10-25
