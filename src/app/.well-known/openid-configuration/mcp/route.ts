const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "authorization, content-type",
};

const handler = async (req: Request) => {
  const origin = new URL(req.url).origin;
  const authServerResp = await fetch(
    origin + "/.well-known/oauth-authorization-server",
    { headers: { accept: "application/json" } }
  );
  if (!authServerResp.ok) {
    return new Response("Authorization server metadata not available", {
      status: authServerResp.status,
      headers: { ...corsHeaders },
    });
  }
  const meta = (await authServerResp.json()) as any;
  const issuer = meta.issuer as string;
  const url = issuer.replace(/\/+$/, "") + "/.well-known/openid-configuration";
  const upstream = await fetch(url, { headers: { accept: "application/json" } });
  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: { "content-type": "application/json", ...corsHeaders },
  });
};
const optionsHandler = () => new Response(null, { status: 204, headers: corsHeaders });

export { handler as GET, optionsHandler as OPTIONS };
