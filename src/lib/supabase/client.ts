"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

/**
 * Standard Supabase client helper for client-side components.
 * Returns the singleton browser client configured with SSR cookie handling.
 */
export function createClient() {
  return createBrowserSupabaseClient();
}
