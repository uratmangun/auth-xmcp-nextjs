# Auth XMCP Next.js

A Next.js 15 application that integrates [Better Auth](https://www.better-auth.com/) with OIDC Provider plugin and [Para](https://getpara.com/) social login wallet to expose OAuth-protected MCP endpoints. Features custom OIDC provider, dynamic client registration, and seamless crypto wallet integration.

## Table of Contents
- [Getting Started](#getting-started)
- [Project Scripts](#project-scripts)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Configuration](#configuration)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Quick Start
1. **Clone**: `git clone https://github.com/uratmangun/auth-xmcp-nextjs.git`
2. **Install dependencies**: `bun install`
3. **Set up database**: `./scripts/setup-db.sh`
4. **Configure environment**: Copy `.env.example` to `.env` and fill in required values
5. **Generate secret**: `openssl rand -base64 32`
6. **Start dev server**: `bun run dev`

📖 **See [SETUP.md](./SETUP.md) for detailed setup instructions**

## Project Scripts
- **Start dev server**: `bun run dev`
- **Build for production**: `bun run build`
- **Start production server**: `bun run start`
- **Run lint checks**: `bun run lint`

## Project Structure
```
.
├── database/
│   └── schema.sql            # PostgreSQL schema for Better Auth
├── scripts/
│   └── setup-db.sh           # Database setup script
├── src/
│   ├── app/
│   │   ├── api/auth/
│   │   │   ├── [...all]/route.ts        # Better Auth API handler
│   │   │   └── link-para-wallet/route.ts # Para wallet linking
│   │   ├── mcp/route.ts      # MCP handler with Better Auth
│   │   ├── sign-in/page.tsx  # Sign-in page example
│   │   └── .well-known/      # OIDC discovery endpoints
│   ├── lib/
│   │   ├── auth.ts           # Better Auth server config
│   │   ├── auth-client.ts    # Better Auth client
│   │   └── para-integration.ts # Para wallet bridge
│   ├── middleware.ts         # Auth middleware
│   ├── prompts/              # XMCP prompt definitions
│   ├── resources/            # XMCP resource resolvers
│   └── tools/                # XMCP tool implementations
├── SETUP.md                  # Comprehensive setup guide
├── MIGRATION.md              # Migration from Clerk guide
├── CHANGES.md                # Detailed changelog
├── xmcp.config.ts            # XMCP runtime configuration
└── package.json              # Scripts and dependencies
```

## Key Features

### 🔐 Authentication
- **Better Auth** - Full-featured authentication framework
- **OIDC Provider** - Act as your own OpenID Connect provider
- **Email/Password** - Traditional authentication
- **Social OAuth** - Google, and more (extensible)
- **Session Management** - Database-backed sessions with full control

### 🌐 OIDC Provider
- **Dynamic Client Registration** - RFC 7591 compliant
- **Authorization Code Flow** - OAuth 2.0 standard flow
- **Token Management** - Access tokens + refresh tokens
- **UserInfo Endpoint** - Standard OIDC user information
- **JWKS Endpoint** - Public key discovery (in development)
- **Consent Screens** - User authorization flow

### 💰 Para Wallet Integration
- **Automatic Wallet Creation** - Create crypto wallets on sign-up
- **Email-Based Linking** - Link wallets via user email
- **Social OAuth + Wallet** - Combined authentication and wallet flow
- **Multi-Chain Support** - EVM, Solana, Cosmos

### 🔧 MCP Integration
- **OAuth-Protected Endpoints** - Secure MCP tools, resources, and prompts
- **Bearer Token Authentication** - Standard OAuth 2.0 bearer tokens
- **Discovery Metadata** - RFC 8414 compliant metadata endpoints
- **XMCP Adapter** - Seamless integration with XMCP framework

## Technologies Used
- **Next.js 15** - App Router, Turbopack dev server
- **React 19** - Latest React features
- **Better Auth** - Authentication framework with OIDC Provider plugin
- **PostgreSQL** - Database for auth data (users, sessions, tokens)
- **Para** - Social login wallet integration
- **XMCP** - Model Context Protocol adapter
- **Bun** - Fast package manager and runtime
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

## Configuration

Create `.env` using the provided `.env.example` template:

### Required
```env
DATABASE_URL=postgresql://user:password@localhost:5432/auth_xmcp
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_BASE_URL=http://localhost:3000
```

### Optional (Social OAuth)
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Optional (Para Wallet)
```env
NEXT_PUBLIC_PARA_API_KEY=your-para-api-key
PARA_CLIENT_ID=your-para-client-id
PARA_CLIENT_SECRET=your-para-client-secret
```

📖 **See [SETUP.md](./SETUP.md) for detailed configuration**

## Usage

### Local Development
```bash
bun run dev
```
Runs XMCP dev server alongside Next.js. Visit `http://localhost:3000`

### OIDC Endpoints
- **Discovery**: `/.well-known/openid-configuration`
- **Authorization**: `/api/auth/authorize`
- **Token**: `/api/auth/token`
- **UserInfo**: `/api/auth/userinfo`
- **JWKS**: `/.well-known/jwks.json`
- **Register Client**: `/api/auth/oauth2/register`

### MCP Authentication Flow

1. **Register OAuth Client**
```typescript
const app = await authClient.oauth2.register({
  client_name: "My MCP Client",
  redirect_uris: ["http://localhost:3000/callback"],
});
```

2. **Get Authorization Code**
```
GET /api/auth/authorize?
  client_id=CLIENT_ID&
  redirect_uri=REDIRECT_URI&
  response_type=code&
  scope=openid profile email
```

3. **Exchange for Access Token**
```bash
curl -X POST http://localhost:3000/api/auth/token \
  -d "grant_type=authorization_code" \
  -d "code=AUTH_CODE" \
  -d "client_id=CLIENT_ID" \
  -d "client_secret=CLIENT_SECRET"
```

4. **Access MCP Endpoint**
```bash
curl http://localhost:3000/mcp \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Para Wallet Integration

```typescript
// After Better Auth sign-in
const session = await authClient.getSession();

if (session?.user?.email) {
  // Initialize Para wallet
  const walletInfo = await paraClientIntegration.initializeWallet(
    session.user.email
  );
  
  // Link to user
  if (walletInfo) {
    await paraClientIntegration.linkWallet(
      session.user.email,
      walletInfo.walletId
    );
  }
}
```

📖 **See [SETUP.md](./SETUP.md) for complete usage examples**

## Deployment

### Vercel
1. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_BASE_URL`
   - `NEXT_PUBLIC_BETTER_AUTH_BASE_URL`
   - Optional: OAuth provider credentials

2. **Deploy**:
```bash
vc deploy --prod
```

### Database
Use a managed PostgreSQL service:
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Railway](https://railway.app/) - Simple deployment platform

### Security Checklist
- ✅ Use HTTPS in production (required for OIDC)
- ✅ Rotate `BETTER_AUTH_SECRET` regularly
- ✅ Enable database SSL
- ✅ Set secure CORS policies
- ✅ Store Para recovery secrets securely

## Contributing
Pull requests and issues are welcome. Please open a ticket describing proposed changes before submitting large contributions.

## License
No license has been specified yet. Add one (e.g., `LICENSE`) if you plan to distribute or open-source modifications.
