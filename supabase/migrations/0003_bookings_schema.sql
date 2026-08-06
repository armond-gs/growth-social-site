-- Native booking system: replaces linking out to a third-party scheduler.
--
-- Safe to re-run pre-launch: drops and rebuilds the table. Stop re-running
-- this the moment a real prospect has booked a call.

drop table if exists bookings cascade;

create table bookings (
  id uuid primary key default gen_random_uuid(),

  -- The slot itself. Stored as timestamptz (i.e. an absolute instant, UTC
  -- under the hood) so it means the same moment regardless of where the
  -- prospect or the agency is reading it from. Wall-clock times only ever
  -- get derived for display.
  starts_at timestamptz not null,
  duration_minutes int not null,

  -- Captured so we can show a booking back to the prospect in the timezone
  -- they actually booked from, rather than guessing later.
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
-- Partial, so a cancelled booking frees its slot back up.
create unique index bookings_unique_active_slot
  on bookings (starts_at)
  where status = 'confirmed';

-- Drives the availability lookup for the visible date range.
create index bookings_starts_at_idx on bookings (starts_at);

alter table bookings enable row level security;

-- Booking a call is a public action — prospects are anonymous, so inserts
-- come through the anon role. Everything the client is allowed to do is an
-- insert; it cannot read anyone's booking back.
create policy "anyone can request a booking" on bookings
  for insert to anon, authenticated with check (true);

-- Deliberately no select/update/delete policy for anon or authenticated.
-- With RLS on and no policy, those are denied by default, so contact
-- details are never readable from the client. Availability is computed by
-- server-side code (see src/lib/supabase/booking-queries.ts) which uses a
-- security-definer function rather than direct table reads, so it can tell
-- which slots are taken without ever exposing who booked them.

-- Returns only the start times of taken slots in a window — no names, no
-- emails. security definer so it bypasses RLS for this narrow purpose.
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
