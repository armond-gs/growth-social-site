-- Coach intro videos + per-user "watched" tracking, mirroring the
-- lessons/lesson_progress pattern. Kept as separate tables (not folded into
-- modules/lessons) since coach intros are onboarding content, not part of
-- the curriculum's module/lesson progress count.
--
-- Safe to re-run: drops and rebuilds these two tables cleanly each time,
-- same as 0001. Don't re-run once real creators have real watch data.

drop table if exists coach_progress cascade;
drop table if exists coaches cascade;

create table coaches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  -- Cloudflare Stream video UID + duration, same as lessons.video_uid.
  video_uid text not null,
  duration_seconds int not null,
  sort_order int not null
);

create table coach_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  coach_id uuid not null references coaches(id) on delete cascade,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, coach_id)
);

alter table coaches enable row level security;
alter table coach_progress enable row level security;

create policy "authenticated can read coaches" on coaches
  for select to authenticated using (true);

create policy "users read own coach progress" on coach_progress
  for select to authenticated using (auth.uid() = user_id);
create policy "users insert own coach progress" on coach_progress
  for insert to authenticated with check (auth.uid() = user_id);
create policy "users update own coach progress" on coach_progress
  for update to authenticated using (auth.uid() = user_id);

-- Seed: real coach intro videos already uploaded to Cloudflare Stream,
-- with their real durations pulled from Stream's own metadata.
insert into coaches (name, role, video_uid, duration_seconds, sort_order) values
  ('Noel', 'Head Coach', '4d46f76c837f878798382c8574f6759e', 162, 0),
  ('Joey', 'Head Coach', 'c3179dc3a4fb84bc024a0f1597e93d3a', 187, 1);
