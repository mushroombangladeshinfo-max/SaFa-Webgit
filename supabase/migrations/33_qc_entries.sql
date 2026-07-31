-- Contamination had the exact same one-room limitation harvest did before
-- migration 20: a single flat qc-contam-room/-type/-bags/-action set per
-- day, with "multiple" as a flag that discards which rooms and loses any
-- per-room detail (different bag counts, different contamination type per
-- room). Same fix: a proper child table, one row per room actually
-- affected that day, with a repeatable "add another" block in quick-log
-- instead of a lossy "multiple" option.
--
-- farm_daily_logs.contam_event/contam_bags stay as the daily
-- exists/sum-across-entries aggregate (same role harvest_fresh_a etc. play
-- for harvest_entries) since v_contamination_weather_weekly already reads
-- only those two columns (supabase/migrations/25_harvest_integration_views.sql)
-- -- no view changes needed. contam_room/contam_type/contam_action are
-- superseded by this table's room/contam_type/action (per entry, not one
-- ambiguous flat value) -- quick-log.html stops writing them going
-- forward, columns stay in schema unused, same non-destructive pattern as
-- migrations 19/20.

create table public.qc_entries (
  id           uuid primary key default gen_random_uuid(),
  log_date     date not null references public.farm_daily_logs(log_date) on delete cascade,
  room         text,
  contam_type  text,
  bags         int,
  action       text,
  created_at   timestamptz not null default now()
);

alter table public.qc_entries enable row level security;

create policy qc_entries_admin on public.qc_entries
  for all using (is_admin()) with check (is_admin());

create index qc_entries_log_date_idx on public.qc_entries(log_date);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'qc_entries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.qc_entries;
  END IF;
END $$;
