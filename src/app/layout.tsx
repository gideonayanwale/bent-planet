import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://bentplanet.com"),
  title: {
    default: "Bent Planet — Church & Ministry Conference Growth Platform",
    template: "%s | Bent Planet",
  },
  description:
    "Invite-only platform for churches and Christian ministries to host interactive conferences, automate livestream broadcasts, engage attendees via WhatsApp, and manage subscribers.",
  icons: {
    icon: "/logo-icon.svg",
    shortcut: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
  openGraph: {
    title: "Bent Planet — Church & Ministry Event Platform",
    description:
      "Empowering churches with livestream hubs, WhatsApp community integration, AI copywriting, and conference attendee management.",
    url: "https://bentplanet.com",
    siteName: "Bent Planet",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bent Planet — Church & Ministry Growth Software",
    description:
      "Interactive livestream hubs, WhatsApp community growth, and ministry subscriber management for Christian organizations.",
  },
};

import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalFeedbackWidget } from "@/components/global-feedback-widget";
import { PostHogProvider } from "@/components/posthog-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-body text-foreground antialiased selection:bg-primary/30 selection:text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <PostHogProvider>
            {children}
            <Analytics />
            <GlobalFeedbackWidget />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
