<<<<<<< ours
# WorkOS AuthKit MCP Integration Setup

## ✅ Environment Variables Configured

I've successfully extracted and configured all necessary WorkOS environment variables from your dashboard.

### Created Files

1. **`.env`** - Your actual environment variables (already created)
2. **`.env.example`** - Template for other developers

### Environment Variables

```bash
# WorkOS API Credentials
WORKOS_CLIENT_ID=client_01K7JMAHCN47TBRE7GNDF903DR
WORKOS_API_KEY=sk_test_YOUR_WORKOS_API_KEY_HERE

# AuthKit Configuration (for MCP OAuth)
AUTHKIT_BASE_URL=https://funny-lake-85-staging.authkit.app
```

## 🎯 What Was Done

1. **Extracted from WorkOS Dashboard:**
   - Client ID from the "Get Started" page
   - API Key from the "Get Started" page
   - AuthKit domain from the "Domains" page: `funny-lake-85-staging.authkit.app`

2. **Created `.env` file** with all necessary variables

3. **Updated `.env.example`** with proper structure and comments

4. **Verified the setup:**
   - ✅ Build completed successfully
   - ✅ AuthKit endpoint is reachable and responding correctly

## 🔧 Next Steps

### 1. Enable Dynamic Client Registration (Required for MCP)

Go to your WorkOS Dashboard:
- Navigate to **Applications** → **Configuration**
- Enable **"Dynamic Client Registration"**

This is required by the MCP protocol to allow clients to self-register.

### 2. Test Your MCP Endpoints

Start your dev server:
```bash
bun dev
```

Then test the endpoints:

```bash
# Test OAuth Protected Resource metadata
curl -s http://localhost:3000/.well-known/oauth-protected-resource | jq

# Test Authorization Server metadata (proxied from AuthKit)
curl -s http://localhost:3000/.well-known/oauth-authorization-server | jq

# Test OpenID Configuration
curl -s http://localhost:3000/.well-known/openid-configuration | jq
```

### 3. Configure Redirect URIs

In WorkOS Dashboard → **Redirects**:
- Add your application's callback URLs
- Example: `http://localhost:3000/callback` for local development

## 📝 Important Notes

- **Environment**: Currently using **Staging** environment
- **AuthKit Domain**: `funny-lake-85-staging.authkit.app`
- **API Keys**: Test keys (prefix `sk_test_`)
- **Clerk**: Legacy Clerk variables are still in `.env` but can be removed once fully migrated

## 🔐 Security

- ⚠️ Never commit `.env` to version control (already in `.gitignore`)
- ✅ `.env.example` is safe to commit (no actual secrets)
- 🔒 API keys shown are test keys for staging environment

## 🚀 Deployment

For production:
1. Switch to **Production** environment in WorkOS Dashboard
2. Get production API keys and AuthKit domain
3. Update environment variables in your hosting platform
4. Enable Dynamic Client Registration in production

## 📚 Resources

- [WorkOS MCP Documentation](https://workos.com/docs/authkit/mcp)
- [WorkOS Dashboard](https://dashboard.workos.com)
- [MCP Specification](https://modelcontextprotocol.io/)
|||||||
=======
# WorkOS AuthKit MCP Integration Setup

## ✅ Environment Variables Configured

I've successfully extracted and configured all necessary WorkOS environment variables from your dashboard.

### Created Files

1. **`.env`** - Your actual environment variables (already created)
2. **`.env.example`** - Template for other developers

### Environment Variables

```bash
# WorkOS API Credentials
WORKOS_CLIENT_ID=client_das
WORKOS_API_KEY=sk_test_YOUR_WORKOS_API_KEY_HERE

# AuthKit Configuration (for MCP OAuth)
AUTHKIT_BASE_URL=https://funny-lake-85-staging.authkit.app
```

## 🎯 What Was Done

1. **Extracted from WorkOS Dashboard:**
   - Client ID from the "Get Started" page
   - API Key from the "Get Started" page
   - AuthKit domain from the "Domains" page: `funny-lake-85-staging.authkit.app`

2. **Created `.env` file** with all necessary variables

3. **Updated `.env.example`** with proper structure and comments

4. **Verified the setup:**
   - ✅ Build completed successfully
   - ✅ AuthKit endpoint is reachable and responding correctly

## 🔧 Next Steps

### 1. Enable Dynamic Client Registration (Required for MCP)

Go to your WorkOS Dashboard:
- Navigate to **Applications** → **Configuration**
- Enable **"Dynamic Client Registration"**

This is required by the MCP protocol to allow clients to self-register.

### 2. Test Your MCP Endpoints

Start your dev server:
```bash
bun dev
```

Then test the endpoints:

```bash
# Test OAuth Protected Resource metadata
curl -s http://localhost:3000/.well-known/oauth-protected-resource | jq

# Test Authorization Server metadata (proxied from AuthKit)
curl -s http://localhost:3000/.well-known/oauth-authorization-server | jq

# Test OpenID Configuration
curl -s http://localhost:3000/.well-known/openid-configuration | jq
```

### 3. Configure Redirect URIs

In WorkOS Dashboard → **Redirects**:
- Add your application's callback URLs
- Example: `http://localhost:3000/callback` for local development

## 📝 Important Notes

- **Environment**: Currently using **Staging** environment
- **AuthKit Domain**: `funny-lake-85-staging.authkit.app`
- **API Keys**: Test keys (prefix `sk_test_`)
- **Clerk**: Legacy Clerk variables are still in `.env` but can be removed once fully migrated

## 🔐 Security

- ⚠️ Never commit `.env` to version control (already in `.gitignore`)
- ✅ `.env.example` is safe to commit (no actual secrets)
- 🔒 API keys shown are test keys for staging environment

## 🚀 Deployment

For production:
1. Switch to **Production** environment in WorkOS Dashboard
2. Get production API keys and AuthKit domain
3. Update environment variables in your hosting platform
4. Enable Dynamic Client Registration in production

## 📚 Resources

- [WorkOS MCP Documentation](https://workos.com/docs/authkit/mcp)
- [WorkOS Dashboard](https://dashboard.workos.com)
- [MCP Specification](https://modelcontextprotocol.io/)
>>>>>>> theirs
