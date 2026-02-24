import type { NextConfig } from "next";

const apiBaseUrl = process.env.API_BASE_URL ?? "https://api.yakkasport.com.au";

const nextConfig: NextConfig = {
  /**
   * Proxy API requests to the real backend so the API URL is not exposed to the client.
   * Browser only sees same-origin requests to /api/*; Next.js forwards them server-side.
   */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
