import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = (
  process.env.BACKEND_URL || "https://ite-api.istashkh.com"
).replace(/\/$/, "");

const BACKEND_API_BASE = BACKEND_BASE_URL.endsWith("/api")
  ? `${BACKEND_BASE_URL}/v1`
  : `${BACKEND_BASE_URL}/api/v1`;

async function proxyHandler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathArray = resolvedParams?.path || [];

  // Do not intercept internal auth or keycloak route handlers
  if (pathArray[0] === "auth" || pathArray[0] === "keycloak") {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Strip leading 'v1' if present to prevent /v1/v1 duplication
  const cleanPath = pathArray[0] === "v1" ? pathArray.slice(1) : pathArray;
  const subPath = cleanPath.join("/");

  const search = request.nextUrl.search || "";
  const targetUrl = `${BACKEND_API_BASE}/${subPath}${search}`;

  // Forward incoming headers
  const forwardHeaders = new Headers();
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (
      lower !== "host" &&
      lower !== "connection" &&
      lower !== "content-length" &&
      !lower.startsWith("x-forwarded-")
    ) {
      forwardHeaders.set(key, value);
    }
  });

  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";
  let body: ArrayBuffer | undefined;

  if (hasBody) {
    try {
      body = await request.arrayBuffer();
    } catch {
      // Body empty or unreadable
    }
  }

  try {
    const backendResponse = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body,
      redirect: "manual",
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    backendResponse.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        lower !== "transfer-encoding" &&
        lower !== "content-encoding" &&
        lower !== "content-length"
      ) {
        responseHeaders.set(key, value);
      }
    });

    // Set backend target URL in headers so DevTools displays it in Headers tab
    responseHeaders.set("x-target-url", targetUrl);
    responseHeaders.set("x-upstream-url", targetUrl);
    responseHeaders.set("x-backend-url", targetUrl);
    responseHeaders.set(
      "Access-Control-Expose-Headers",
      "x-target-url, x-upstream-url, x-backend-url"
    );

    const data = await backendResponse.arrayBuffer();

    return new NextResponse(data, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`[API Proxy Error] Failed to proxy to ${targetUrl}:`, error);

    const errorHeaders = new Headers({
      "x-target-url": targetUrl,
      "x-upstream-url": targetUrl,
      "x-backend-url": targetUrl,
      "Access-Control-Expose-Headers": "x-target-url, x-upstream-url, x-backend-url",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Proxy error connecting to upstream API",
        targetUrl,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 502,
        headers: errorHeaders,
      }
    );
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const PATCH = proxyHandler;
export const DELETE = proxyHandler;
export const HEAD = proxyHandler;
export const OPTIONS = proxyHandler;
