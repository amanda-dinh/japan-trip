create table if not exists public.trip_checklist (
  trip_id text not null,
  item_id text not null,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (trip_id, item_id)
);

create table if not exists public.trip_notes (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null,
  note_key text not null,
  author text not null,
  content text not null,
  parent_note_id uuid references public.trip_notes(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.trip_checklist_subtasks (
  trip_id text not null,
  subtask_id text not null,
  parent_item_id text not null,
  assignee text not null,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (trip_id, subtask_id)
);

-- Run this line separately for an existing project created before threads were added.
alter table public.trip_notes
  add column if not exists parent_note_id uuid references public.trip_notes(id) on delete cascade;

create index if not exists trip_notes_lookup
  on public.trip_notes (trip_id, note_key, created_at);

create index if not exists trip_notes_thread_lookup
  on public.trip_notes (parent_note_id);

alter table public.trip_checklist enable row level security;
alter table public.trip_notes enable row level security;
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

-- Shared-trip mode: the public anon key can read and write this trip.
-- Add authentication and replace these policies before using the site for private data.
create policy "Anyone can read shared checklist"
  on public.trip_checklist for select
  using (trip_id = 'japan-trip-2027');

create policy "Anyone can update shared checklist"
  on public.trip_checklist for insert
  with check (trip_id = 'japan-trip-2027');

create policy "Anyone can change shared checklist"
  on public.trip_checklist for update
  using (trip_id = 'japan-trip-2027')
  with check (trip_id = 'japan-trip-2027');

create policy "Anyone can read shared notes"
  on public.trip_notes for select
  using (trip_id = 'japan-trip-2027');

create policy "Anyone can add shared notes"
  on public.trip_notes for insert
  with check (trip_id = 'japan-trip-2027');

create policy "Anyone can delete shared notes"
  on public.trip_notes for delete
  using (trip_id = 'japan-trip-2027');
