import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/user-manager", "/categories", "/currencies", "/reports", "/settings", "/profile", "/notifications", "/feedback", "/ai-config"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export default function proxy(request: NextRequest) {
  const hasSession =
    request.cookies.get("istash_session")?.value === "1" ||
    request.cookies.get("accessToken")?.value;

  if (isProtectedPath(request.nextUrl.pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/user-manager/:path*", "/categories/:path*", "/currencies/:path*", "/reports/:path*", "/settings/:path*", "/profile/:path*", "/notifications/:path*", "/feedback/:path*", "/ai-config/:path*"],
};
