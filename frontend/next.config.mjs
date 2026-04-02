/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce bundle size
  compress: true,
  // Disable source maps in production to reduce size
  productionBrowserSourceMaps: false,
  // Optimize output (swcMinify is default in Next 14+)
  // Trailing slash for static hosting
  trailingSlash: true,
  // Reduce image optimization if not needed
  images: {
    unoptimized: true,
  },
};

export default nextConfig;