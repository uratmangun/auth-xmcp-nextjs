# Better Auth + OIDC + Para Wallet Integration Setup

This project integrates **Better Auth** with **OIDC Provider** plugin and **Para social login wallet** for MCP authentication.

## Architecture Overview

1. **Better Auth** - Handles user authentication with email/password and social OAuth
2. **OIDC Provider Plugin** - Provides custom OIDC endpoints for MCP authentication
3. **Para Wallet Integration** - Creates/links crypto wallets based on user email

## Prerequisites

- PostgreSQL database
- Node.js 18+ or Bun
- Para API key (optional, for wallet features)

## Setup Steps

### 1. Database Setup

Create a PostgreSQL database and run the schema:

```bash
# Create database
createdb auth_xmcp

# Run schema
psql auth_xmcp < database/schema.sql
```

Or use a hosted PostgreSQL service like:
- [Neon](https://neon.tech/)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/auth_xmcp

# Better Auth (generate a secure secret)
BETTER_AUTH_SECRET=your-secret-key-min-32-chars-long
BETTER_AUTH_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_BASE_URL=http://localhost:3000
```

Optional (for social login):

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Para Wallet
NEXT_PUBLIC_PARA_API_KEY=your-para-api-key
```

### 3. Generate Better Auth Secret

```bash
# Using openssl
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Install Dependencies

```bash
bun install
```

### 5. Run Development Server

```bash
bun run dev
```

The server will start on `http://localhost:3000`

## OIDC Endpoints

Better Auth automatically provides these OIDC endpoints:

- **Discovery**: `/.well-known/openid-configuration`
- **Authorization**: `/api/auth/authorize`
- **Token**: `/api/auth/token`
- **UserInfo**: `/api/auth/userinfo`
- **JWKS**: `/.well-known/jwks.json`

## MCP Authentication Flow

1. **Client Registration**: Register your MCP client with Better Auth OIDC
2. **Authorization**: User authenticates via Better Auth
3. **Token Exchange**: MCP client exchanges code for access token
4. **API Access**: Use access token to call MCP endpoints at `/mcp`

### Register an OAuth Client

```typescript
// Client-side
const application = await authClient.oauth2.register({
  client_name: "My MCP Client",
  redirect_uris: ["http://localhost:3000/callback"],
});

// Save the client_id and client_secret
console.log(application.clientId);
console.log(application.clientSecret);
```

### Authorization Flow

```
1. Redirect user to:
   /api/auth/authorize?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&response_type=code&scope=openid profile email

2. User signs in and grants consent

3. Redirect back with code:
   REDIRECT_URI?code=AUTH_CODE

4. Exchange code for token:
   POST /api/auth/token
   {
     "grant_type": "authorization_code",
     "code": "AUTH_CODE",
     "client_id": "CLIENT_ID",
     "client_secret": "CLIENT_SECRET",
     "redirect_uri": "REDIRECT_URI"
   }

5. Use access_token to call MCP:
   GET /mcp
   Authorization: Bearer ACCESS_TOKEN
```

## Para Wallet Integration

After Better Auth authentication, integrate Para wallet:

### Client-Side Integration

```typescript
import { authClient } from "@/lib/auth-client";
import { paraClientIntegration } from "@/lib/para-integration";

// 1. Sign in with Better Auth
const session = await authClient.signIn.email({
  email: "user@example.com",
  password: "password",
});

// 2. Initialize Para wallet
if (session.user.email) {
  const walletInfo = await paraClientIntegration.initializeWallet(
    session.user.email
  );
  
  if (walletInfo) {
    // 3. Link wallet to Better Auth user
    await paraClientIntegration.linkWallet(
      session.user.email,
      walletInfo.walletId
    );
  }
}
```

### Para Wallet Flow

1. **New User**: 
   - Better Auth creates user account
   - Para creates new wallet with email
   - Wallet ID stored in Better Auth user record

2. **Existing User**:
   - Better Auth authenticates user
   - Para logs in with existing wallet
   - Wallet linked to session

## Social OAuth + Para

For social login with wallet creation:

```typescript
// 1. Sign in with Google (or other provider)
await authClient.signIn.social({
  provider: "google",
  callbackURL: "/auth/callback",
});

// 2. After OAuth callback, initialize Para wallet
// (Same as email flow above)
```

## Testing

### Test Email/Password Auth

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Test OIDC Discovery

```bash
curl http://localhost:3000/.well-known/openid-configuration
```

### Test MCP Endpoint

```bash
# First get a session token, then:
curl http://localhost:3000/mcp \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...all]/route.ts      # Better Auth handler
│   │       └── link-para-wallet/route.ts  # Para integration
│   └── mcp/
│       └── route.ts                    # MCP endpoint with auth
├── lib/
│   ├── auth.ts                         # Better Auth config
│   ├── auth-client.ts                  # Better Auth client
│   └── para-integration.ts             # Para wallet bridge
└── middleware.ts                       # Auth middleware

database/
└── schema.sql                          # PostgreSQL schema
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### OIDC Discovery Not Working

- Ensure `BETTER_AUTH_BASE_URL` matches your actual URL
- Check that Better Auth routes are mounted at `/api/auth`

### Para Wallet Integration

- Verify `NEXT_PUBLIC_PARA_API_KEY` is set
- Check browser console for Para SDK errors
- Ensure email is available from Better Auth session

## Security Notes

1. **Never commit `.env`** - Keep secrets secure
2. **Use HTTPS in production** - Required for OIDC
3. **Rotate secrets regularly** - Especially `BETTER_AUTH_SECRET`
4. **Store recovery secrets securely** - Para wallet recovery

## Next Steps

1. Create sign-in/sign-up UI pages
2. Implement Para SDK on client
3. Add consent screen for OIDC
4. Configure additional OAuth providers
5. Set up production database

## Resources

- [Better Auth Docs](https://www.better-auth.com/)
- [OIDC Provider Plugin](https://www.better-auth.com/docs/plugins/oidc-provider)
- [Para Docs](https://docs.getpara.com/)
- [xMCP Docs](https://xmcp.dev/docs)
