-- Critical review of quick-log.html's বিক্রি (Sales) step found the same
-- "one thing per day" limitation harvest/contamination/inoculation all had
-- before this session's fixes: s_b2b_name/qty/value and fnf_name/qty/value
-- are single flat fields, so a second B2B buyer or a second friends-and-
-- family sale on the same day silently has nowhere to go. This directly
-- undermines today's v_b2b_receivables (migration 31), which assumes it's
-- seeing every B2B sale. Samples had a separate bug: nested inside the
-- "did a sale happen today?" gate, so a day with ONLY a free sample given
-- (zero revenue) would never even show the samples fields. And "নষ্ট/ফেরত"
-- conflated two different accounting events (spoilage vs a customer
-- return, which should reverse recognized revenue) into one number.
--
-- Same fix pattern as before: three child tables (b2b_sale_entries,
-- fnf_sale_entries, sample_entries), one row per real event, summed into
-- farm_daily_logs' existing aggregate columns for the views that need a
-- daily total (v_channel_kg_weekly, v_marketing_samples_monthly) --
-- s_b2b_qty/value and fnf_qty/value stay meaningful aggregates, only
-- s_b2b_name/fnf_name are superseded (a single name can't represent
-- multiple buyers/people in one day). v_b2b_receivables is redesigned to
-- read the entries table directly instead, since it groups by buyer name
-- across ALL days, which a daily aggregate fundamentally can't preserve
-- once more than one buyer is possible per day.

create table public.b2b_sale_entries (
  id            uuid primary key default gen_random_uuid(),
  log_date      date not null references public.farm_daily_logs(log_date) on delete cascade,
  business_name text not null,
  qty           numeric,
  value         numeric,
  notes         text,
  created_at    timestamptz not null default now()
);

create table public.fnf_sale_entries (
  id            uuid primary key default gen_random_uuid(),
  log_date      date not null references public.farm_daily_logs(log_date) on delete cascade,
  person_name   text,
  qty           numeric,
  value         numeric,
  notes         text,
  created_at    timestamptz not null default now()
);

create table public.sample_entries (
  id            uuid primary key default gen_random_uuid(),
  log_date      date not null references public.farm_daily_logs(log_date) on delete cascade,
  recipient     text,
  fresh_kg      numeric,
  dried_kg      numeric,
  powder_kg     numeric,
  notes         text,
  created_at    timestamptz not null default now()
);

alter table public.b2b_sale_entries enable row level security;
alter table public.fnf_sale_entries enable row level security;
alter table public.sample_entries   enable row level security;

create policy b2b_sale_entries_admin on public.b2b_sale_entries
  for all using (is_admin()) with check (is_admin());
create policy fnf_sale_entries_admin on public.fnf_sale_entries
  for all using (is_admin()) with check (is_admin());
create policy sample_entries_admin on public.sample_entries
  for all using (is_admin()) with check (is_admin());

create index b2b_sale_entries_log_date_idx on public.b2b_sale_entries(log_date);
create index fnf_sale_entries_log_date_idx on public.fnf_sale_entries(log_date);
create index sample_entries_log_date_idx   on public.sample_entries(log_date);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='b2b_sale_entries') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.b2b_sale_entries;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='fnf_sale_entries') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.fnf_sale_entries;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='sample_entries') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sample_entries;
  END IF;
END $$;

-- Backfill: real existing data on farm_daily_logs.s_b2b_name/qty/value and
-- sample_fresh_kg (checked before writing this) would otherwise silently
-- disappear from v_b2b_receivables/v_marketing_samples_monthly once those
-- flat columns stop being the read source -- one row each, carrying
-- forward exactly what's already there. fnf_name has no existing rows, no
-- backfill needed there.
insert into public.b2b_sale_entries (log_date, business_name, qty, value)
select log_date, s_b2b_name, s_b2b_qty, s_b2b_value
from public.farm_daily_logs
where s_b2b_name is not null;

insert into public.sample_entries (log_date, recipient, fresh_kg, dried_kg, powder_kg, notes)
select log_date, null, sample_fresh_kg, sample_dried_kg, sample_powder_kg, sample_notes
from public.farm_daily_logs
where sample_fresh_kg is not null or sample_dried_kg is not null or sample_powder_kg is not null;

-- Waste/return split: s_waste conflated spoilage (pure loss) with customer
-- returns (which should reverse recognized revenue). New columns added
-- non-destructively; s_waste stays in schema, unused going forward.
alter table public.farm_daily_logs
  add column s_waste_kg      numeric,
  add column s_returned_kg   numeric,
  add column s_returned_value numeric;

