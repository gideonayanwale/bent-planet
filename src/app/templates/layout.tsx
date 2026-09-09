import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conference Design Showroom & Wireframe Studio",
  description:
    "Explore polymorphic wireframe topologies, 40+ production design library specs, spiritual typography systems, and AI fine-tuning playground for church conferences.",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
