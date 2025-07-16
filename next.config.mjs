import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // You can add other Next.js config options here if needed
};

const sentryWebpackPluginOptions = {
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Sentry project and org details
  org: "javascript-akash",
  project: "javascript-nextjs",

  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,

  // Annotate React component names for better stack traces
  reactComponentAnnotation: {
    enabled: true,
  },

  // Tunnel route to avoid ad blockers
  tunnelRoute: "/monitoring",

  // Reduce bundle size by removing Sentry logs
  disableLogger: true,

  // Enable automatic monitoring (mainly for Vercel, safe to leave on)
  automaticVercelMonitors: true,
};

const sentryNextOptions = {
  // Additional options for Sentry SDK in Next.js

  widenClientFileUpload: true,
  transpileClientSDK: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  tunnelRoute: "/monitoring",
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryNextOptions);
