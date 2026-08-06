-- Creator Academy schema: curriculum + per-user progress tracking.
--
-- Non-destructive and safe to re-run. It must stay that way: these files are
-- visible to Supabase's GitHub integration, which applies any migration not
-- recorded in supabase_migrations.schema_migrations. Since the original
-- versions of these were applied by hand in the SQL Editor, they are not
-- recorded — so an integration run would replay them. An earlier revision of
-- this file opened with `drop table ... cascade`, which in that situation
-- would have wiped real progress data. Never reintroduce a drop here.

create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  no text not null unique,
  title text not null,
  sort_order int not null
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules(id) on delete cascade,
  no text not null,
  title text not null,
  -- Cloudflare Stream video UID — null until the real lesson video is
  -- uploaded. duration_seconds comes from Stream's own metadata, so it's
  -- null until then too.
  video_uid text,
  duration_seconds int,
  sort_order int not null,
  unique (module_id, no)
);

create table if not exists lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  seconds_watched int not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table modules enable row level security;
alter table lessons enable row level security;
alter table lesson_progress enable row level security;

-- Policies are dropped and recreated rather than created blind: `create
-- policy` has no `if not exists`, so a re-run would otherwise fail with
-- 42710. Dropping a policy touches no rows.
drop policy if exists "authenticated can read modules" on modules;
create policy "authenticated can read modules" on modules
  for select to authenticated using (true);

drop policy if exists "authenticated can read lessons" on lessons;
create policy "authenticated can read lessons" on lessons
  for select to authenticated using (true);

drop policy if exists "users read own progress" on lesson_progress;
create policy "users read own progress" on lesson_progress
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "users insert own progress" on lesson_progress;
create policy "users insert own progress" on lesson_progress
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "users update own progress" on lesson_progress;
create policy "users update own progress" on lesson_progress
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Seed: modules. `on conflict do nothing` so a replay is a no-op instead of
-- a duplicate-key failure, and so any title edits made in the dashboard
-- aren't silently reverted.
insert into modules (no, title, sort_order) values
  ('00', 'Limitless', 0),
  ('01', 'UGC Fundamentals', 1),
  ('02', 'Filming', 2),
  ('03', 'Editing', 3),
  ('04', 'Portfolio Creation', 4),
  ('05', 'Landing Clients', 5),
  ('06', 'Scaling', 6)
on conflict (no) do nothing;

-- Seed: lessons. Same reasoning — and critically, this must not clobber
-- video_uid/duration_seconds once real videos have been wired in.
insert into lessons (module_id, no, title, sort_order)
select id, 'L01', 'Understanding Limitless', 0 from modules where no = '00'
union all select id, 'L02', 'Lifestyle', 1 from modules where no = '00'
union all select id, 'L03', 'Friends', 2 from modules where no = '00'

union all select id, 'L01', 'What UGC Actually Is', 0 from modules where no = '01'
union all select id, 'L02', 'How Brands Think', 1 from modules where no = '01'
union all select id, 'L03', 'Why Most Creators Stay Stuck', 2 from modules where no = '01'
union all select id, 'L04', 'The UGC Opportunity in 2026', 3 from modules where no = '01'

union all select id, 'L01', 'Lighting', 0 from modules where no = '02'
union all select id, 'L02', 'Audio', 1 from modules where no = '02'
union all select id, 'L03', 'Backgrounds', 2 from modules where no = '02'
union all select id, 'L04', 'Hooks', 3 from modules where no = '02'
union all select id, 'L05', 'Speaking Naturally', 4 from modules where no = '02'

union all select id, 'L01', 'Why Editing Matters', 0 from modules where no = '03'
union all select id, 'L02', 'Retention', 1 from modules where no = '03'
union all select id, 'L03', 'Captions', 2 from modules where no = '03'
union all select id, 'L04', 'Pacing', 3 from modules where no = '03'
union all select id, 'L05', 'Pattern Interrupts', 4 from modules where no = '03'
union all select id, 'L06', 'Ad-Style Editing', 5 from modules where no = '03'

union all select id, 'L01', 'What Brands Look For', 0 from modules where no = '04'
union all select id, 'L02', 'Building Your First Portfolio', 1 from modules where no = '04'
union all select id, 'L03', 'Spec Ads', 2 from modules where no = '04'
union all select id, 'L04', 'Portfolio Mistakes', 3 from modules where no = '04'
union all select id, 'L05', 'Portfolio Review', 4 from modules where no = '04'

union all select id, 'L01', 'Outreach', 0 from modules where no = '05'
union all select id, 'L02', 'Email', 1 from modules where no = '05'
union all select id, 'L03', 'DMs', 2 from modules where no = '05'
union all select id, 'L04', 'Pricing', 3 from modules where no = '05'
union all select id, 'L05', 'Negotiation', 4 from modules where no = '05'
union all select id, 'L06', 'Retainers', 5 from modules where no = '05'

union all select id, 'L01', 'Systems', 0 from modules where no = '06'
union all select id, 'L02', 'AI', 1 from modules where no = '06'
union all select id, 'L03', 'Getting to $10k+/month', 2 from modules where no = '06'
on conflict (module_id, no) do nothing;
