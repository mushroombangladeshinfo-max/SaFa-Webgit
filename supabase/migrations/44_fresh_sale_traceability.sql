-- Fresh-sale batch traceability. Confirmed with the user: fresh harvest
-- from multiple batches gets stored together today (one pooled fridge
-- container), which is why no sale has ever been batch-traceable — but
-- fresh sells within about a week while a batch's active life is longer,
-- so keeping each batch's harvest in its own labeled bag (a cheap
-- operational habit, not a software problem) makes real traceability
-- achievable for FRESH sales specifically. Dried/powder stay permanently
-- pooled — that break happens at the dryer, a physical/equipment
-- constraint already confirmed earlier, not something this fixes.
--
-- Every field below is OPTIONAL (nullable) — never forces a choice when
-- the seller genuinely doesn't know (e.g. bags got mixed that day). An
-- unlinked sale just doesn't show up in the traced totals below; it does
-- NOT mean "not sold," so v_batch_sales_traced must never be read as a
-- complete sales reconciliation, only as what's been actively traced.
alter table public.b2b_sale_entries
  add column batch_number text references public.batches(batch_number);
alter table public.fnf_sale_entries
  add column batch_number text references public.batches(batch_number);
alter table public.sample_entries
  add column batch_number text references public.batches(batch_number);

-- Retail fresh is still a single flat daily number (not a repeatable list
-- like B2B/FnF), so it gets one optional "which batch" field per day
-- rather than becoming its own child table -- most days only 1-2 batches
-- are actively fruiting anyway, so a single attribution per day is
-- usually unambiguous when it's known at all.
alter table public.farm_daily_logs
  add column s_fresh_batch_number text references public.batches(batch_number);

create index b2b_sale_entries_batch_number_idx on public.b2b_sale_entries(batch_number);
create index fnf_sale_entries_batch_number_idx on public.fnf_sale_entries(batch_number);
create index sample_entries_batch_number_idx on public.sample_entries(batch_number);

-- "Where did this batch's harvest end up" -- traced fresh sales by
-- channel, per batch. Deliberately does NOT compute a "remaining in
-- fridge" figure: some harvested kg went to the dryer (never batch-
-- tracked, see migration comments on Processing) and some sales may be
-- unlinked, so harvested-minus-traced would silently overstate what's
-- actually left. This view only ever claims to show what's been traced,
-- never a complete accounting.
create view public.v_batch_sales_traced
with (security_invoker = true) as
with retail as (
  select s_fresh_batch_number as batch_number, sum(s_fresh_kg) as kg
  from public.farm_daily_logs
  where s_fresh_batch_number is not null
  group by s_fresh_batch_number
),
b2b as (
  select batch_number, sum(qty) as kg
  from public.b2b_sale_entries
  where batch_number is not null
  group by batch_number
),
fnf as (
  select batch_number, sum(qty) as kg
  from public.fnf_sale_entries
  where batch_number is not null
  group by batch_number
),
samples as (
  select batch_number, sum(fresh_kg) as kg
  from public.sample_entries
  where batch_number is not null
  group by batch_number
)
select
  b.batch_number,
  coalesce(retail.kg, 0) as traced_retail_kg,
  coalesce(b2b.kg, 0)    as traced_b2b_kg,
  coalesce(fnf.kg, 0)    as traced_fnf_kg,
  coalesce(samples.kg, 0) as traced_sample_kg,
  coalesce(retail.kg,0) + coalesce(b2b.kg,0) + coalesce(fnf.kg,0) + coalesce(samples.kg,0) as traced_total_kg
from public.batches b
left join retail  on retail.batch_number  = b.batch_number
left join b2b      on b2b.batch_number     = b.batch_number
left join fnf      on fnf.batch_number     = b.batch_number
left join samples  on samples.batch_number = b.batch_number
where coalesce(retail.kg,0) + coalesce(b2b.kg,0) + coalesce(fnf.kg,0) + coalesce(samples.kg,0) > 0;

grant select on public.v_batch_sales_traced to authenticated;
