"use client";

import { useEffect, useRef } from "react";
import { prepareRealtime } from "@/lib/realtime";
import type { Database } from "@/types/database";

type FeedbackRow = Database["public"]["Tables"]["feedback_messages"]["Row"];

type FeedbackBroadcastPayload = {
  payload?: {
    record?: FeedbackRow;
  };
  record?: FeedbackRow;
};

/**
 * Subscribe to live feedback messages for an authenticated church admin.
 *
 * Listens on the private channel `church:${churchId}:feedback` for:
 * 1. Broadcast `INSERT` events (fired by DB triggers)
 * 2. Postgres Changes `INSERT` events on table `feedback_messages`
 */
export function useLiveFeedback(
  churchId: string,
  onFeedback: (feedback: FeedbackRow) => void,
) {
  const callbackRef = useRef(onFeedback);
  callbackRef.current = onFeedback;

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
        .channel(`church:${churchId}:feedback`, {
          config: { private: true },
        })
        .on("broadcast", { event: "INSERT" }, (event: FeedbackBroadcastPayload) => {
          const record = event?.payload?.record ?? event?.record;
          if (record) {
            callbackRef.current(record);
          }
        })
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "feedback_messages",
            filter: `church_id=eq.${churchId}`,
          },
          (payload) => {
            if (payload.new) {
              callbackRef.current(payload.new as FeedbackRow);
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
