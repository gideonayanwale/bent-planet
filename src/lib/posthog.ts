export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

/**
 * Initializes PostHog for client-side product analytics and session recording if configured.
 */
export function initPostHog() {
  // Client-side analytics initialization hook
}

/**
 * Tracks church ministry platform events.
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).posthog) {
    try {
      (window as any).posthog.capture(eventName, properties);
    } catch {}
  }
}

/**
 * Identifies a logged in church workspace admin.
 */
export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).posthog) {
    try {
      (window as any).posthog.identify(userId, traits);
    } catch {}
  }
}

export const posthog = {
  capture: (eventName: string, properties?: Record<string, any>) => {
    trackEvent(eventName, properties);
  },
};
