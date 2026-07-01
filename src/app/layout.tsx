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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
