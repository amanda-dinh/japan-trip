-- Run this migration in Supabase SQL Editor after the existing schema.sql.
-- Existing checklist and notes data is not changed.
create table if not exists public.trip_checklist_subtasks (
  trip_id text not null,
  subtask_id text not null,
  parent_item_id text not null,
  assignee text not null,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (trip_id, subtask_id)
);

alter table public.trip_checklist_subtasks enable row level security;

create policy "Anyone can read shared checklist subtasks"
  on public.trip_checklist_subtasks for select
  using (trip_id = 'japan-trip-2027');

create policy "Anyone can update shared checklist subtasks"
  on public.trip_checklist_subtasks for insert
  with check (trip_id = 'japan-trip-2027');

create policy "Anyone can change shared checklist subtasks"
  on public.trip_checklist_subtasks for update
  using (trip_id = 'japan-trip-2027')
  with check (trip_id = 'japan-trip-2027');