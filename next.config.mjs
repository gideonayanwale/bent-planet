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

const isSentryConfigured = Boolean(process.env.SENTRY_AUTH_TOKEN || process.env.NEXT_PUBLIC_SENTRY_DSN);

export default isSentryConfigured
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG || "bent-planet",
      project: process.env.SENTRY_PROJECT || "bent-planet-saas",
      silent: true,
      widenClientFileUpload: true,
      sourcemaps: {
        disable: true,
      },
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
    })
  : nextConfig;