-- v_b2b_receivables: now reads b2b_sale_entries directly (groups by buyer
-- across ALL days) instead of farm_daily_logs.s_b2b_name/value, which
-- could only ever represent one buyer per day.
drop view public.v_b2b_receivables;

create view public.v_b2b_receivables
with (security_invoker = true) as
with sold as (
  select business_name, sum(value) as total_sold
  from public.b2b_sale_entries
  group by business_name
),
paid as (
  select business_name, sum(amount) as total_paid
  from public.b2b_payments
  group by business_name
)
select
  s.business_name,
  s.total_sold,
  coalesce(p.total_paid, 0) as total_paid,
  s.total_sold - coalesce(p.total_paid, 0) as balance_due
from sold s
left join paid p on p.business_name = s.business_name;

grant select on public.v_b2b_receivables to authenticated;

-- v_channel_kg_weekly: waste_kg now reads the new s_waste_kg column
-- (pure spoilage); returned_kg added as a new column (appended, keeps
-- existing column order intact for anything already selecting by name).
create or replace view public.v_channel_kg_weekly
with (security_invoker = true) as
select
  date_trunc('week', log_date)::date as week,
  coalesce(sum(s_fresh_kg),0) + coalesce(sum(s_dried_kg),0) + coalesce(sum(s_powder_kg),0) as retail_kg,
  coalesce(sum(s_b2b_qty),0) as b2b_kg,
  coalesce(sum(fnf_qty),0) as fnf_kg,
  coalesce(sum(sample_fresh_kg),0) + coalesce(sum(sample_dried_kg),0) + coalesce(sum(sample_powder_kg),0) as sample_kg,
  coalesce(sum(s_waste_kg),0) as waste_kg,
  coalesce(sum(s_returned_kg),0) as returned_kg
from public.farm_daily_logs
group by 1
order by 1;

grant select on public.v_channel_kg_weekly to authenticated;

-- v_ops_daily: waste_kg now means pure spoilage (s_waste_kg); a genuine
-- return reverses recognized revenue (s_returned_value subtracted from
-- farm_revenue) rather than being folded into a kg-only waste bucket that
-- had no financial meaning. Same column list/order as migration 19 to
-- keep CREATE OR REPLACE VIEW valid; only farm_revenue's expression and
-- waste_kg's source column change.
create or replace view public.v_ops_daily as
with days as (
  select log_date as day from farm_daily_logs
  union
  select expense_date as day from one_off_expenses
)
select
  d.day,
  coalesce(f.harvest_fresh_a,0) + coalesce(f.harvest_fresh_b,0) + coalesce(f.harvest_healthy_kg,0) + coalesce(f.harvest_recovered_kg,0) as harvest_fresh_kg,
  coalesce(f.harvest_dried,0) as harvest_dried_kg,
  coalesce(f.harvest_powder,0) as harvest_powder_kg,
  coalesce(f.qc_pass,0) as qc_pass_kg,
  coalesce(f.qc_fail,0) as qc_fail_kg,
  coalesce(f.s_fresh_kg,0)*coalesce(f.s_fresh_price,0) + coalesce(f.s_dried_kg,0)*coalesce(f.s_dried_price,0) + coalesce(f.s_powder_kg,0)*coalesce(f.s_powder_price,0)
    + coalesce(f.s_b2b_value,0) + coalesce(f.fnf_value,0) - coalesce(f.s_returned_value,0) as farm_revenue,
  coalesce(f.ex_spawn,0) + coalesce(f.ex_substrate,0) + coalesce(f.ex_packaging,0) + coalesce(f.ex_labor,0) + coalesce(f.ex_electricity,0) + coalesce(f.ex_transport,0) + coalesce(f.ex_water,0) + coalesce(f.ex_other,0) + coalesce(oo.amount,0) as farm_expenses,
  coalesce(f.s_waste_kg,0) as waste_kg,
  env.avg_temp,
  env.avg_humidity,
  coalesce(oo.amount,0) as one_off_expenses
from days d
left join farm_daily_logs f on f.log_date = d.day
left join (
  select expense_date as day, sum(amount) as amount
  from one_off_expenses group by expense_date
) oo on oo.day = d.day
left join (
  select created_at::date as day, round(avg(temperature),1) as avg_temp, round(avg(humidity),1) as avg_humidity
  from sensor_readings group by created_at::date
) env on env.day = d.day;

alter view public.v_ops_daily set (security_invoker = true);
