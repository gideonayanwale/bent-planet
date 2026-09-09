"use client";

import { useEffect } from "react";

/**
 * Dynamically updates the browser tab <title> and document head
 * following the standard branding format:
 * `"[Tab / Page Name] • Bent Planet | [Descriptive Tagline]"`
 *
 * @param title The active page, subview, or tab name (e.g. "Presets", "Contact", "Audience CRM")
 * @param tagline Optional custom tagline (defaults to "Church Conference & Growth Platform")
 */
export function useDynamicTitle(
  title?: string,
  tagline: string = "Church Conference & Growth Platform"
) {
  useEffect(() => {
    if (!title || typeof document === "undefined") return;

    const formattedTitle = `${title.trim()} • Bent Planet | ${tagline.trim()}`;
    const previousTitle = document.title;
    document.title = formattedTitle;

    return () => {
      // Restore previous title on unmount
      document.title = previousTitle;
    };
  }, [title, tagline]);
}

/**
 * Helper to get a formatted browser title string
 */
export function formatBrowserTitle(
  pageName: string,
  tagline: string = "Church Conference & Growth Platform"
): string {
  return `${pageName} • Bent Planet | ${tagline}`;
}
