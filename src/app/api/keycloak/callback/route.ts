import { NextRequest, NextResponse } from "next/server";
import {
  CLIENT_ID_COOKIE,
  REDIRECT_URI_COOKIE,
  RETURN_PATH_COOKIE,
  STATE_COOKIE,
  VERIFIER_COOKIE,
  resolveKeycloakConfig,
  safeReturnPath,
} from "@/lib/auth/keycloak-config";

export const dynamic = "force-dynamic";

function clearTemporaryCookies(response: NextResponse) {
  for (const name of [
    VERIFIER_COOKIE,
    STATE_COOKIE,
    RETURN_PATH_COOKIE,
    REDIRECT_URI_COOKIE,
    CLIENT_ID_COOKIE,
  ]) {
    response.cookies.delete(name);
  }
}

function loginError(request: NextRequest, status?: number, reason: string = "keycloak", idToken?: string, activeClientId?: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("authError", reason);
  if (status) loginUrl.searchParams.set("status", String(status));

  // If rejected due to lack of admin privileges, terminate the Keycloak SSO session
  // so the user is not trapped in an auto-login loop with the non-admin account.
  if (reason === "unauthorized" || status === 403) {
    const config = resolveKeycloakConfig(request);
    const issuer = config.issuer;
    const clientId = activeClientId ?? config.clientId;

    if (issuer) {
      const logoutUrl = new URL(`${issuer}/protocol/openid-connect/logout`);
      logoutUrl.searchParams.set("client_id", clientId);
      logoutUrl.searchParams.set("post_logout_redirect_uri", loginUrl.toString());
      if (idToken) logoutUrl.searchParams.set("id_token_hint", idToken);
      const response = NextResponse.redirect(logoutUrl);
      response.cookies.delete("istash_session");
      response.cookies.delete("accessToken");
      clearTemporaryCookies(response);
      return response;
    }
  }

  const response = NextResponse.redirect(loginUrl);
  clearTemporaryCookies(response);
  return response;
}

function hasAdminRole(accessToken: string): boolean {
  try {
    const parts = accessToken.split(".");
    if (parts.length < 2) return false;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
    const realmRoles = (decoded.realm_access?.roles || []).map((r: unknown) => String(r).toUpperCase());
    const clientRoles = Object.values(decoded.resource_access || {})
      .flatMap((r: any) => ((r?.roles || []) as unknown[]))
      .map((r: unknown) => String(r).toUpperCase());
    const allRoles = [...realmRoles, ...clientRoles];
    return (
      allRoles.includes("ADMIN") ||
      allRoles.includes("ADMINISTRATOR") ||
      allRoles.includes("SUPER_ADMIN") ||
      allRoles.includes("MANAGE-USERS")
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const config = resolveKeycloakConfig(request);
  const cookieClientId = request.cookies.get(CLIENT_ID_COOKIE)?.value;
  const clientId = cookieClientId || config.clientId;
  const clientSecret =
    clientId === "istash-client"
      ? (process.env.KEYCLOAK_LOCAL_CLIENT_SECRET ?? "3myEb9EFPZAi2wyrbGmFdH9A391299GC")
      : (process.env.KEYCLOAK_CLIENT_SECRET ?? config.clientSecret);
  const issuer = config.issuer;

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;
  const verifier = request.cookies.get(VERIFIER_COOKIE)?.value;
  const redirectUri = request.cookies.get(REDIRECT_URI_COOKIE)?.value || config.callbackUrl;

  if (!issuer || !clientId || !code || !state || state !== expectedState || !verifier || !redirectUri) {
    console.warn("Keycloak callback validation failed", {
      hasIssuer: Boolean(issuer),
      hasClientId: Boolean(clientId),
      hasCode: Boolean(code),
      hasState: Boolean(state),
      stateMatch: state === expectedState,
      hasVerifier: Boolean(verifier),
      hasRedirectUri: Boolean(redirectUri),
    });
    return loginError(request, undefined, "keycloak", undefined, clientId);
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };

  if (clientSecret) {
    body.set("client_secret", clientSecret);
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    headers["Authorization"] = `Basic ${basicAuth}`;
  }

  try {
    const tokenResponse = await fetch(`${issuer}/protocol/openid-connect/token`, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
    });
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Keycloak token exchange failed", {
        status: tokenResponse.status,
        clientId,
        hasClientSecret: Boolean(clientSecret),
        redirectUri,
        error: error.slice(0, 500),
      });
      return loginError(request, tokenResponse.status, "keycloak", undefined, clientId);
    }
    const tokens = (await tokenResponse.json()) as { access_token?: string; refresh_token?: string; id_token?: string; expires_in?: number };
    if (!tokens.access_token) return loginError(request, 401, "keycloak", undefined, clientId);

    try {
      const parts = tokens.access_token.split(".");
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
      console.log("[Keycloak Callback] User signed in:", {
        username: decoded?.preferred_username,
        email: decoded?.email,
        realmRoles: decoded?.realm_access?.roles,
      });
    } catch {
      // ignore logging error
    }

    if (!hasAdminRole(tokens.access_token)) {
      console.warn("Keycloak login rejected: authenticated user lacks ADMIN role");
      return loginError(request, 403, "unauthorized", tokens.id_token, clientId);
    }

    const returnPath = safeReturnPath(request.cookies.get(RETURN_PATH_COOKIE)?.value);
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
    return loginError(request, undefined, "keycloak", undefined, clientId);
  }
}
