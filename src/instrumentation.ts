import * as Sentry from "@sentry/nextjs";

export async function register() {
  const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

  if (process.env.NEXT_RUNTIME === "nodejs" && SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
      debug: false,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge" && SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
      debug: false,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
