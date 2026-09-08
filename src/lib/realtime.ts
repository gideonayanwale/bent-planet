"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Returns the browser Supabase client with an up-to-date Realtime auth token.
 * Refreshes and passes the current Auth JWT to Realtime for private-channel authorization.
 */
export async function prepareRealtime() {
  const supabase = createClient();

  // Refresh and pass the current Auth JWT to Realtime
  await supabase.realtime.setAuth();

  return supabase;
}
