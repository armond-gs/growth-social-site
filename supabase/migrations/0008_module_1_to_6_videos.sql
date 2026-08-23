-- Real lessons for Modules 2–6, from the uploaded Cloudflare files.
--
-- The placeholder lessons seeded in 0001 came from the original handoff and
-- don't correspond to what was actually filmed — "Lighting"/"Audio" were
-- Module 2's there and are Module 6's here — so they're removed rather than
-- merged, otherwise each module would show both sets.
--
-- Titles are Title Cased from the filenames ("background" -> "Background",
-- "Warm up" -> "Warm Up") to match the lessons already in the curriculum.
--
-- Module 1 is intentionally left empty: its video hadn't been uploaded when
-- this was written. Add it in a later migration.
--
-- Safe to re-run. The delete is scoped to modules 1–6 AND to lessons with no
-- video, so it can only ever remove a placeholder — replaying it after the
-- inserts below is a no-op, and it can't touch Limitless, Module 7 or 8.
-- Nobody can have progress on a lesson that was never playable, and
-- lesson_progress cascades from lesson ids regardless.

delete from lessons
where video_uid is null
  and module_id in (select id from modules where no in ('01','02','03','04','05','06'));

-- Module 2
insert into lessons (module_id, no, title, video_uid, duration_seconds, sort_order)
select m.id, v.no, v.title, v.video_uid, v.duration_seconds, v.sort_order
from modules m
cross join (values
  ('L01', 'Why You Will Fail', 'e07ba61d32874dfe3bd1f138df29f89f'::text, 34::int, 0)
) as v(no, title, video_uid, duration_seconds, sort_order)
where m.no = '02'
on conflict (module_id, no) do update
  set title = excluded.title, video_uid = excluded.video_uid,
      duration_seconds = excluded.duration_seconds, sort_order = excluded.sort_order;

-- Module 3
insert into lessons (module_id, no, title, video_uid, duration_seconds, sort_order)
select m.id, v.no, v.title, v.video_uid, v.duration_seconds, v.sort_order
from modules m
cross join (values
  ('L01', 'UGC Styles', 'db4b2e130dc06ff3f7ca1f10f0a95055'::text, 62::int, 0)
) as v(no, title, video_uid, duration_seconds, sort_order)
where m.no = '03'
on conflict (module_id, no) do update
  set title = excluded.title, video_uid = excluded.video_uid,
      duration_seconds = excluded.duration_seconds, sort_order = excluded.sort_order;

-- Module 4
insert into lessons (module_id, no, title, video_uid, duration_seconds, sort_order)
select m.id, v.no, v.title, v.video_uid, v.duration_seconds, v.sort_order
from modules m
cross join (values
  ('L01', 'Brand Deals',       'f69702a48ad53be07226bdba8d77fc8b'::text,  21::int, 0),
  ('L02', 'Creating Accounts', 'a9682e5a6d81be3b627d339897ca534e'::text,  26::int, 1),
  ('L03', 'Warm Up',           '0e45e1b374f28e23d1be6511a085c8c0'::text, 114::int, 2)
) as v(no, title, video_uid, duration_seconds, sort_order)
where m.no = '04'
on conflict (module_id, no) do update
  set title = excluded.title, video_uid = excluded.video_uid,
      duration_seconds = excluded.duration_seconds, sort_order = excluded.sort_order;

-- Module 5
insert into lessons (module_id, no, title, video_uid, duration_seconds, sort_order)
select m.id, v.no, v.title, v.video_uid, v.duration_seconds, v.sort_order
from modules m
cross join (values
  ('L01', 'Scripting (Easy)',     '773f6545767e9d09ac7e0aa5ffb5c906'::text,  49::int, 0),
  ('L02', 'Scripting (Advanced)', 'ee735a790a76296c752220be588abfec'::text, 167::int, 1)
) as v(no, title, video_uid, duration_seconds, sort_order)
where m.no = '05'
on conflict (module_id, no) do update
  set title = excluded.title, video_uid = excluded.video_uid,
      duration_seconds = excluded.duration_seconds, sort_order = excluded.sort_order;

-- Module 6
insert into lessons (module_id, no, title, video_uid, duration_seconds, sort_order)
select m.id, v.no, v.title, v.video_uid, v.duration_seconds, v.sort_order
from modules m
cross join (values
  ('L01', 'Lighting',   '15bc7e29b108e0e4454c27e791b231f0'::text, 54::int, 0),
  ('L02', 'Audio',      '337efd5a585e7fccf0c6b570778e0c0a'::text, 37::int, 1),
  ('L03', 'Background', '9d2793db5c2c783fd84e6dbb0a2a00e8'::text, 36::int, 2),
  ('L04', 'Speaking',   'e0fcc26450a1460f3e983c4ef993d37b'::text, 23::int, 3)
) as v(no, title, video_uid, duration_seconds, sort_order)
where m.no = '06'
on conflict (module_id, no) do update
  set title = excluded.title, video_uid = excluded.video_uid,
      duration_seconds = excluded.duration_seconds, sort_order = excluded.sort_order;
