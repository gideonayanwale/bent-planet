"use client";

import { type ReactNode } from "react";
import { Hero3DBackground } from "@/components/home/hero-3d-background";

interface HomepageClientProps {
  children: ReactNode;
}

/**
 * Client wrapper for the homepage that:
 * 1. Renders the full-page 3D animated background (canvas + video)
 * 2. Wraps all page content with smooth CSS entrance animation
 * 3. Ensures content floats above background with proper z-indexing
 */
export function HomepageClient({ children }: HomepageClientProps) {
  return (
    <>
      {/* Fixed full-page 3D background layer */}
      <Hero3DBackground />

      {/* Content layer — floats above background */}
      <div
        className="relative min-h-screen text-foreground overflow-hidden font-sans animate-in fade-in duration-700"
        style={{ zIndex: 10 }}
      >
        {children}
      </div>
    </>
  );
}
