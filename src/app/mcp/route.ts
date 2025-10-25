import { auth } from "@/lib/auth";
import { xmcpHandler, withAuth, VerifyToken } from "@xmcp/adapter";
import { headers } from "next/headers";

/**
 * Verify the bearer token using Better Auth
 * This validates the OAuth token against Better Auth's OIDC provider
 */
const verifyToken: VerifyToken = async (req: Request, bearerToken?: string) => {
  if (!bearerToken) return undefined;

  try {
    // Use Better Auth to verify the session token
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return undefined;
    }

    // Return user information in the format expected by xmcp
    return {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      sessionId: session.session.id,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return undefined;
  }
};

const options = {
  verifyToken,
  required: true,
  resourceMetadataPath: "/.well-known/oauth-protected-resource",
};

const handler = withAuth(xmcpHandler, options);

export { handler as GET, handler as POST };
