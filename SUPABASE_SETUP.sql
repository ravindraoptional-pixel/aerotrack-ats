-- AeroTrack ATS: private shared CV storage and realtime updates.
-- Run this in Supabase SQL Editor after confirming the team_members table has user_id and team_id.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'candidate-cvs',
  'candidate-cvs',
  false,
  15728640,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = false,
  file_size_limit = 15728640,
  allowed_mime_types = excluded.allowed_mime_types;

-- Team members can view files stored under their own team UUID folder.
create policy "Team members can view their team CVs"
on storage.objects for select to authenticated
using (
  bucket_id = 'candidate-cvs'
  and exists (
    select 1 from public.team_members m
    where m.team_id::text = (storage.foldername(name))[1]
      and m.user_id = auth.uid()
  )
);

create policy "Team members can upload their team CVs"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'candidate-cvs'
  and exists (
    select 1 from public.team_members m
    where m.team_id::text = (storage.foldername(name))[1]
      and m.user_id = auth.uid()
  )
);

create policy "Team members can delete their team CVs"
on storage.objects for delete to authenticated
using (
  bucket_id = 'candidate-cvs'
  and exists (
    select 1 from public.team_members m
    where m.team_id::text = (storage.foldername(name))[1]
      and m.user_id = auth.uid()
  )
);

-- Enable realtime broadcasts for the shared ATS tables if not already published.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'candidates'
  ) then
    alter publication supabase_realtime add table public.candidates;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'jobs'
  ) then
    alter publication supabase_realtime add table public.jobs;
  end if;
end $$;
