-- Migration: 0005_master_updates.sql
-- Description: Supports Request Access, Multi-day Events, Templates, WhatsApp integration, and Extended Church Profiles

-- 1. Access Requests (Voluntary Church Signup)
CREATE TABLE IF NOT EXISTS public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_name TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  denomination TEXT,
  country TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Extended Church Profile Fields
ALTER TABLE public.churches
  ADD COLUMN IF NOT EXISTS denomination TEXT,
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS year_founded TEXT,
  ADD COLUMN IF NOT EXISTS physical_address TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS town TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_channel_url TEXT,
  ADD COLUMN IF NOT EXISTS telegram_url TEXT,
  ADD COLUMN IF NOT EXISTS tiktok_url TEXT,
  ADD COLUMN IF NOT EXISTS threads_url TEXT,
  ADD COLUMN IF NOT EXISTS x_url TEXT,
  ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'modern_gradient';

-- 3. Extended Conference / Event Fields
ALTER TABLE public.conferences
  ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'Conference',
  ADD COLUMN IF NOT EXISTS end_date DATE,
  ADD COLUMN IF NOT EXISTS host_name TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_group_url TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_contact_number TEXT,
  ADD COLUMN IF NOT EXISTS flyer_layout TEXT DEFAULT 'single',
  ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'modern_gradient',
  ADD COLUMN IF NOT EXISTS rsvp_limit INTEGER,
  ADD COLUMN IF NOT EXISTS custom_short_link TEXT;

-- 4. In-App Feedback & Contact Messages
CREATE TABLE IF NOT EXISTS public.feedback_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  category TEXT DEFAULT 'feedback', -- feedback, support, feature_request
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Platform-wide System Announcements
CREATE TABLE IF NOT EXISTS public.system_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_audience TEXT DEFAULT 'all_churches', -- all_churches, all_subscribers, all
  sent_by TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Basic Public Read policies
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to access_requests" ON public.access_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to feedback_messages" ON public.feedback_messages FOR INSERT WITH CHECK (true);
