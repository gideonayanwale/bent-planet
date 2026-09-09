import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Church Access",
  description:
    "Complete this application to join the Bent Planet platform. Our team verifies ministry details and issues a private workspace onboarding link.",
};

export default function RequestAccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
