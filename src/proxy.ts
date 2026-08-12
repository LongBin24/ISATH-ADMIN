// import { NextResponse, type NextRequest } from "next/server";
// import { getSession } from "./lib/auth/auth-client"; 

// export async function proxy(request: NextRequest) {
//     const session = await getSession();

//     if (request.nextUrl.pathname.startsWith('/dashboard')) {
//         if (!session) {
//             return NextResponse.redirect(new URL('/login', request.url));
//         }

//         if (!session?.data?.user) {
//             return NextResponse.redirect(new URL('/unauthorized', request.url));
//         }
//     }

//     return NextResponse.next();
// }


// export const config = {
//     matcher: ["/dashboard/:path*"],
// };

// import { NextResponse, type NextRequest } from "next/server";
// import { auth } from "./lib/auth/auth";

// export async function proxy(request: NextRequest) {
//   const session = await auth.api.getSession({
//     headers: request.headers,
//   });

//   const pathname = request.nextUrl.pathname;

//   if (pathname.startsWith("/dashboard")) {
//     if (!session?.user) {
//       return NextResponse.redirect(
//         new URL("/login", request.url)
//       );
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };





import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./lib/auth/auth";

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/dashboard")) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRole = (session.user as any).role;
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};