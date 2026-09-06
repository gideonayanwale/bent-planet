-- Migration: 0010_auth_rate_limits.sql
-- Create table for tracking authentication rate limits (15-minute sliding window)

CREATE TABLE IF NOT EXISTS public.auth_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- email or IP address
  action TEXT NOT NULL,     -- e.g. 'password_reset'
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick sliding window timestamp lookups
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_identifier_action 
  ON public.auth_rate_limits(identifier, action, requested_at DESC);

-- Enable RLS
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role manages rate limits" ON public.auth_rate_limits
  FOR ALL TO service_role USING (true);
