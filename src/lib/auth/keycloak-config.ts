import { NextRequest } from "next/server";

export const VERIFIER_COOKIE = "keycloak_pkce_verifier";
export const STATE_COOKIE = "keycloak_oauth_state";
export const RETURN_PATH_COOKIE = "keycloak_return_path";
export const REDIRECT_URI_COOKIE = "keycloak_redirect_uri";
export const CLIENT_ID_COOKIE = "keycloak_client_id";

export function safeReturnPath(value: string | null | undefined): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/welcome";
}

export function getOrigin(request: NextRequest): string {
  const customOrigin = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (customOrigin) {
    const withProto = customOrigin.startsWith("http") ? customOrigin : `https://${customOrigin}`;
    return withProto.replace(/\/$/, "");
  }
  const proto = request.headers.get("x-forwarded-proto") || (request.nextUrl.protocol.replace(":", "") || "http");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
  return `${proto}://${host}`;
}

export interface KeycloakConfig {
  issuer: string;
  clientId: string;
  clientSecret?: string;
  origin: string;
  callbackUrl: string;
}

export function resolveKeycloakConfig(request: NextRequest): KeycloakConfig {
  const origin = getOrigin(request);
  const isLocal =
    origin.includes("localhost") ||
    origin.includes("127.0.0.1") ||
    request.nextUrl.hostname === "localhost" ||
    request.nextUrl.hostname === "127.0.0.1";

  const issuer =
    process.env.KEYCLOAK_CLIENT_ISSUER ??
    process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER ??
    "https://ite-keycloak.istashkh.com/realms/istash";

  let clientId =
    process.env.KEYCLOAK_CLIENT_ID ??
    process.env.KEYCLOAK_WEB_CLIENT_ID ??
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ??
    "istash-client";

  let clientSecret =
    process.env.KEYCLOAK_CLIENT_SECRET ??
    process.env.KEYCLOAK_WEB_CLIENT_SECRET ??
    process.env.KEYCLOAK_ADMIN_CLIENT_SECRET;

  if (isLocal) {
    // Keycloak allows 'istash-client' for local development on http://localhost:3000/auth/verified.
    // If the environment specifies 'istash-admin-client' (which Keycloak only permits for production Vercel),
    // automatically switch to 'istash-client' for local development to prevent invalid redirect_uri errors.
    if (clientId === "istash-admin-client" || !clientId) {
      clientId = "istash-client";
      clientSecret = "3myEb9EFPZAi2wyrbGmFdH9A391299GC";
    }
  } else {
    if (clientId === "istash-client" && !clientSecret) {
      clientSecret = "3myEb9EFPZAi2wyrbGmFdH9A391299GC";
    }
  }

  const normalizedOrigin = isLocal ? "http://localhost:3000" : origin.replace(/\/$/, "");
  const callbackUrl = `${normalizedOrigin}/auth/verified`;

  return {
    issuer: issuer.replace(/\/$/, ""),
    clientId,
    clientSecret,
    origin: normalizedOrigin,
    callbackUrl,
  };
}
