-- Check policies for withdrawals
select * from pg_policies where table_name = 'withdrawals';

-- Check policies for storage.objects
select * from pg_policies where table_name = 'objects';

-- Check buckets
select * from storage.buckets;
