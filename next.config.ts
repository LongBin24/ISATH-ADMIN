import type { NextConfig } from "next";

const backendUrl = (
  process.env.BACKEND_URL ?? "https://ite-api.istashkh.com"
).replace(/\/$/, "");
const backendApiUrl = backendUrl.endsWith("/api")
  ? backendUrl
  : `${backendUrl}/api`;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "date-fns",
      "framer-motion",
      "@iconify/react",
      "@reduxjs/toolkit",
    ],
  },
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
