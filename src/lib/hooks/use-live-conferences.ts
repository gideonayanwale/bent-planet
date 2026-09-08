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

type ConferenceBroadcastPayload = {
  payload?: {
    record?: ConferenceRow;
    old_record?: ConferenceRow;
  };
  record?: ConferenceRow;
};

/**
 * Subscribe to live conference updates for the authenticated church admin.
 *
 * Listens on the private channel `church:${churchId}:conferences` for:
 * 1. Broadcast `INSERT`, `UPDATE`, `DELETE` events (fired by DB triggers)
 * 2. Postgres Changes on table `conferences` (fired by supabase_realtime)
 *
 * RLS ensures only authorized church admins receive conference updates.
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

      const handleBroadcast = (
        eventType: "INSERT" | "UPDATE" | "DELETE",
        event: ConferenceBroadcastPayload,
      ) => {
        const record = event?.payload?.record ?? event?.record;
        if (record) {
          callbackRef.current({
            eventType,
            record,
            oldRecord: event?.payload?.old_record,
          });
        }
      };

      channel = supabase
        .channel(`church:${churchId}:conferences`, {
          config: { private: true },
        })
        .on("broadcast", { event: "INSERT" }, (event: ConferenceBroadcastPayload) =>
          handleBroadcast("INSERT", event),
        )
        .on("broadcast", { event: "UPDATE" }, (event: ConferenceBroadcastPayload) =>
          handleBroadcast("UPDATE", event),
        )
        .on("broadcast", { event: "DELETE" }, (event: ConferenceBroadcastPayload) =>
          handleBroadcast("DELETE", event),
        )
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

// Named alias for convenience
export const useLiveConference = useLiveConferences;
