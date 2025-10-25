import { NextResponse } from "next/server";

/**
 * OAuth 2.0 Protected Resource Metadata
 * RFC 8414 - OAuth 2.0 Authorization Server Metadata
 */
export async function GET() {
  const baseUrl = process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000";

  const metadata = {
    resource: baseUrl,
    authorization_servers: [`${baseUrl}/api/auth`],
    bearer_methods_supported: ["header"],
    resource_signing_alg_values_supported: ["RS256"],
    resource_documentation: `${baseUrl}/docs`,
    resource_policy_uri: `${baseUrl}/policy`,
    scopes_supported: ["openid", "profile", "email", "mcp:access"],
  };

  return NextResponse.json(metadata, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}
