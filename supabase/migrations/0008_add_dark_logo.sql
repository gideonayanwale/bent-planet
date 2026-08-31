-- Migration 0008: Add dark_logo_url to churches

ALTER TABLE public.churches
  ADD COLUMN IF NOT EXISTS dark_logo_url text;
