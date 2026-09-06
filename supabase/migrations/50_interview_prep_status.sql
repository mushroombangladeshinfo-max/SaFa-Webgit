-- A prep-readiness lifecycle distinct from the interview's own scheduling
-- status (scheduled/completed/cancelled): "have I actually prepared for
-- this one yet?" Surfaced in job-interviews.html next to the AI prep
-- button, auto-advanced to 'in_progress' once AI prep has been generated.
alter table public.job_interviews
  add column preparation_status text not null default 'not_started'
    check (preparation_status in ('not_started', 'in_progress', 'ready'));
