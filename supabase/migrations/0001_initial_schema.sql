create extension if not exists pgcrypto;

-- CHURCHES
create table if not exists public.churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  banner_url text,
  bio text,
  country text,
  timezone text default 'Africa/Lagos',
  admin_name text,
  admin_email text unique not null,
  instagram_url text,
  facebook_url text,
  youtube_url text,
  whatsapp_url text,
  status text default 'active',
  onboarding_token text,
  onboarding_completed boolean default false,
  invited_at timestamptz default now(),
  created_at timestamptz default now()
);

-- CONFERENCES
create table if not exists public.conferences (
  id uuid primary key default gen_random_uuid(),
  church_id uuid references public.churches(id) on delete cascade,
  title text not null,
  slug text not null,
  caption text,
  full_description text,
  agenda jsonb,
  speaker_name text,
  speaker_role text,
  speaker_bio text,
  banner_url text,
  stream_url text,
  theme text,
  conference_date date,
  conference_time time,
  timezone text,
  enable_replay boolean default true,
  free_resource_url text,
  free_resource_name text,
  status text default 'draft',
  og_title text,
  og_description text,
  created_at timestamptz default now(),
  unique(church_id, slug)
);

-- SUBSCRIBERS
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  church_id uuid references public.churches(id) on delete cascade,
  conference_id uuid references public.conferences(id),
  full_name text not null,
  email text not null,
  phone text,
  emails_received text[] default '{}',
  last_email_opened_at timestamptz,
  unsubscribed boolean default false,
  subscribed_at timestamptz default now(),
  unique(church_id, email)
);

-- EMAIL LOG
create table if not exists public.email_log (
  id uuid primary key default gen_random_uuid(),
  church_id uuid references public.churches(id) on delete cascade,
  subscriber_id uuid references public.subscribers(id),
  conference_id uuid references public.conferences(id),
  email_type text not null,
  subject text,
  sent_at timestamptz default now(),
  opened boolean default false,
  clicked boolean default false,
  resend_email_id text
);

-- UTM TRACKING
create table if not exists public.utm_clicks (
  id uuid primary key default gen_random_uuid(),
  conference_id uuid references public.conferences(id),
  church_id uuid references public.churches(id),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  clicked_at timestamptz default now(),
  converted boolean default false
);

-- INVITES
create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  church_name text,
  email text unique,
  token text unique,
  status text default 'pending',
  invited_at timestamptz default now(),
  accepted_at timestamptz
);

create index if not exists conferences_church_id_idx on public.conferences (church_id);
create index if not exists conferences_status_date_idx on public.conferences (status, conference_date);
create index if not exists subscribers_church_id_idx on public.subscribers (church_id);
create index if not exists subscribers_conference_id_idx on public.subscribers (conference_id);
create index if not exists email_log_church_id_idx on public.email_log (church_id);
create index if not exists email_log_conference_id_idx on public.email_log (conference_id);
create index if not exists email_log_resend_email_id_idx on public.email_log (resend_email_id);
create index if not exists utm_clicks_conference_id_idx on public.utm_clicks (conference_id);
create index if not exists utm_clicks_church_id_idx on public.utm_clicks (church_id);

alter table public.churches enable row level security;
alter table public.conferences enable row level security;
alter table public.subscribers enable row level security;
alter table public.email_log enable row level security;
alter table public.utm_clicks enable row level security;
alter table public.invites enable row level security;

create policy "churches_select_own"
on public.churches
for select
to authenticated
using (admin_email = auth.jwt()->>'email');

create policy "churches_update_own"
on public.churches
for update
to authenticated
using (admin_email = auth.jwt()->>'email')
with check (admin_email = auth.jwt()->>'email');

create policy "conferences_select_own"
on public.conferences
for select
to authenticated
using (
  exists (
    select 1
    from public.churches
    where churches.id = conferences.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "conferences_insert_own"
on public.conferences
for insert
to authenticated
with check (
  exists (
    select 1
    from public.churches
    where churches.id = conferences.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "conferences_update_own"
on public.conferences
for update
to authenticated
using (
  exists (
    select 1
    from public.churches
    where churches.id = conferences.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
)
with check (
  exists (
    select 1
    from public.churches
    where churches.id = conferences.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "conferences_delete_own"
on public.conferences
for delete
to authenticated
using (
  exists (
    select 1
    from public.churches
    where churches.id = conferences.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "subscribers_select_own"
on public.subscribers
for select
to authenticated
using (
  exists (
    select 1
    from public.churches
    where churches.id = subscribers.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "subscribers_insert_own"
on public.subscribers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.churches
    where churches.id = subscribers.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "subscribers_update_own"
on public.subscribers
for update
to authenticated
using (
  exists (
    select 1
    from public.churches
    where churches.id = subscribers.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
)
with check (
  exists (
    select 1
    from public.churches
    where churches.id = subscribers.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "subscribers_delete_own"
on public.subscribers
for delete
to authenticated
using (
  exists (
    select 1
    from public.churches
    where churches.id = subscribers.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "email_log_select_own"
on public.email_log
for select
to authenticated
using (
  exists (
    select 1
    from public.churches
    where churches.id = email_log.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "email_log_insert_own"
on public.email_log
for insert
to authenticated
with check (
  exists (
    select 1
    from public.churches
    where churches.id = email_log.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "email_log_update_own"
on public.email_log
for update
to authenticated
using (
  exists (
    select 1
    from public.churches
    where churches.id = email_log.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
)
with check (
  exists (
    select 1
    from public.churches
    where churches.id = email_log.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "utm_clicks_select_own"
on public.utm_clicks
for select
to authenticated
using (
  exists (
    select 1
    from public.churches
    where churches.id = utm_clicks.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "utm_clicks_insert_own"
on public.utm_clicks
for insert
to authenticated
with check (
  exists (
    select 1
    from public.churches
    where churches.id = utm_clicks.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

create policy "utm_clicks_update_own"
on public.utm_clicks
for update
to authenticated
using (
  exists (
    select 1
    from public.churches
    where churches.id = utm_clicks.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
)
with check (
  exists (
    select 1
    from public.churches
    where churches.id = utm_clicks.church_id
      and churches.admin_email = auth.jwt()->>'email'
  )
);

