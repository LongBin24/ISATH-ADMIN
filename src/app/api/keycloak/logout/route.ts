import { NextRequest, NextResponse } from "next/server";
import {
  CLIENT_ID_COOKIE,
  REDIRECT_URI_COOKIE,
  RETURN_PATH_COOKIE,
  STATE_COOKIE,
  VERIFIER_COOKIE,
  resolveKeycloakConfig,
} from "@/lib/auth/keycloak-config";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const config = resolveKeycloakConfig(request);
  const cookieClientId = request.cookies.get(CLIENT_ID_COOKIE)?.value;
  const clientId = cookieClientId || config.clientId;
  const issuer = config.issuer;

  const nextParam = request.nextUrl.searchParams.get("next");
  const loginUrl = new URL("/login", request.url);
  if (nextParam) loginUrl.searchParams.set("next", nextParam);

  const destination = issuer
    ? new URL(`${issuer}/protocol/openid-connect/logout`)
    : loginUrl;

  if (issuer) {
    destination.searchParams.set("client_id", clientId);
    destination.searchParams.set("post_logout_redirect_uri", loginUrl.toString());
  }

  const response = NextResponse.redirect(destination);

  response.cookies.delete("istash_session");
  response.cookies.delete("accessToken");
  for (const name of [
    VERIFIER_COOKIE,
    STATE_COOKIE,
    RETURN_PATH_COOKIE,
    REDIRECT_URI_COOKIE,
    CLIENT_ID_COOKIE,
  ]) {
    response.cookies.delete(name);
  }
  return response;
}
