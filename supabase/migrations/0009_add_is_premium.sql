-- Migration 0009: Add is_premium to churches

ALTER TABLE public.churches
  ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;
