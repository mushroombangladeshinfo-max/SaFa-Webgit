-- batches.status was a half-built feature: read by quick-log.html's batch
-- dropdowns (WHERE status='active'), dashboard.html's active-batch KPI
-- (status != 'done'), and home.html's AI snapshot -- but written exactly
-- once, at creation, and never updated anywhere. Every batch ever created
-- stays 'active' forever, so those filters silently accumulate every
-- historical batch rather than reflecting what's actually still growing.
-- No check constraint existed either -- status was unconstrained free text.
--
-- Standardizing on 'active'/'done' (matches dashboard.html's existing
-- `!== 'done'` check, not harvest-log.html's unused '.retired' CSS class,
-- which nothing ever wrote).
alter table public.batches
  add constraint batches_status_check check (status in ('active','done'));
