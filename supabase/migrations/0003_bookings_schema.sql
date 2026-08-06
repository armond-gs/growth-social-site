-- Native booking system: replaces linking out to a third-party scheduler.
--
-- Non-destructive and safe to re-run — see the note at the top of
-- 0001_academy_schema.sql. This one matters most: bookings holds real
-- prospect enquiries, and an earlier revision opened with
-- `drop table if exists bookings cascade`. Never add a drop here.

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),

  -- The slot itself. timestamptz (an absolute instant) so it means the same
  -- moment wherever it's read from; wall-clock time is only ever derived for
  -- display.
  starts_at timestamptz not null,
  duration_minutes int not null,

  -- Captured so a booking can be shown back in the zone it was made from
  -- rather than guessed at later.
  guest_timezone text not null,

  name text not null,
  email text not null,
  brand text,
  budget_range text,
  website text,
  details text,

  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Stops two people racing into the same slot: the second insert violates
-- this and the server action turns it into a "just got taken" message.
-- Partial, so cancelling frees the slot back up.
create unique index if not exists bookings_unique_active_slot
  on bookings (starts_at)
  where status = 'confirmed';

-- Drives the availability lookup for the visible date range.
create index if not exists bookings_starts_at_idx on bookings (starts_at);

alter table bookings enable row level security;

-- Booking is a public action — prospects are anonymous, so inserts come
-- through the anon role. Insert is all the client may do.
drop policy if exists "anyone can request a booking" on bookings;
create policy "anyone can request a booking" on bookings
  for insert to anon, authenticated with check (true);

-- Deliberately no select/update/delete policy. With RLS on and no policy
-- those are denied by default, so contact details are never readable from
-- the client. Availability comes from the function below instead, which can
-- report which slots are taken without exposing who booked them.
create or replace function taken_slots(range_start timestamptz, range_end timestamptz)
returns table (starts_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select b.starts_at
  from bookings b
  where b.status = 'confirmed'
    and b.starts_at >= range_start
    and b.starts_at < range_end;
$$;

grant execute on function taken_slots(timestamptz, timestamptz) to anon, authenticated;
