-- Create plays table for analytics tracking
create table if not exists public.plays (
  id bigint generated always as identity primary key,
  track_id bigint references public.tracks(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  played_at timestamptz default now()
);

-- Enable RLS
alter table public.plays enable row level security;

-- Policies
create policy "Anyone can read plays"
  on public.plays for select using (true);

create policy "Service can insert plays"
  on public.plays for insert with check (true);

-- Indexes for performance
create index if not exists idx_plays_track_id on public.plays(track_id);
create index if not exists idx_plays_user_id on public.plays(user_id);
create index if not exists idx_plays_played_at on public.plays(played_at);
