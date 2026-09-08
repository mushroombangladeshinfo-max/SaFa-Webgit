-- Tracks the Bundesagentur für Arbeit reference number a tracked
-- opportunity was imported from (via Job Discovery), so the Discovery
-- results list can detect "you already imported this one" instead of
-- risking a duplicate opportunity on a repeat search.

alter table public.job_opportunities
  add column discovery_source_ref text;

create index job_opportunities_discovery_source_ref_idx
  on public.job_opportunities(discovery_source_ref)
  where discovery_source_ref is not null;
