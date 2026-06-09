/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.cosmos.so",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
