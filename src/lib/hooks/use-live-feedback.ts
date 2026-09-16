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
 * Subscribe to live feedback messages.
 *
 * If `churchId` is provided:
 * - Listens on `church:${churchId}:feedback`
 * - Filters postgres_changes on `church_id=eq.${churchId}`
 *
 * If `churchId` is null or undefined (super-admin view):
 * - Listens on `platform:feedback`
 * - Listens on postgres_changes for all `feedback_messages`
 *
 * Automatically deduplicates events if both Broadcast and Postgres Changes trigger.
 */
export function useLiveFeedback(
  churchId?: string | null,
  onFeedback?: (feedback: FeedbackRow) => void,
) {
  const callbackRef = useRef(onFeedback);
  callbackRef.current = onFeedback;
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let channel: ReturnType<
      Awaited<ReturnType<typeof prepareRealtime>>["channel"]
    >;
    let cancelled = false;

    const handleRecord = (record?: FeedbackRow) => {
      if (!record || !record.id) return;
      if (seenIdsRef.current.has(record.id)) return;
      seenIdsRef.current.add(record.id);

      // Keep seenIds bounded to prevent memory growth
      if (seenIdsRef.current.size > 200) {
        const first = seenIdsRef.current.values().next().value;
        if (first) seenIdsRef.current.delete(first);
      }

      callbackRef.current?.(record);
    };

    async function subscribe() {
      const supabase = await prepareRealtime();
      if (cancelled) return;

      const topic = churchId ? `church:${churchId}:feedback` : "platform:feedback";

      channel = supabase
        .channel(topic, {
          config: { private: true },
        })
        .on("broadcast", { event: "INSERT" }, (event: FeedbackBroadcastPayload) => {
          const record = event?.payload?.record ?? event?.record;
          handleRecord(record);
        });

      if (churchId) {
        channel.on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "feedback_messages",
            filter: `church_id=eq.${churchId}`,
          },
          (payload) => {
            if (payload.new) {
              handleRecord(payload.new as FeedbackRow);
            }
          },
        );
      } else {
        channel.on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "feedback_messages",
          },
          (payload) => {
            if (payload.new) {
              handleRecord(payload.new as FeedbackRow);
            }
          },
        );
      }

      channel.subscribe();
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
