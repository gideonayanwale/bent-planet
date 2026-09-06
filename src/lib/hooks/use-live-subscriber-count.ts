"use client";

import { useEffect, useRef, useCallback } from "react";
import { prepareRealtime } from "@/lib/realtime";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

/**
 * Subscribe to live subscriber count changes for a specific conference.
 *
 * When a subscriber is added or removed (INSERT/DELETE on `subscribers`),
 * this hook re-fetches the count from the database. Only the aggregate count
 * is exposed — subscriber names, emails, and phone numbers are never sent
 * over the Realtime channel or exposed to the callback.
 *
 * RLS on the `subscribers` table ensures only the church admin's data is
 * counted and delivered.
 */
export function useLiveSubscriberCount(
  conferenceId: string,
  onCountChange: (count: number) => void,
) {
  const callbackRef = useRef(onCountChange);
  callbackRef.current = onCountChange;

  const fetchCount = useCallback(async () => {
    const supabase = createBrowserSupabaseClient();
    const { count } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("conference_id", conferenceId);

    callbackRef.current(count ?? 0);
  }, [conferenceId]);

  useEffect(() => {
    if (!conferenceId) return;

    let channel: ReturnType<
      Awaited<ReturnType<typeof prepareRealtime>>["channel"]
    >;
    let cancelled = false;

    async function subscribe() {
      const supabase = await prepareRealtime();
      if (cancelled) return;

      channel = supabase
        .channel(`live:subscribers:${conferenceId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "subscribers",
            filter: `conference_id=eq.${conferenceId}`,
          },
          () => {
            fetchCount();
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "subscribers",
            filter: `conference_id=eq.${conferenceId}`,
          },
          () => {
            fetchCount();
          },
        )
        .subscribe();
    }

    subscribe();

    return () => {
      cancelled = true;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [conferenceId, fetchCount]);
}
