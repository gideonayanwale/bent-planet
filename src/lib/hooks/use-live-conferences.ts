"use client";

import { useEffect, useRef } from "react";
import { prepareRealtime } from "@/lib/realtime";
import type { Database } from "@/types/database";

type ConferenceRow = Database["public"]["Tables"]["conferences"]["Row"];

export type ConferenceChangeEvent = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  record: ConferenceRow;
  oldRecord?: ConferenceRow;
};

/**
 * Subscribe to live conference changes for the authenticated church admin.
 *
 * RLS on the `conferences` table ensures only rows belonging to the admin's
 * church are delivered. The callback receives the event type and the affected
 * conference record so the consumer can update local state or refetch.
 */
export function useLiveConferences(
  churchId: string,
  onChange: (event: ConferenceChangeEvent) => void,
) {
  const callbackRef = useRef(onChange);
  callbackRef.current = onChange;

  useEffect(() => {
    if (!churchId) return;

    let channel: ReturnType<
      Awaited<ReturnType<typeof prepareRealtime>>["channel"]
    >;
    let cancelled = false;

    async function subscribe() {
      const supabase = await prepareRealtime();
      if (cancelled) return;

      channel = supabase
        .channel(`live:conferences:${churchId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conferences",
            filter: `church_id=eq.${churchId}`,
          },
          (payload) => {
            callbackRef.current({
              eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
              record: (payload.new ?? payload.old) as ConferenceRow,
              oldRecord: payload.old as ConferenceRow | undefined,
            });
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
  }, [churchId]);
}
