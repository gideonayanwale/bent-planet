"use client";

import { useEffect, useState } from "react";
import { prepareRealtime } from "@/lib/realtime";
import type { RealtimePresenceState } from "@supabase/supabase-js";

export type PresenceUser = {
  user_id: string;
  online_at: string;
  [key: string]: unknown;
};

/**
 * Hook for client-side online presence tracking across church admins.
 *
 * Presence is entirely ephemeral and kept in memory across Realtime socket
 * channels — it is never written to PostgreSQL.
 *
 * Scoped to the private channel `church:${churchId}:presence`.
 */
export function useLivePresence(churchId: string, userId: string) {
  const [onlineUsers, setOnlineUsers] = useState<RealtimePresenceState<PresenceUser>>({});

  useEffect(() => {
    if (!churchId || !userId) return;

    let channel: ReturnType<
      Awaited<ReturnType<typeof prepareRealtime>>["channel"]
    >;
    let cancelled = false;

    async function subscribe() {
      const supabase = await prepareRealtime();
      if (cancelled) return;

      channel = supabase.channel(`church:${churchId}:presence`, {
        config: {
          private: true,
          presence: {
            key: userId,
          },
        },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          setOnlineUsers(channel.presenceState<PresenceUser>());
        })
        .on("presence", { event: "join" }, () => {
          setOnlineUsers(channel.presenceState<PresenceUser>());
        })
        .on("presence", { event: "leave" }, () => {
          setOnlineUsers(channel.presenceState<PresenceUser>());
        });

      await channel.subscribe(async (status: string) => {
        if (status === "SUBSCRIBED" && !cancelled) {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });
    }

    subscribe();

    return () => {
      cancelled = true;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [churchId, userId]);

  return { onlineUsers };
}
