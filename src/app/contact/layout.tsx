import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Connect with the Bent Planet team for church workspace onboarding, technical assistance, livestream setup, WhatsApp automations, or ministry partnerships.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
