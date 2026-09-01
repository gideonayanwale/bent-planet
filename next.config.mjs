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
    if (!dev) {
      config.cache = { type: "memory" };
    }
    return config;
  },
};

export default nextConfig;
