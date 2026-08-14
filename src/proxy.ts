import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["kh", "en"];
const DEFAULT_LOCALE = "kh";

const protectedPrefixes = [
  "dashboard",
  "users",
  "user-manager",
  "transactions",
  "categories",
  "currencies",
  "reports",
  "settings",
  "profile",
  "notifications",
  "feedback",
  "ai-config",
  "alert",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static assets, internal paths, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icons") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Check if pathname has a supported locale prefix
  const pathnameSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathnameSegments[0];
  const hasLocale = LOCALES.includes(firstSegment);
  const currentLocale = hasLocale ? firstSegment : (request.cookies.get("NEXT_LOCALE")?.value || DEFAULT_LOCALE);
  const pathWithoutLocale = hasLocale ? pathnameSegments.slice(1).join("/") : pathnameSegments.join("/");

  // Redirect root `/` to `/{locale}/dashboard`
  if (pathname === "/" || pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`) {
    return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url));
  }

  // If path doesn't have locale prefix and is not an API/asset, redirect with locale
  if (!hasLocale) {
    const targetUrl = new URL(`/${currentLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`, request.url);
    targetUrl.search = request.nextUrl.search;
    return NextResponse.redirect(targetUrl);
  }

  // Check if protected route
  const targetRoute = pathWithoutLocale.split("/")[0] || "";
  const isProtected = protectedPrefixes.includes(targetRoute);

  const hasSession =
    request.cookies.get("istash_session")?.value === "1" ||
    Boolean(request.cookies.get("accessToken")?.value);

  if (isProtected && !hasSession) {
    const loginUrl = new URL(`/${currentLocale}/login`, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons/).*)",
  ],
};