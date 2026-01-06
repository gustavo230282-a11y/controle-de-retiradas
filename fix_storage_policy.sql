-- Ensure bucket is public
update storage.buckets
set public = true
where id = 'receipts';

-- Drop existing policies to avoid conflicts if they exist with slightly different definitions
drop policy if exists "Receipts are publicly accessible" on storage.objects;
drop policy if exists "Authenticated users can upload receipts" on storage.objects;

-- Re-create Policies
create policy "Receipts are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'receipts' );

create policy "Authenticated users can upload receipts"
  on storage.objects for insert
  with check ( bucket_id = 'receipts' and auth.role() = 'authenticated' );
