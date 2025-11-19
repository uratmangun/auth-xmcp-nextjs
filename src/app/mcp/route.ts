import { auth } from "@clerk/nextjs/server";
import { verifyClerkToken } from "@clerk/mcp-tools/next";
import { xmcpHandler, withAuth, VerifyToken } from "@xmcp/adapter";

/**
 * Verify the bearer token and return auth information
 * In a real implementation, this would validate against your auth service
 */
const verifyToken: VerifyToken = async (req: Request, bearerToken?: string) => {
  console.log("verifyToken called");
  console.log("Bearer token:", bearerToken ? `${bearerToken.substring(0, 10)}...` : "undefined");
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));

  if (!bearerToken) {
    console.log("No bearer token provided");
    return undefined;
  }

  try {
    // TODO: Replace with actual token verification logic
    // This is just an example implementation
    console.log("Calling auth()...");
    const clerkAuth = await auth({ acceptsToken: "oauth_token" as const });
    console.log("Clerk auth result:", JSON.stringify(clerkAuth, null, 2));
    
    console.log("Calling verifyClerkToken()...");
    const result = await verifyClerkToken(clerkAuth as any, bearerToken);
    console.log("Verification result:", result);
    return result;
  } catch (error) {
    console.error("Error in verifyToken:", error);
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
