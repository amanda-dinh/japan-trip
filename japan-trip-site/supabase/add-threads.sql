-- Run this migration in Supabase SQL Editor after the original schema.sql.
alter table public.trip_notes
  add column if not exists parent_note_id uuid references public.trip_notes(id) on delete cascade;

create index if not exists trip_notes_thread_lookup
  on public.trip_notes (parent_note_id);
