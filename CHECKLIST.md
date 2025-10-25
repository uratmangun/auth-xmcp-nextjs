# ✅ Setup Checklist

Use this checklist to set up your Better Auth + OIDC + Para wallet integration.

## 📋 Pre-Setup

- [ ] PostgreSQL installed
- [ ] Bun installed
- [ ] Git repository cloned
- [ ] Code editor ready

## 🗄️ Database Setup

- [ ] PostgreSQL service running
- [ ] Database created: `createdb auth_xmcp`
- [ ] Schema applied: `psql auth_xmcp < database/schema.sql`
- [ ] Database connection tested
- [ ] Alternative: Use managed service (Neon/Supabase)

## 🔧 Configuration

- [ ] `.env` file created from `.env.example`
- [ ] `DATABASE_URL` configured
- [ ] `BETTER_AUTH_SECRET` generated (min 32 chars)
- [ ] `BETTER_AUTH_BASE_URL` set
- [ ] `NEXT_PUBLIC_BETTER_AUTH_BASE_URL` set

### Optional: Social OAuth
- [ ] Google OAuth app created
- [ ] `GOOGLE_CLIENT_ID` configured
- [ ] `GOOGLE_CLIENT_SECRET` configured
- [ ] Redirect URI added: `http://localhost:3000/api/auth/callback/google`

### Optional: Para Wallet
- [ ] Para account created
- [ ] `NEXT_PUBLIC_PARA_API_KEY` configured
- [ ] `PARA_CLIENT_ID` configured (if using OAuth)
- [ ] `PARA_CLIENT_SECRET` configured (if using OAuth)

## 📦 Dependencies

- [ ] Run: `bun install`
- [ ] Verify: `better-auth` installed
- [ ] Verify: `pg` installed
- [ ] Verify: `@types/pg` installed

## 🧪 Testing

### Basic Tests
- [ ] Dev server starts: `bun run dev`
- [ ] App loads: `http://localhost:3000`
- [ ] Sign-in page loads: `http://localhost:3000/sign-in`

### OIDC Tests
- [ ] Discovery endpoint: `curl http://localhost:3000/.well-known/openid-configuration`
- [ ] Protected resource metadata: `curl http://localhost:3000/.well-known/oauth-protected-resource`
- [ ] Auth API responds: `curl http://localhost:3000/api/auth`

### Authentication Tests
- [ ] Email/password sign-up works
- [ ] Email/password sign-in works
- [ ] Session persists across page reloads
- [ ] Sign-out works
- [ ] Google OAuth works (if configured)

### MCP Tests
- [ ] OAuth client registration works
- [ ] Authorization flow works
- [ ] Token exchange works
- [ ] MCP endpoint accessible with token
- [ ] MCP endpoint rejects invalid tokens

### Para Tests (if configured)
- [ ] Para SDK loads on client
- [ ] Wallet initialization works
- [ ] Wallet linking works
- [ ] Wallet info stored in user record

## 🚀 Production Readiness

### Security
- [ ] HTTPS enabled
- [ ] Strong `BETTER_AUTH_SECRET` (32+ chars)
- [ ] Database SSL enabled
- [ ] CORS policies configured
- [ ] Rate limiting configured
- [ ] Secrets not committed to git

### Database
- [ ] Production database set up
- [ ] Database backups configured
- [ ] Connection pooling configured
- [ ] Indexes verified
- [ ] Migration strategy defined

### Deployment
- [ ] Environment variables set in hosting platform
- [ ] Build succeeds: `bun run build`
- [ ] Production URL configured
- [ ] OAuth redirect URIs updated
- [ ] DNS configured
- [ ] SSL certificate valid

### Monitoring
- [ ] Error logging configured
- [ ] Performance monitoring set up
- [ ] Database monitoring enabled
- [ ] Uptime monitoring configured

## 📝 Documentation

- [ ] `README.md` reviewed
- [ ] `SETUP.md` followed
- [ ] `MIGRATION.md` reviewed (if migrating)
- [ ] `CHANGES.md` reviewed
- [ ] Team onboarded

## 🎯 Feature Completion

### Core Features
- [x] Better Auth integration
- [x] OIDC Provider plugin
- [x] PostgreSQL database
- [x] MCP authentication
- [x] Token verification
- [x] Session management

### Optional Features
- [ ] Para wallet integration (client-side)
- [ ] Sign-up page
- [ ] OAuth consent screen
- [ ] Email verification
- [ ] Password reset
- [ ] 2FA support
- [ ] Additional OAuth providers

## 🔄 Next Steps

### Immediate (Required)
1. [ ] Complete database setup
2. [ ] Configure environment variables
3. [ ] Test authentication flow
4. [ ] Verify OIDC endpoints

### Short-term (Recommended)
1. [ ] Implement Para SDK on client
2. [ ] Create sign-up page
3. [ ] Add consent screen UI
4. [ ] Configure additional OAuth providers

### Long-term (Optional)
1. [ ] Set up production database
2. [ ] Deploy to production
3. [ ] Add email verification
4. [ ] Implement 2FA
5. [ ] Add monitoring and analytics

## ❓ Troubleshooting

If you encounter issues, check:

- [ ] Database connection string correct
- [ ] PostgreSQL service running
- [ ] All environment variables set
- [ ] Dependencies installed correctly
- [ ] Port 3000 not in use
- [ ] Node.js/Bun version compatible

See `SETUP.md` for detailed troubleshooting.

## 📚 Resources

- [ ] [Better Auth Docs](https://www.better-auth.com/)
- [ ] [OIDC Provider Plugin](https://www.better-auth.com/docs/plugins/oidc-provider)
- [ ] [Para Docs](https://docs.getpara.com/)
- [ ] [xMCP Docs](https://xmcp.dev/docs)
- [ ] [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Progress:** _____ / _____ items completed

**Status:** 
- [ ] Not started
- [ ] In progress
- [ ] Completed
- [ ] Production ready

**Notes:**
_Add any notes or issues here_
