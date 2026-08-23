-- Curriculum is Limitless followed by Module 1–8, so the descriptive titles
-- give way to plain numbers. Limitless keeps its name.
--
-- Only titles change here. The `no` column stays as it is ('01'…'08'): it's
-- the stable key every other migration joins on, and lesson_progress hangs off
-- lesson ids regardless, so nobody's completion history is affected.
--
-- Non-destructive and safe to re-run.

update modules set title = 'Module 1' where no = '01';  -- was UGC Fundamentals
update modules set title = 'Module 2' where no = '02';  -- was Filming
update modules set title = 'Module 3' where no = '03';  -- was Editing
update modules set title = 'Module 4' where no = '04';  -- was Portfolio Creation
update modules set title = 'Module 5' where no = '05';  -- was Landing Clients
update modules set title = 'Module 6' where no = '06';  -- was Scaling
update modules set title = 'Module 7' where no = '07';
update modules set title = 'Module 8' where no = '08';
