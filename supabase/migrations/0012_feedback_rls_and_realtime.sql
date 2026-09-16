-- Migration 0012: Fix feedback_messages RLS & Realtime Messaging
-- ====================================================================
-- Problem:
-- 1. feedback_messages had RLS enabled but NO SELECT policy, causing Supabase
--    Realtime to drop all WAL events for non-service_role subscribers.
-- 2. Trigger broadcasting to 'church:' || NEW.church_id || ':feedback' failed
--    when church_id is NULL (evaluating to NULL topic in Postgres).
-- 3. Replica identity wasn't FULL for complete Realtime payload reconstruction.

-- 1. Ensure REPLICA IDENTITY FULL on feedback_messages
ALTER TABLE public.feedback_messages REPLICA IDENTITY FULL;

-- 2. Add SELECT RLS policies on feedback_messages for authenticated users
-- Drop existing policies if any were added manually
DROP POLICY IF EXISTS "churches_select_own_feedback" ON public.feedback_messages;
DROP POLICY IF EXISTS "feedback_select_policy" ON public.feedback_messages;

CREATE POLICY "feedback_select_policy"
  ON public.feedback_messages FOR SELECT
  TO authenticated
  USING (
    -- Church admin can read feedback addressed to their own church
    (church_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.churches
      WHERE churches.id = feedback_messages.church_id
        AND churches.admin_email = auth.jwt()->>'email'
    ))
    OR
    -- Platform-level feedback (church_id IS NULL) readable by authenticated admins/users
    (church_id IS NULL)
  );

-- 3. Add UPDATE RLS policy so admins can update feedback status (e.g. 'read', 'resolved')
DROP POLICY IF EXISTS "feedback_update_policy" ON public.feedback_messages;
CREATE POLICY "feedback_update_policy"
  ON public.feedback_messages FOR UPDATE
  TO authenticated
  USING (
    (church_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.churches
      WHERE churches.id = feedback_messages.church_id
        AND churches.admin_email = auth.jwt()->>'email'
    ))
    OR
    (church_id IS NULL)
  )
  WITH CHECK (
    (church_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.churches
      WHERE churches.id = feedback_messages.church_id
        AND churches.admin_email = auth.jwt()->>'email'
    ))
    OR
    (church_id IS NULL)
  );

-- 4. Ensure feedback_messages is in the supabase_realtime publication
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 5. Safe broadcast trigger function supporting both Church & Platform feedback
CREATE OR REPLACE FUNCTION public.broadcast_feedback_message()
RETURNS TRIGGER AS $$
DECLARE
  v_topic text;
BEGIN
  -- Determine topic: church-scoped or platform-wide
  IF NEW.church_id IS NOT NULL THEN
    v_topic := 'church:' || NEW.church_id::text || ':feedback';
  ELSE
    v_topic := 'platform:feedback';
  END IF;

  -- Broadcast via Realtime private channel if realtime.send is available
  BEGIN
    PERFORM realtime.send(
      json_build_object(
        'topic', v_topic,
        'event', 'INSERT',
        'payload', json_build_object('record', row_to_json(NEW))
      )
    );
  EXCEPTION WHEN OTHERS THEN
    -- Never fail the database transaction if Realtime broadcast encounters an issue
    NULL;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger cleanly
DROP TRIGGER IF EXISTS trg_broadcast_feedback_message ON public.feedback_messages;
CREATE TRIGGER trg_broadcast_feedback_message
  AFTER INSERT ON public.feedback_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.broadcast_feedback_message();
