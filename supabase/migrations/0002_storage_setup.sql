-- Set up storage for conference banners
insert into storage.buckets (id, name, public)
values ('conference-banners', 'conference-banners', true)
on conflict (id) do nothing;

-- Create policies for storage
-- Allow public access to view banners
create policy "Banners are publicly accessible"
on storage.objects for select
using ( bucket_id = 'conference-banners' );

-- Allow authenticated users to upload banners
create policy "Authenticated users can upload banners"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'conference-banners' );

-- Allow authenticated users to update their own uploads (optional, based on ownership, but simple for now)
create policy "Authenticated users can update banners"
on storage.objects for update
to authenticated
using ( bucket_id = 'conference-banners' );

-- Allow authenticated users to delete banners
create policy "Authenticated users can delete banners"
on storage.objects for delete
to authenticated
using ( bucket_id = 'conference-banners' );
