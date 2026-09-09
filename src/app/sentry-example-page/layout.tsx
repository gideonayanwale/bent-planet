import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnostics & Telemetry",
  description: "Test and verify real-time Sentry error capturing and PostHog product analytics.",
};

export default function SentryExampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
