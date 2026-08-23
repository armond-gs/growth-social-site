-- Adds Reece and Armond to the intro section (now "Meet the team" rather than
-- "Meet your coaches" — it holds operations people as well as coaches), and
-- takes "Organization" out of Limitless now that it's becoming its own module.
--
-- Safe to re-run. The one destructive statement is deliberately narrow: it
-- deletes a single named lesson, targeted by title rather than by position,
-- so replaying it can't take "Actually Starting" with it once that lesson has
-- moved up into the L04 slot.
--
-- NOTE ON THE TABLE NAME: this still lives in `coaches`. Renaming it to
-- `team` would mean rewriting the table, its FK from coach_progress, the RLS
-- policies and every query — a lot of churn on live data for a naming nicety.
-- The `role` column already carries the distinction that matters.

-- ---------------------------------------------------------------------------
-- Team intros. Order is Noel, Joey, Reece, Armond.
-- ---------------------------------------------------------------------------
insert into coaches (name, role, video_uid, duration_seconds, sort_order) values
  ('Reece',  'Operations', 'de2d8e7fe979f0b2038757523c36ef1e', 85, 2),
  ('Armond', 'Operations', '3a94652e834f3c801cb320b66973d890', 59, 3)
on conflict (video_uid) do update
  set name             = excluded.name,
      role             = excluded.role,
      duration_seconds = excluded.duration_seconds,
      sort_order       = excluded.sort_order;

-- Keep the existing two explicitly ordered ahead of them, so a re-run can't
-- leave the section in a surprising order.
update coaches set sort_order = 0 where name = 'Noel';
update coaches set sort_order = 1 where name = 'Joey';

-- ---------------------------------------------------------------------------
-- Limitless: drop "Organization" and close the gap it leaves.
-- ---------------------------------------------------------------------------
delete from lessons
where title = 'Organization'
  and module_id = (select id from modules where no = '00');

-- "Actually Starting" moves up into the vacated slot. Targeted by title, and
-- run after the delete so it can't collide with the unique (module_id, no).
-- lesson_progress references lesson ids, not numbers, so renumbering here
-- doesn't disturb anyone's completion history.
update lessons
set no = 'L04', sort_order = 3
where title = 'Actually Starting'
  and module_id = (select id from modules where no = '00');
