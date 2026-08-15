import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bentplanet.com"),
  title: {
    default: "Bent Planet",
    template: "%s | Bent Planet",
  },
  description:
    "Invite-only conference growth software for churches, ministries, and Christian online events.",
};

import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";

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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
