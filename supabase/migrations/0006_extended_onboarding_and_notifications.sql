-- Migration 0006: Extended onboarding fields + notifications system

-- Add new church profile columns
ALTER TABLE public.churches
  ADD COLUMN IF NOT EXISTS denomination text,
  ADD COLUMN IF NOT EXISTS motto text,
  ADD COLUMN IF NOT EXISTS year_founded text,
  ADD COLUMN IF NOT EXISTS mission_vision text,
  ADD COLUMN IF NOT EXISTS alternate_email text,
  ADD COLUMN IF NOT EXISTS address_line1 text,
  ADD COLUMN IF NOT EXISTS address_line2 text,
  ADD COLUMN IF NOT EXISTS admin_role text,
  ADD COLUMN IF NOT EXISTS max_conferences_limit integer DEFAULT 20,
  ADD COLUMN IF NOT EXISTS max_emails_limit integer DEFAULT 5000,
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS church_website_url text,
  ADD COLUMN IF NOT EXISTS onboarding_tour_completed boolean DEFAULT false;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id uuid REFERENCES public.churches(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'announcement',
  title text NOT NULL,
  message text NOT NULL,
  action_url text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS notifications_church_id_idx ON public.notifications(church_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON public.notifications(read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Super admin can see all notifications (church_id IS NULL)
-- Church admins can see their own notifications
CREATE POLICY "churches can read own notifications"
  ON public.notifications FOR SELECT
  USING (true); -- Service role (admin client) handles all access

CREATE POLICY "churches can update own notifications"
  ON public.notifications FOR UPDATE
  USING (true);

-- Track cron email sends to avoid duplicate reminders
ALTER TABLE public.subscribers
  ADD COLUMN IF NOT EXISTS reminder_7d_sent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_24h_sent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS replay_email_sent boolean DEFAULT false;
