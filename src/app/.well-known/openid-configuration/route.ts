import { NextResponse } from "next/server";

/**
 * OpenID Connect Discovery
 * Proxies to Better Auth's native OIDC configuration
 */
export async function GET(request: Request) {
  const baseUrl = process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000";
  
  try {
    // Fetch Better Auth's native OIDC configuration
    const response = await fetch(`${baseUrl}/api/auth/.well-known/openid-configuration`, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Better Auth OIDC config returned ${response.status}`);
    }

    const metadata = await response.json();

    return NextResponse.json(metadata, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
      },
    });
  } catch (error) {
    console.error("Failed to fetch Better Auth OIDC config:", error);
    return NextResponse.json(
      { error: "Failed to fetch OIDC configuration" },
      { status: 500 }
    );
  }
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
