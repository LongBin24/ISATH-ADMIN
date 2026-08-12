import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const callbackUrl = new URL("/api/keycloak/callback", request.url);
  request.nextUrl.searchParams.forEach((value, key) => callbackUrl.searchParams.set(key, value));
  return NextResponse.redirect(callbackUrl);
}
