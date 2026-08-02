-- Processing (fresh→dried) becomes a repeatable, per-batch entry table —
-- same shape as harvest_entries/qc_entries/inoculation_entries. Confirmed
-- with the user: drying has ALWAYS been kept batch-separate in practice
-- (each batch stays on its own labeled rack/tray within one dryer run,
-- even on a day with multiple batches) — the earlier "always pooled"
-- answer that shaped Processing as a flat daily number was wrong, this
-- corrects it to match actual practice, not a new operational change.
--
-- Dried→powder (grinding) is explicitly NOT part of this — confirmed that
-- stage genuinely does combine dried product across batches/dates, so
-- pr_dried_in/pr_powder_out/pr_powder_reject_kg stay exactly as they are:
-- flat daily fields on farm_daily_logs, unchanged by this migration.
--
-- pr_fresh_in/pr_dried_out/pr_dried_reject_kg on farm_daily_logs are
-- superseded the same way harvest_fresh_a etc. were by harvest_entries —
-- kept as the daily SUM across today's processing_entries (quick-log.html
-- writes both), not dropped, so v_stock_reconciliation (dormant) and any
-- other reader keeps working unchanged once revived.
create table public.processing_entries (
  id              uuid primary key default gen_random_uuid(),
  log_date        date not null references public.farm_daily_logs(log_date) on delete cascade,
  batch_number    text references public.batches(batch_number),
  room            text,
  fresh_in_kg     numeric,
  dried_out_kg    numeric,
  dried_reject_kg numeric,
  created_at      timestamptz not null default now()
);

alter table public.processing_entries enable row level security;

create policy processing_entries_admin on public.processing_entries
  for all using (is_admin()) with check (is_admin());

create index processing_entries_log_date_idx on public.processing_entries(log_date);
create index processing_entries_batch_number_idx on public.processing_entries(batch_number);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'processing_entries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.processing_entries;
  END IF;
END $$;
