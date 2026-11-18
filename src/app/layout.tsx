import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta", display: "swap" });

import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "OIKODARA • Digital Ministry Platform",
    template: "%s • OIKODARA | Digital Ministry Platform",
  },
  description:
    "A connected digital ministry platform for church administration, fellowship, discipleship, events, communication and member engagement.",
  icons: {
    icon: "/logo-icon.svg",
    shortcut: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
  openGraph: {
    title: "OIKODARA — Building the Church. Connecting the People.",
    description:
      "A connected digital platform for church administration, fellowship, discipleship, events, communication and member engagement.",
    siteName: "OIKODARA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OIKODARA — Building the Church. Connecting the People.",
    description:
      "Building the Church. Connecting the People. A connected digital ministry platform.",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} min-h-screen bg-background font-body text-foreground antialiased selection:bg-primary/30 selection:text-primary`}>
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
