import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const issuer = process.env.KEYCLOAK_CLIENT_ISSUER ?? process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
  const clientId = process.env.KEYCLOAK_CLIENT_ID ?? process.env.KEYCLOAK_WEB_CLIENT_ID ?? "istash-client";
  const nextParam = request.nextUrl.searchParams.get("next");
  const loginUrl = new URL("/login", request.url);
  if (nextParam) loginUrl.searchParams.set("next", nextParam);

  const destination = issuer
    ? new URL(`${issuer.replace(/\/$/, "")}/protocol/openid-connect/logout`)
    : loginUrl;

  if (issuer) {
    destination.searchParams.set("client_id", clientId);
    destination.searchParams.set("post_logout_redirect_uri", loginUrl.toString());
  }

  const response = NextResponse.redirect(destination);

  response.cookies.delete("istash_session");
  response.cookies.delete("accessToken");
  for (const name of ["keycloak_pkce_verifier", "keycloak_oauth_state", "keycloak_return_path", "keycloak_redirect_uri"]) {
    response.cookies.delete(name);
  }
  return response;
}
