-- Add WhatsApp channel, group, and contact fields to churches
alter table public.churches
add column if not exists whatsapp_channel_url text,
add column if not exists whatsapp_group_url text,
add column if not exists whatsapp_number text;

-- Add WhatsApp group invite, channel url, and shortened URL to conferences
alter table public.conferences
add column if not exists whatsapp_group_url text,
add column if not exists whatsapp_channel_url text,
add column if not exists short_url text;
