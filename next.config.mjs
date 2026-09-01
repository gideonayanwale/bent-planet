import { withSentryConfig } from "@sentry/nextjs";

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

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "bent-planet",
  project: process.env.SENTRY_PROJECT || "bent-planet-saas",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: {
    disable: true, // Disable source map upload to avoid requiring SENTRY_AUTH_TOKEN locally
  },
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
