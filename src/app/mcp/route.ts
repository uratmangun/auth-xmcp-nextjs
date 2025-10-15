import { createRemoteJWKSet, jwtVerify } from "jose";
import { xmcpHandler, withAuth, VerifyToken } from "@xmcp/adapter";

/**
 * Verify the bearer token and return auth information
 * In a real implementation, this would validate against your auth service
 */
const AUTHKIT_ISSUER = (process.env.AUTHKIT_BASE_URL || "").replace(/\/+$/, "");
const JWKS = createRemoteJWKSet(new URL(`${AUTHKIT_ISSUER}/oauth2/jwks`));

const verifyToken: VerifyToken = async (_req: Request, bearerToken?: string) => {
  if (!bearerToken) return undefined;
  try {
    const { payload } = await jwtVerify(bearerToken, JWKS, {
      issuer: AUTHKIT_ISSUER,
    });
    return payload as any;
  } catch {
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
