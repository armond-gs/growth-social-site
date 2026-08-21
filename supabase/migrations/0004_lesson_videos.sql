-- Wires the first uploaded Cloudflare Stream videos into the curriculum:
-- the full Limitless module, a new Module 7, and Joey's re-uploaded intro.
--
-- Non-destructive and safe to re-run, same as the earlier migrations — every
-- statement is an upsert or a targeted update, so replaying it can't drop a
-- lesson or wipe a creator's progress. Never add a drop here.
--
-- Durations are Cloudflare's own, rounded to whole seconds (the column is int).

-- ---------------------------------------------------------------------------
-- Module 00 — Limitless
-- Backfills the video for each lesson. "Organization" originally sat here as
-- L04 without a video; it moved out to its own module, so this file no longer
-- creates it and 0005 removes the row this one already inserted. Both files
-- describe the same end state, so replaying them in order is safe.
-- ---------------------------------------------------------------------------
insert into lessons (module_id, no, title, video_uid, duration_seconds, sort_order)
select m.id, v.no, v.title, v.video_uid, v.duration_seconds, v.sort_order
from modules m
cross join (values
  ('L01', 'Understanding Limitless', '474b92dd47c3dfc9a2e67f1c245c0c08'::text, 312::int, 0),
  ('L02', 'Lifestyle',               '7641c7735ac2029fb0e8d5fd063f6465'::text, 150::int, 1),
  ('L03', 'Friends',                 'f46e7ad19237fb5dc16ca1d8c748105e'::text, 143::int, 2),
  ('L04', 'Actually Starting',       'fac28b4db85b38fe051fe2b2e25d2e29'::text, 272::int, 3)
) as v(no, title, video_uid, duration_seconds, sort_order)
where m.no = '00'
on conflict (module_id, no) do update
  set title            = excluded.title,
      video_uid        = excluded.video_uid,
      duration_seconds = excluded.duration_seconds,
      sort_order       = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- Module 07
-- ---------------------------------------------------------------------------
insert into modules (no, title, sort_order)
values ('07', 'Module 7', 7)
on conflict (no) do update
  set title = excluded.title,
      sort_order = excluded.sort_order;

insert into lessons (module_id, no, title, video_uid, duration_seconds, sort_order)
select m.id, v.no, v.title, v.video_uid, v.duration_seconds, v.sort_order
from modules m
cross join (values
  ('L01', 'Live Filming', '36711456bb15f1cdde9ab4d4a778852d'::text, 170::int, 0),
  ('L02', 'Live Editing', '0eed2d715f4672914dfddd972710ad36'::text,  96::int, 1)
) as v(no, title, video_uid, duration_seconds, sort_order)
where m.no = '07'
on conflict (module_id, no) do update
  set title            = excluded.title,
      video_uid        = excluded.video_uid,
      duration_seconds = excluded.duration_seconds,
      sort_order       = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- Joey's intro was re-uploaded, and the original was deleted from Cloudflare —
-- the old uid 404s, so his card is currently broken until this runs.
-- ---------------------------------------------------------------------------
update coaches
set video_uid = '0516b696ef18460a3abee4d6baa0fa6a',
    duration_seconds = 55
where name = 'Joey';
