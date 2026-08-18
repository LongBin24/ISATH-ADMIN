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

export async function GET(request: NextRequest) {
  const { issuer, clientId, origin, callbackUrl } = resolveKeycloakConfig(request);
  const returnPath = safeReturnPath(request.nextUrl.searchParams.get("next"));

  if (!issuer || !clientId) {
    return NextResponse.redirect(new URL("/login?authError=configuration", request.url));
  }

  const verifier = randomValue(64);
  const state = randomValue();
  const authorizationUrl = new URL(`${issuer}/protocol/openid-connect/auth`);
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
  const cookie = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: request.nextUrl.protocol === "https:" || origin.startsWith("https:"),
    path: "/",
    maxAge: 600,
  };
  response.cookies.set(VERIFIER_COOKIE, verifier, cookie);
  response.cookies.set(STATE_COOKIE, state, cookie);
  response.cookies.set(RETURN_PATH_COOKIE, returnPath, cookie);
  response.cookies.set(REDIRECT_URI_COOKIE, callbackUrl, cookie);
  response.cookies.set(CLIENT_ID_COOKIE, clientId, cookie);
  return response;
}
