-- Migration 0007: Add RSVP limit to conferences

ALTER TABLE public.conferences
  ADD COLUMN IF NOT EXISTS rsvp_limit integer DEFAULT NULL;
