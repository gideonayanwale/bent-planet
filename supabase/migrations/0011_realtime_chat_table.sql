-- Migration 0011: Realtime chat table + enable Realtime publication
-- ===================================================================
-- This migration:
-- 1. Creates the church_chat_messages table for admin-to-admin chat
-- 2. Adds RLS policies matching the existing church ownership pattern
-- 3. Enables the supabase_realtime publication for tables that need live updates

-- ─── CHURCH CHAT MESSAGES ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.church_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id uuid NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_church_id_idx
  ON public.church_chat_messages(church_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx
  ON public.church_chat_messages(created_at);

ALTER TABLE public.church_chat_messages ENABLE ROW LEVEL SECURITY;

-- Church admin can read chat messages for their own church
CREATE POLICY "chat_select_own"
  ON public.church_chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.churches
      WHERE churches.id = church_chat_messages.church_id
        AND churches.admin_email = auth.jwt()->>'email'
    )
  );

-- Church admin can insert chat messages for their own church
CREATE POLICY "chat_insert_own"
  ON public.church_chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.churches
      WHERE churches.id = church_chat_messages.church_id
        AND churches.admin_email = auth.jwt()->>'email'
    )
  );


-- ─── ENABLE REALTIME PUBLICATION ─────────────────────────────────────
-- Supabase postgres_changes requires each table to be in the
-- supabase_realtime publication. This is idempotent (IF NOT EXISTS
-- isn't supported, but re-adding an existing table is a no-op error
-- that we catch with the DO block).

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.conferences;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.subscribers;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.church_chat_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
