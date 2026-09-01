import posthog from "posthog-js";

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

/**
 * Initializes PostHog for client-side product analytics and session recording.
 */
export function initPostHog() {
  if (typeof window !== "undefined" && POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: false, // Managed manually via PostHogProvider for App Router
      capture_pageleave: true,
      autocapture: true,
    });
  }
}

/**
 * Tracks church ministry platform events.
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== "undefined" && POSTHOG_KEY) {
    posthog.capture(eventName, properties);
  }
}

/**
 * Identifies a logged in church workspace admin.
 */
export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (typeof window !== "undefined" && POSTHOG_KEY) {
    posthog.identify(userId, traits);
  }
}

export { posthog };
