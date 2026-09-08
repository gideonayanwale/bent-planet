"use client";

import { useEffect, useRef } from "react";
import { prepareRealtime } from "@/lib/realtime";
import type { Database } from "@/types/database";

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

type NotificationBroadcastPayload = {
  payload?: {
    record?: NotificationRow;
  };
  record?: NotificationRow;
};

/**
 * Subscribe to live notifications for an authenticated church admin.
 *
 * Listens on the private channel `church:${churchId}:notifications` for:
 * 1. Broadcast `INSERT` events (fired by database triggers)
 * 2. Postgres Changes `INSERT` events (fired by supabase_realtime publication)
 *
 * RLS ensures only authorized church admins receive these notifications.
 */
export function useLiveNotifications(
  churchId: string,
  onNotification: (notification: NotificationRow) => void,
) {
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
        .channel(`church:${churchId}:notifications`, {
          config: { private: true },
        })
        .on(
          "broadcast",
          { event: "INSERT" },
          (event: NotificationBroadcastPayload) => {
            const record = event?.payload?.record ?? event?.record;
            if (record) {
              callbackRef.current(record);
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `church_id=eq.${churchId}`,
          },
          (payload) => {
            if (payload.new) {
              callbackRef.current(payload.new as NotificationRow);
            }
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
