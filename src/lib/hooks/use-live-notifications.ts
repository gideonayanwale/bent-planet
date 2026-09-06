"use client";

import { useEffect, useRef } from "react";
import { prepareRealtime } from "@/lib/realtime";
import type { Database } from "@/types/database";

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

/**
 * Subscribe to live notification inserts for the authenticated church admin.
 *
 * RLS on the `notifications` table ensures only rows matching the admin's
 * church_id are delivered to the client via postgres_changes.
 */
export function useLiveNotifications(
  churchId: string,
  onNotification: (notification: NotificationRow) => void,
) {
  // Stable ref so we don't re-subscribe when the callback identity changes
  const callbackRef = useRef(onNotification);
  callbackRef.current = onNotification;

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
        .channel(`live:notifications:${churchId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `church_id=eq.${churchId}`,
          },
          (payload) => {
            callbackRef.current(payload.new as NotificationRow);
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
