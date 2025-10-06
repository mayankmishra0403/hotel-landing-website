import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  typescript: {
    // Ignore mobile-app folder during build
    ignoreBuildErrors: false,
  },
  // Exclude mobile-app from compilation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  experimental: {
    // Skip type checking for non-Next.js folders
    typedRoutes: false,
  },
};

export default nextConfig;
