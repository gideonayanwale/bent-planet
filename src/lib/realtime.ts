"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

/**
 * Returns the browser Supabase client with an up-to-date Realtime auth token.
 *
 * Call this once per subscription setup so the Realtime connection carries the
 * current JWT. This is required for private channels and for postgres_changes
 * to enforce RLS correctly on the client side.
 */
export async function prepareRealtime() {
  const supabase = createBrowserSupabaseClient();

  // Refresh and pass the current Auth JWT to Realtime
  await supabase.realtime.setAuth();

  return supabase;
}
