/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  webpack: (config, { dev }) => {
    // On Windows, filesystem cache pack renames cause ENOENT race conditions
    // during production builds. Use memory cache to avoid this entirely.
    if (!dev) {
      config.cache = { type: "memory" };
    }
    return config;
  },
};

export default nextConfig;
