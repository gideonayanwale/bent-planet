import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";

import "@/app/globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

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
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

