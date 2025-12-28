/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Enable experimental features if needed
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
