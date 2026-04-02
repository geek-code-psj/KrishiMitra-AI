import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize output for standalone (Docker)
  output: 'standalone',
  // Reduce bundle size
  compress: true,
  // Disable source maps in production to reduce size
  productionBrowserSourceMaps: false,
  // Optimize output
  swcMinify: true,
  // Trailing slash for static hosting
  trailingSlash: true,
  // Reduce image optimization if not needed
  images: {
    unoptimized: true,
  },
};

export default nextConfig;