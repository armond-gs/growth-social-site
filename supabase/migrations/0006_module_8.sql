-- Module 8. This is where "Organization" landed after coming out of
-- Limitless in 0005 — it's Lesson 2 here.
--
-- Non-destructive and safe to re-run: upserts only, no drops.

insert into modules (no, title, sort_order)
values ('08', 'Module 8', 8)
on conflict (no) do update
  set title = excluded.title,
      sort_order = excluded.sort_order;

insert into lessons (module_id, no, title, video_uid, duration_seconds, sort_order)
select m.id, v.no, v.title, v.video_uid, v.duration_seconds, v.sort_order
from modules m
cross join (values
  ('L01', 'Intro to Scaling', 'f1dfcab63db539a3c3e21a725f469280'::text,  45::int, 0),
  ('L02', 'Organization',     '2c47985b2d281a9aea436600c7ab4339'::text, 223::int, 1)
) as v(no, title, video_uid, duration_seconds, sort_order)
where m.no = '08'
on conflict (module_id, no) do update
  set title            = excluded.title,
      video_uid        = excluded.video_uid,
      duration_seconds = excluded.duration_seconds,
      sort_order       = excluded.sort_order;
