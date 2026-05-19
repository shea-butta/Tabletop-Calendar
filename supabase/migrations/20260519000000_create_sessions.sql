-- Tabletop gaming sessions scheduled on the calendar.

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  session_date date not null,
  start_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sessions_session_date_idx on public.sessions (session_date);

-- TODO: enable RLS and add per-user policies once auth is wired up.
-- The table is reachable via the anon key for local development only.
