import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function safeReturnPath(value: string | undefined) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

function clearTemporaryCookies(response: NextResponse) {
  for (const name of ["keycloak_pkce_verifier", "keycloak_oauth_state", "keycloak_return_path", "keycloak_redirect_uri"]) response.cookies.delete(name);
}

function loginError(request: NextRequest, status?: number) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("authError", "keycloak");
  if (status) loginUrl.searchParams.set("status", String(status));
  const response = NextResponse.redirect(loginUrl);
  clearTemporaryCookies(response);
  return response;
}

export async function GET(request: NextRequest) {
  const issuer = process.env.KEYCLOAK_CLIENT_ISSUER ?? process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
  const clientId = process.env.KEYCLOAK_CLIENT_ID ?? process.env.KEYCLOAK_WEB_CLIENT_ID ?? "istash-client";
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET ?? process.env.KEYCLOAK_WEB_CLIENT_SECRET;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get("keycloak_oauth_state")?.value;
  const verifier = request.cookies.get("keycloak_pkce_verifier")?.value;
  const redirectUri = request.cookies.get("keycloak_redirect_uri")?.value;

  if (!issuer || !clientId || !code || !state || state !== expectedState || !verifier || !redirectUri) return loginError(request);

  const body = new URLSearchParams({ grant_type: "authorization_code", client_id: clientId, code, redirect_uri: redirectUri, code_verifier: verifier });
  if (clientSecret) body.set("client_secret", clientSecret);

  try {
    const tokenResponse = await fetch(`${issuer.replace(/\/$/, "")}/protocol/openid-connect/token`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }, body, cache: "no-store" });
    if (!tokenResponse.ok) {
      // Log the provider response for local diagnosis. OAuth tokens and secrets
      // are deliberately never included in this log.
      const error = await tokenResponse.text();
      console.error("Keycloak token exchange failed", { status: tokenResponse.status, error: error.slice(0, 500) });
      return loginError(request, tokenResponse.status);
    }
    const tokens = (await tokenResponse.json()) as { access_token?: string; refresh_token?: string; id_token?: string; expires_in?: number };
    if (!tokens.access_token) return loginError(request);

    const returnPath = safeReturnPath(request.cookies.get("keycloak_return_path")?.value);
    const payload = JSON.stringify({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token, idToken: tokens.id_token, returnPath }).replace(/</g, "\\u003c");
    const html = `<!doctype html><html><head><title>Signing in…</title></head><body>
<p style="font-family:sans-serif;padding:24px;text-align:center;color:#003377;font-weight:bold;">Completing sign in to iStash Admin...</p>
<script>
  try {
    const auth = ${payload};
    if (auth.accessToken) {
      localStorage.setItem('accessToken', auth.accessToken);
      localStorage.setItem('token', auth.accessToken);
    }
    if (auth.refreshToken) localStorage.setItem('refreshToken', auth.refreshToken);
    if (auth.idToken) localStorage.setItem('idToken', auth.idToken);
  } catch (err) {
    console.error('[Auth Error] Failed to store tokens:', err);
  }
  setTimeout(() => { location.replace(${JSON.stringify(returnPath)}); }, 150);
</script>
</body></html>`;
    const response = new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    response.cookies.set("accessToken", tokens.access_token, {
      httpOnly: false,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
      path: "/",
      maxAge: tokens.expires_in ?? 3600,
    });
    response.cookies.set("istash_session", "1", { httpOnly: true, sameSite: "lax", secure: request.nextUrl.protocol === "https:", path: "/", maxAge: tokens.expires_in ?? 3600 });
    clearTemporaryCookies(response);
    return response;
  } catch {
    return loginError(request);
  }
}
