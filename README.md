# Auth XMCP - Next.js

A secure Next.js application that provides OAuth-protected Model Context Protocol (MCP) endpoints using Auth0 authentication. This project demonstrates how to build a modern MCP server with enterprise-grade security and Next.js integration.

## 🌟 Features

- **🔐 OAuth Authentication**: Secure MCP endpoints with Auth0 integration
- **🚀 MCP Server**: Full-featured Model Context Protocol server with tools, resources, and prompts
- **⚡ Next.js 15**: Built with the latest Next.js features including Turbopack
- **🎨 Modern UI**: Clean interface with TailwindCSS and dark mode support
- **🔧 TypeScript**: Full type safety throughout the application
- **📱 Responsive**: Works seamlessly across all device sizes
- **🛡️ JWT Verification**: Robust token validation with JWKS support

## 🛠️ Technologies Used

- **Framework**: Next.js 15.5.2
- **Runtime**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Styling**: TailwindCSS 4.1.14
- **Authentication**: Auth0 NextJS SDK 4.10.0
- **MCP**: XMCP 0.3.2 with Next.js adapter
- **Validation**: Zod 3.24.4
- **JWT**: jose 5.10.0
- **Package Manager**: Bun (with lock file)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18 or higher)
- Bun package manager
- Auth0 account and application setup

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auth-xmcp-nextjs
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Auth0 Configuration
   AUTH0_SECRET=your-auth0-secret
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_AUDIENCE=your-api-identifier
   AUTH0_SCOPE=openid profile email

   # Optional: App Configuration
   APP_BASE_URL=http://localhost:3000

   # Debug (optional)
   DEBUG_MCP_AUTH=true
   ```

4. **Start the development server**
   ```bash
   bun run dev
   ```

The application will be available at `http://localhost:3000`, and the MCP endpoint will be accessible at `http://localhost:3000/mcp`.

## 🏗️ Project Structure

```
auth-xmcp-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── mcp/               # MCP endpoint route
│   │   ├── .well-known/       # OAuth discovery endpoint
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── lib/                   # Utility libraries
│   ├── tools/                 # MCP Tools
│   │   └── greet.ts          # Example greeting tool
│   ├── resources/             # MCP Resources
│   │   ├── (config)/         # Configuration resources
│   │   └── (users)/          # User-related resources
│   ├── prompts/              # MCP Prompts
│   │   └── review-code.ts    # Code review prompt
│   └── middleware.ts         # Auth0 middleware
├── public/                   # Static assets
├── xmcp.config.ts           # XMCP configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 🔧 Configuration

### Auth0 Setup

1. **Create an Auth0 Application**
   - Go to your Auth0 Dashboard
   - Create a new Single Page Application
   - Configure the allowed callback URLs: `http://localhost:3000/api/auth/callback`
   - Configure the allowed logout URLs: `http://localhost:3000`

2. **Create an Auth0 API**
   - Create a new API in your Auth0 Dashboard
   - Use the identifier as your `AUTH0_AUDIENCE`
   - Enable RBAC if needed

3. **Update Environment Variables**
   - Copy the values from your Auth0 application to your `.env.local` file

### XMCP Configuration

The XMCP configuration is defined in `xmcp.config.ts`:

```typescript
import { XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  http: true,
  experimental: {
    adapter: "nextjs",
  },
};

export default config;
```

## 🎯 Usage

### Accessing the MCP Endpoint

1. Visit `http://localhost:3000` to see the application
2. The MCP endpoint URL will be displayed on the homepage
3. Click "Copy" to copy the endpoint URL to your clipboard
4. Use this endpoint in your MCP client applications

### Authentication Flow

1. MCP clients must include a valid JWT token in the `Authorization` header
2. Tokens are validated against your Auth0 configuration
3. The middleware protects all routes except the MCP endpoint and static assets
4. Invalid or missing tokens will result in authentication errors

### Available MCP Components

#### Tools
- **greet**: A simple greeting tool that demonstrates parameter handling

#### Resources
- **app-config**: Application configuration data
- **user resources**: User-related resource handlers

#### Prompts
- **review-code**: Code review prompt for analyzing code quality

## 🧪 Development

### Adding New Tools

Create a new file in `src/tools/` following this pattern:

```typescript
import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

export const schema = {
  // Define your parameters here
};

export const metadata: ToolMetadata = {
  name: "your-tool-name",
  description: "Tool description",
  // ... other metadata
};

export default async function yourTool({ params }: InferSchema<typeof schema>) {
  // Tool implementation
  return {
    content: [{ type: "text", text: result }],
  };
}
```

### Adding New Resources

Create a new file in `src/resources/` with the appropriate grouping:

```typescript
import { type ResourceMetadata } from "xmcp";

export const metadata: ResourceMetadata = {
  name: "resource-name",
  title: "Resource Title",
  description: "Resource description",
};

export default function handler() {
  return "Resource data";
}
```

### Adding New Prompts

Create a new file in `src/prompts/`:

```typescript
import { z } from "zod";
import { type InferSchema, type PromptMetadata } from "xmcp";

export const schema = {
  // Define parameters
};

export const metadata: PromptMetadata = {
  name: "prompt-name",
  title: "Prompt Title",
  description: "Prompt description",
  role: "user",
};

export default function promptFunction({ params }: InferSchema<typeof schema>) {
  return `Your prompt template`;
}
```

## 🏗️ Build and Deployment

### Build for Production

```bash
bun run build
```

### Start Production Server

```bash
bun run start
```

### Linting

```bash
bun run lint
```

## 🔒 Security Considerations

- Always use HTTPS in production
- Keep your Auth0 secrets secure and never commit them to version control
- Regularly rotate your Auth0 client secrets
- Configure appropriate CORS policies for your domain
- Set up proper audience validation for your API
- Use environment-specific configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Zod for schema validation
- Add proper error handling
- Include tests for new features
- Follow the existing code style
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [XMCP](https://github.com/modelcontextprotocol/typescript-sdk) - TypeScript SDK for Model Context Protocol
- [Auth0](https://auth0.com) - Authentication and authorization platform
- [Next.js](https://nextjs.org) - React framework for production
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Review the Auth0 documentation
3. Check the XMCP documentation
4. Create a new issue with detailed information

---

Built with ❤️ using Next.js, XMCP, and Auth0
