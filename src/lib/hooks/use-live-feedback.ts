"use client";

import { useEffect, useRef } from "react";
import { prepareRealtime } from "@/lib/realtime";
import type { Database } from "@/types/database";

type FeedbackRow = Database["public"]["Tables"]["feedback_messages"]["Row"];

/**
 * Subscribe to live feedback message inserts for the authenticated church admin.
 *
 * The `feedback_messages` table doesn't have RLS policies that filter by
 * church_id for SELECT (it uses the admin client in the API route), but
 * the postgres_changes filter limits events to the admin's church_id.
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
        .channel(`live:feedback:${churchId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "feedback_messages",
            filter: `church_id=eq.${churchId}`,
          },
          (payload) => {
            callbackRef.current(payload.new as FeedbackRow);
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
