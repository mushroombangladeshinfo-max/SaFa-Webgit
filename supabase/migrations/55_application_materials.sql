-- Cover letter + application-question answer drafting, both evidence-
-- constrained like CV Studio. Neither needs CV Studio's versioning/
-- lineage — a cover letter and a set of application answers are already
-- inherently per-opportunity, so these are additive columns on
-- job_opportunities rather than a new table.

alter table public.job_opportunities
  add column cover_letter        jsonb,
  add column application_answers jsonb not null default '[]'::jsonb;
