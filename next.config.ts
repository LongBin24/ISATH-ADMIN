import type { NextConfig } from "next";

const backendUrl = (
  process.env.BACKEND_URL ?? "https://ite-api.istashkh.com"
).replace(/\/$/, "");
const backendApiUrl = backendUrl.endsWith("/api")
  ? backendUrl
  : `${backendUrl}/api`;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendApiUrl}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
