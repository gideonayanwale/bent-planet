"use client";

import { useEffect, useRef, useCallback } from "react";
import { prepareRealtime } from "@/lib/realtime";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type SubscriberCountPayload = {
  payload?: {
    conference_id?: string;
    subscriber_count?: number;
    operation?: "INSERT" | "UPDATE" | "DELETE";
  };
  subscriber_count?: number;
};

/**
 * Subscribe to live subscriber/RSVP count changes for a conference.
 *
 * Listens on the private channel `conference:${conferenceId}:subscribers` for:
 * 1. Broadcast `subscriber_count_changed` event sent by DB triggers containing ONLY the count
 * 2. Postgres Changes on `subscribers` table as fallback to re-fetch exact count
 *
 * Privacy guarantee: subscriber names, emails, and phone numbers are NEVER broadcast or exposed.
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

    if (typeof count === "number") {
      callbackRef.current(count);
    }
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
        .channel(`conference:${conferenceId}:subscribers`, {
          config: { private: true },
        })
        .on(
          "broadcast",
          { event: "subscriber_count_changed" },
          (event: SubscriberCountPayload) => {
            const count =
              event?.payload?.subscriber_count ?? event?.subscriber_count;
            if (typeof count === "number") {
              callbackRef.current(count);
            } else {
              fetchCount();
            }
          },
        )
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
