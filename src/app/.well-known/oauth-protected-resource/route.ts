// Specify the Issuer URL of the associated Authorization Server

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "authorization, content-type",
};

const handler = async (req: Request) => {
  const origin = new URL(req.url).origin;
  const AUTHKIT_ISSUER = (process.env.AUTHKIT_BASE_URL || "").replace(/\/+$/, "");
  const body = JSON.stringify({
    resource: origin,
    authorization_servers: [AUTHKIT_ISSUER],
    bearer_methods_supported: ["header"],
  });
  return new Response(body, {
    status: 200,
    headers: { "content-type": "application/json", ...corsHeaders },
  });
};

const optionsHandler = () => new Response(null, { status: 204, headers: corsHeaders });

export { handler as GET, optionsHandler as OPTIONS };
