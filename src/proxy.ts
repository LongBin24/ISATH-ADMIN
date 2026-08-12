// <<<<<<< HEAD
// // import { NextResponse, type NextRequest } from "next/server";
// // import { getSession } from "./lib/auth/auth-client"; 

// // export async function proxy(request: NextRequest) {
// //     const session = await getSession();

// //     if (request.nextUrl.pathname.startsWith('/dashboard')) {
// //         if (!session) {
// //             return NextResponse.redirect(new URL('/login', request.url));
// //         }

// //         if (!session?.data?.user) {
// //             return NextResponse.redirect(new URL('/unauthorized', request.url));
// //         }
// //     }

// //     return NextResponse.next();
// // }


// // export const config = {
// //     matcher: ["/dashboard/:path*"],
// // };

// // import { NextResponse, type NextRequest } from "next/server";
// // import { auth } from "./lib/auth/auth";

// // export async function proxy(request: NextRequest) {
// //   const session = await auth.api.getSession({
// //     headers: request.headers,
// //   });

// //   const pathname = request.nextUrl.pathname;

// //   if (pathname.startsWith("/dashboard")) {
// //     if (!session?.user) {
// //       return NextResponse.redirect(
// //         new URL("/login", request.url)
// //       );
// //     }
// //   }

// //   return NextResponse.next();
// // }

// // export const config = {
// //   matcher: ["/dashboard/:path*"],
// // };





// import { NextResponse, type NextRequest } from "next/server";
// import { auth } from "./lib/auth/auth";

// export default async function proxy(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;
//   if (pathname.startsWith("/dashboard")) {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     });

//     if (!session?.user) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }

//     const userRole = (session.user as any).role;
//     if (userRole !== "admin") {
//       return NextResponse.redirect(new URL("/unauthorized", request.url));
//     }
// =======
// import { NextResponse, type NextRequest } from "next/server";

// const protectedPrefixes = ["/dashboard", "/user-manager", "/categories", "/currencies", "/reports", "/settings", "/profile", "/notifications", "/feedback", "/ai-config"];

// function isProtectedPath(pathname: string) {
//   return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
// }

// export default function proxy(request: NextRequest) {
//   const hasSession =
//     request.cookies.get("istash_session")?.value === "1" ||
//     request.cookies.get("accessToken")?.value;

//   if (isProtectedPath(request.nextUrl.pathname) && !hasSession) {
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
//     return NextResponse.redirect(loginUrl);
// >>>>>>> feature/admin-api-integration
//   }

//   return NextResponse.next();
// }

// export const config = {
// <<<<<<< HEAD
//   matcher: ["/dashboard/:path*", "/admin/:path*"],
// };
// =======
//   matcher: ["/dashboard/:path*", "/user-manager/:path*", "/categories/:path*", "/currencies/:path*", "/reports/:path*", "/settings/:path*", "/profile/:path*", "/notifications/:path*", "/feedback/:path*", "/ai-config/:path*"],
// };
// >>>>>>> feature/admin-api-integration
// src/proxy.ts

import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./lib/auth/auth"; 

const protectedPrefixes = [
  "/dashboard",
  "/user-manager",
  "/categories",
  "/currencies",
  "/reports",
  "/settings",
  "/profile",
  "/notifications",
  "/feedback",
  "/ai-config",
];

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

  
    if (!session || !session.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = (session.user as any).role;
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/user-manager/:path*",
    "/categories/:path*",
    "/currencies/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/notifications/:path*",
    "/feedback/:path*",
    "/ai-config/:path*",
  ],
};