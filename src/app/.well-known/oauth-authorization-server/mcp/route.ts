const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "authorization, content-type",
};

const handler = async (_req: Request) => {
  const AUTHKIT_ISSUER = (process.env.AUTHKIT_BASE_URL || "").replace(/\/+$/, "");
  if (!AUTHKIT_ISSUER) {
    return new Response("AuthKit issuer not configured", {
      status: 500,
      headers: { ...corsHeaders },
    });
  }
  const upstream = await fetch(
    `${AUTHKIT_ISSUER}/.well-known/oauth-authorization-server`,
    { headers: { accept: "application/json" } }
  );
  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: { "content-type": "application/json", ...corsHeaders },
  });
};

const optionsHandler = () => new Response(null, { status: 204, headers: corsHeaders });

export { handler as GET, optionsHandler as OPTIONS };
