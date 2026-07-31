-- Inoculation had the same limitation harvest and contamination did before
-- this session's migrations 20/33: substrate_kg/bags_count on `batches`
-- are set ONCE at batch creation with no way to add more, which caps BE%
-- accuracy for any batch inoculated in stages (e.g. 40 bags day 1, 20 more
-- day 5, same cohort). Same fix: a proper child table, one row per
-- room/batch actually inoculated that day, summed for BE% instead of
-- read from a write-once column.
--
-- Checked before writing this: both existing batches (1-A, 1-B) already
-- have NULL substrate_kg/bags_count (never entered at creation, per
-- quick-log's own "batch will still be created, just calculations won't
-- show" disclaimer) -- so there is no existing BE% data to preserve, and
-- no backfill rows are needed.

create table public.inoculation_entries (
  id                   uuid primary key default gen_random_uuid(),
  log_date             date not null references public.farm_daily_logs(log_date) on delete cascade,
  batch_number         text references public.batches(batch_number),
  room                 text,
  substrate_type       text,
  substrate_kg         numeric,
  bags_count           int,
  bags_discarded       int,
  spawn_kg_used        numeric,
  spawn_source         text check (spawn_source in ('purchased','inhouse')),
  grain_spawn_batch_id bigint,
  notes                text,
  created_at           timestamptz not null default now()
);

alter table public.inoculation_entries enable row level security;

create policy inoculation_entries_admin on public.inoculation_entries
  for all using (is_admin()) with check (is_admin());

create index inoculation_entries_log_date_idx on public.inoculation_entries(log_date);
create index inoculation_entries_batch_idx on public.inoculation_entries(batch_number);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'inoculation_entries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inoculation_entries;
  END IF;
END $$;

-- v_batch_yield: substrate_kg/bags_count now summed from inoculation_entries
-- instead of read directly off batches (which stays in schema, unused
-- going forward -- same non-destructive pattern as every other superseded
-- column this session). Structurally identical GREATEST/be_pct/yield_per_bag_kg
-- logic to migration 22, just fed by the new sum.
drop view public.v_batch_yield;

create view public.v_batch_yield
with (security_invoker = true) as
select
  b.batch_number,
  b.room,
  b.spawn_date,
  b.substrate_type,
  coalesce(ie.total_substrate_kg, 0) as substrate_kg,
  coalesce(ie.total_bags_count, 0) as bags_count,
  b.status,
  count(he.id) as flush_count,
  min(he.log_date) as first_harvest_date,
  max(he.log_date) as last_harvest_date,
  coalesce(sum(he.fresh_a_kg),0) as total_fresh_a_kg,
  coalesce(sum(he.fresh_rej_kg),0) as total_fresh_rej_kg,
  coalesce(sum(he.healthy_kg),0) as total_healthy_kg,
  coalesce(sum(he.recovered_kg),0) as total_recovered_kg,
  greatest(
    coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0),
    coalesce(sum(he.healthy_kg),0) + coalesce(sum(he.recovered_kg),0)
  ) as total_fresh_kg,
  case when coalesce(ie.total_substrate_kg,0) > 0
    then round((greatest(
      coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0),
      coalesce(sum(he.healthy_kg),0) + coalesce(sum(he.recovered_kg),0)
    ) / ie.total_substrate_kg * 100)::numeric, 1)
    else null
  end as be_pct,
  case when coalesce(ie.total_bags_count,0) > 0
    then round((greatest(
      coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0),
      coalesce(sum(he.healthy_kg),0) + coalesce(sum(he.recovered_kg),0)
    ) / ie.total_bags_count)::numeric, 3)
    else null
  end as yield_per_bag_kg
from public.batches b
left join public.harvest_entries he on he.batch_number = b.batch_number
left join (
  select batch_number, sum(substrate_kg) as total_substrate_kg, sum(bags_count) as total_bags_count
  from public.inoculation_entries
  where batch_number is not null
  group by batch_number
) ie on ie.batch_number = b.batch_number
group by b.batch_number, b.room, b.spawn_date, b.substrate_type, b.status, ie.total_substrate_kg, ie.total_bags_count;

grant select on public.v_batch_yield to authenticated;
