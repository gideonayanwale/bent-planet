import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Conference (AI Accelerated)",
  description:
    "Launch your conference in 60 seconds using multi-model AI event generation, agenda time-blocking, and promotional copywriting.",
};

export default function NewConferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
