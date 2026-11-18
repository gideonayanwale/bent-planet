-- OIKODARA database hardening
-- Review this script against the target project before applying it in Supabase SQL Editor.
-- It tightens tenant data access and storage object ownership without changing existing records.

begin;

-- Feedback writes must go through the validated server route, not the public Data API.
drop policy if exists "Allow public insert to feedback_messages" on public.feedback_messages;

-- Feedback for one church must never be visible to another church.
drop policy if exists "feedback_select_policy" on public.feedback_messages;
create policy "feedback_select_policy"
  on public.feedback_messages
  for select
  to authenticated
  using (
    public.is_super_admin()
    or (
      church_id is not null
      and exists (
        select 1
        from public.churches c
        where c.id = feedback_messages.church_id
          and lower(c.admin_email) = lower((select auth.jwt() ->> 'email'))
      )
    )
  );

drop policy if exists "feedback_update_policy" on public.feedback_messages;
create policy "feedback_update_policy"
  on public.feedback_messages
  for update
  to authenticated
  using (
    public.is_super_admin()
    or (
      church_id is not null
      and exists (
        select 1
        from public.churches c
        where c.id = feedback_messages.church_id
          and lower(c.admin_email) = lower((select auth.jwt() ->> 'email'))
      )
    )
  )
  with check (
    public.is_super_admin()
    or (
      church_id is not null
      and exists (
        select 1
        from public.churches c
        where c.id = feedback_messages.church_id
          and lower(c.admin_email) = lower((select auth.jwt() ->> 'email'))
      )
    )
  );

-- Restrict storage mutations to the church that owns the folder.
-- Public SELECT remains enabled because both asset buckets are intentionally public.
drop policy if exists "Authenticated users can insert" on storage.objects;
drop policy if exists "Authenticated users can update" on storage.objects;
drop policy if exists "Authenticated users can delete" on storage.objects;
drop policy if exists "Authenticated users can upload banners" on storage.objects;
drop policy if exists "Authenticated users can update banners" on storage.objects;
drop policy if exists "Authenticated users can delete banners" on storage.objects;

create policy "Church admins upload own assets"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id in ('church-assets', 'conference-banners')
    and (storage.foldername(name))[1] in ('logos', 'banners')
    and exists (
      select 1
      from public.churches c
      where (storage.foldername(name))[2] in (c.id::text, 'church-' || c.id::text)
        and (
          public.is_super_admin()
          or lower(c.admin_email) = lower((select auth.jwt() ->> 'email'))
        )
    )
  );

create policy "Church admins update own assets"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id in ('church-assets', 'conference-banners')
    and (storage.foldername(name))[1] in ('logos', 'banners')
    and exists (
      select 1
      from public.churches c
      where (storage.foldername(name))[2] in (c.id::text, 'church-' || c.id::text)
        and (
          public.is_super_admin()
          or lower(c.admin_email) = lower((select auth.jwt() ->> 'email'))
        )
    )
  )
  with check (
    bucket_id in ('church-assets', 'conference-banners')
    and (storage.foldername(name))[1] in ('logos', 'banners')
    and exists (
      select 1
      from public.churches c
      where (storage.foldername(name))[2] in (c.id::text, 'church-' || c.id::text)
        and (
          public.is_super_admin()
          or lower(c.admin_email) = lower((select auth.jwt() ->> 'email'))
        )
    )
  );

create policy "Church admins delete own assets"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id in ('church-assets', 'conference-banners')
    and (storage.foldername(name))[1] in ('logos', 'banners')
    and exists (
      select 1
      from public.churches c
      where (storage.foldername(name))[2] in (c.id::text, 'church-' || c.id::text)
        and (
          public.is_super_admin()
          or lower(c.admin_email) = lower((select auth.jwt() ->> 'email'))
        )
    )
  );

-- Trigger and DDL event functions are not application RPC endpoints.
-- Pin search_path and remove default/public execution privileges.
alter function public.broadcast_feedback_message() set search_path = pg_catalog;
revoke execute on function public.broadcast_feedback_message() from public, anon, authenticated;

alter function public.rls_auto_enable() set search_path = pg_catalog;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- These records are accessed only by trusted server-side service-role code.
revoke all on table public.invites from anon, authenticated;
revoke all on table public.email_delivery_queue from anon, authenticated;

commit;
