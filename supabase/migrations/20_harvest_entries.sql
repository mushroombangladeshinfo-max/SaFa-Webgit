-- Harvest was hard-limited to one batch/room per day: farm_daily_logs is
-- uniquely keyed on log_date (one row per day, system-wide), and Harvest's
-- "Batch" field was a single-select. A day with harvest from two rooms had
-- no way to represent that — you'd either blend both rooms' kg into one
-- number and credit only one batch, or overwrite one entry with the next
-- submit (upsert onConflict:'log_date'). This directly undercut the batch
-- traceability built in migration 18.
--
-- harvest_entries is a proper child table: one row per batch actually
-- harvested that day, so a multi-room day is just multiple rows instead of
-- one lossy blend. farm_daily_logs keeps its harvest_fresh_a/fresh_rej/
-- healthy_kg/recovered_kg columns as the daily SUM across entries (both
-- for backward compatibility and because farm-analytics.html already reads
-- those columns directly for its charts) — this table is the new detail
-- source of truth underneath that sum, enabling real per-batch yield
-- tracking later without another migration.
--
-- harvest_primary_batch/harvest_flush_num/harvest_bags_removed on
-- farm_daily_logs are superseded by this table's batch_number/flush_num/
-- bags_removed (per entry, not one ambiguous "primary" value) — confirmed
-- via grep those three columns have no readers outside quick-log.html
-- itself, so quick-log simply stops writing them going forward. Columns
-- stay in schema, unused — same non-destructive pattern as migration 19.

create table public.harvest_entries (
  id           uuid primary key default gen_random_uuid(),
  log_date     date not null references public.farm_daily_logs(log_date) on delete cascade,
  batch_number text references public.batches(batch_number),
  room         text,
  flush_num    int,
  fresh_a_kg   numeric,
  fresh_rej_kg numeric,
  healthy_kg   numeric,
  recovered_kg numeric,
  bags_removed numeric,
  created_at   timestamptz not null default now()
);

alter table public.harvest_entries enable row level security;

create policy harvest_entries_admin on public.harvest_entries
  for all using (is_admin()) with check (is_admin());

create index harvest_entries_log_date_idx on public.harvest_entries(log_date);
