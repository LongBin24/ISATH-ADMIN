import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const verifierCookie = "keycloak_pkce_verifier";
const stateCookie = "keycloak_oauth_state";

function safeReturnPath(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/welcome";
}

function base64UrlEncode(value: Uint8Array) {
  return btoa(String.fromCharCode(...value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomValue(length = 32) {
  const value = new Uint8Array(length);
  crypto.getRandomValues(value);
  return base64UrlEncode(value);
}

async function codeChallenge(verifier: string) {
  return base64UrlEncode(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
}

function getOrigin(request: NextRequest): string {
  const customOrigin = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (customOrigin) {
    const withProto = customOrigin.startsWith("http") ? customOrigin : `https://${customOrigin}`;
    return withProto.replace(/\/$/, "");
  }
  const proto = request.headers.get("x-forwarded-proto") || (request.nextUrl.protocol.replace(":", "") || "https");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
  return `${proto}://${host}`;
}

export async function GET(request: NextRequest) {
  const issuer = process.env.KEYCLOAK_CLIENT_ISSUER ?? process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
  const clientId =
    process.env.KEYCLOAK_CLIENT_ID ??
    process.env.KEYCLOAK_WEB_CLIENT_ID ??
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ??
    process.env.KEYCLOAK_ADMIN_CLIENT_ID ??
    "istash-client";
  const returnPath = safeReturnPath(request.nextUrl.searchParams.get("next"));

  if (!issuer || !clientId) {
    return NextResponse.redirect(new URL("/login?authError=configuration", request.url));
  }

  const verifier = randomValue(64);
  const state = randomValue();
  const origin = getOrigin(request);
  const callbackUrl = `${origin}/auth/verified`;
  const authorizationUrl = new URL(`${issuer.replace(/\/$/, "")}/protocol/openid-connect/auth`);
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid profile email");
  authorizationUrl.searchParams.set("prompt", "login");
  authorizationUrl.searchParams.set("redirect_uri", callbackUrl);
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("code_challenge", await codeChallenge(verifier));
  authorizationUrl.searchParams.set("code_challenge_method", "S256");
  const loginHint = request.nextUrl.searchParams.get("login_hint");
  if (loginHint) authorizationUrl.searchParams.set("login_hint", loginHint);

  const response = NextResponse.redirect(authorizationUrl);
  const cookie = { httpOnly: true, sameSite: "lax" as const, secure: request.nextUrl.protocol === "https:" || origin.startsWith("https:"), path: "/", maxAge: 600 };
  response.cookies.set(verifierCookie, verifier, cookie);
  response.cookies.set(stateCookie, state, cookie);
  response.cookies.set("keycloak_return_path", returnPath, cookie);
  response.cookies.set("keycloak_redirect_uri", callbackUrl, cookie);
  return response;
}
