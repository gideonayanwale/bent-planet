"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { prepareRealtime } from "@/lib/realtime";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Database } from "@/types/database";

type ChatMessageRow =
  Database["public"]["Tables"]["church_chat_messages"]["Row"];

/**
 * Subscribe to live chat messages for a church and provide a send function.
 *
 * Messages are inserted through the browser Supabase client so that RLS
 * policies validate the sender (auth.jwt()->>'email' must match the church's
 * admin_email). New messages arrive via postgres_changes INSERT events.
 */
export function useLiveChat(churchId: string, userId: string) {
  const [messages, setMessages] = useState<ChatMessageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

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

      channel = supabase
        .channel(`live:chat:${churchId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "church_chat_messages",
            filter: `church_id=eq.${churchId}`,
          },
          (payload) => {
            const newMsg = payload.new as ChatMessageRow;
            // Deduplicate — the sender's own insert may arrive before the
            // optimistic update is reconciled
            setMessages((current) => {
              if (current.some((m) => m.id === newMsg.id)) return current;
              return [...current, newMsg];
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

  /**
   * Send a chat message. The insert goes through the browser client so
   * RLS validates the sender. Returns `{ error }` if the insert fails.
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

      // Optimistic: add immediately (dedupe guard in the subscription
      // handler prevents doubles)
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
