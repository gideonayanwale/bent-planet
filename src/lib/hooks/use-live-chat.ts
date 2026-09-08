"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { prepareRealtime } from "@/lib/realtime";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Database } from "@/types/database";

type ChatMessageRow =
  Database["public"]["Tables"]["church_chat_messages"]["Row"];

type ChatBroadcastPayload = {
  payload?: {
    record?: ChatMessageRow;
  };
  record?: ChatMessageRow;
};

/**
 * Subscribe to live chat messages for a church and send new messages.
 *
 * Messages are inserted through the browser client so RLS validates the sender.
 * Listens on the private channel `church:${churchId}:chat` for:
 * 1. Broadcast `INSERT` events (fired by DB triggers)
 * 2. Postgres Changes `INSERT` events (fired by supabase_realtime)
 */
export function useLiveChat(churchId: string, userId: string) {
  const [messages, setMessages] = useState<ChatMessageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial messages
  useEffect(() => {
    if (!churchId) return;

    async function loadMessages() {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase
        .from("church_chat_messages")
        .select("*")
        .eq("church_id", churchId)
        .order("created_at", { ascending: true })
        .limit(100);

      setMessages(data ?? []);
      setIsLoading(false);
    }

    loadMessages();
  }, [churchId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!churchId) return;

    let channel: ReturnType<
      Awaited<ReturnType<typeof prepareRealtime>>["channel"]
    >;
    let cancelled = false;

    async function subscribe() {
      const supabase = await prepareRealtime();
      if (cancelled) return;

      const appendMessage = (newMsg: ChatMessageRow) => {
        setMessages((current) => {
          if (current.some((m) => m.id === newMsg.id)) return current;
          return [...current, newMsg];
        });
      };

      channel = supabase
        .channel(`church:${churchId}:chat`, {
          config: { private: true },
        })
        .on("broadcast", { event: "INSERT" }, (event: ChatBroadcastPayload) => {
          const record = event?.payload?.record ?? event?.record;
          if (record) {
            appendMessage(record);
          }
        })
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "church_chat_messages",
            filter: `church_id=eq.${churchId}`,
          },
          (payload) => {
            if (payload.new) {
              appendMessage(payload.new as ChatMessageRow);
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

  /**
   * Send a chat message. Inserts through the browser client so RLS
   * verifies the authenticated user belongs to the church.
   */
  const sendMessage = useCallback(
    async (body: string) => {
      if (!body.trim() || !churchId || !userId) {
        return { error: "Missing message body, church ID, or user ID" };
      }

      const supabase = createBrowserSupabaseClient();
      const { data, error } = await (supabase.from("church_chat_messages") as any)
        .insert({
          church_id: churchId,
          sender_id: userId,
          body: body.trim(),
        })
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      if (data) {
        const messageRecord = data as ChatMessageRow;
        setMessages((current) => {
          if (current.some((m) => m.id === messageRecord.id)) return current;
          return [...current, messageRecord];
        });
      }

      return { error: null };
    },
    [churchId, userId],
  );

  return { messages, isLoading, sendMessage };
}
