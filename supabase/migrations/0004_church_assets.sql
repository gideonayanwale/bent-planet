-- Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('church-assets', 'church-assets', true)
on conflict (id) do update set public = true;

-- Policy 1: Anyone can view church assets
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'church-assets' );

-- Policy 2: Authenticated users can insert/upload assets
create policy "Authenticated users can insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'church-assets'
);

-- Policy 3: Authenticated users can update/overwrite their assets
create policy "Authenticated users can update"
on storage.objects for update
to authenticated
using ( bucket_id = 'church-assets' );

-- Policy 4: Authenticated users can delete their assets
create policy "Authenticated users can delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'church-assets' );

-- Enable Realtime for analytics
begin;
  -- Remove them first if they exist to avoid duplicate errors, or just use a safe approach
  -- Typically Supabase creates the supabase_realtime publication by default.
  alter publication supabase_realtime add table public.subscribers;
  alter publication supabase_realtime add table public.conferences;
commit;

