-- Critical review of the Processing step: pr_dried_out/pr_powder_out
-- conflated expected drying moisture-loss with actual quality rejects
-- (burnt in the dryer, mould discovered mid-process, contamination found
-- while grinding). A reject silently vanished from every number downstream
-- -- most importantly it broke the Stock Reconciliation feature
-- (migration 37): an unrecorded processing reject shows up as an
-- unexplained "expected vs actual" delta with no way to tell it apart from
-- real shrinkage, defeating the point of that feature.
--
-- Confirmed with the user: drying/grinding always pools fresh mushroom
-- from every batch harvested that day into one run -- there is no
-- per-batch drying, so Processing correctly stays a flat daily aggregate
-- (not repeatable/batch-linked like Harvest/QC/Inoculation).
alter table public.farm_daily_logs
  add column pr_dried_reject_kg  numeric,
  add column pr_powder_reject_kg numeric;

-- v_stock_reconciliation: expected_dried/expected_powder now subtract the
-- reject amount, same non-destructive column-list/order as migration 37.
create or replace view public.v_stock_reconciliation
with (security_invoker = true) as
with logs as (
  select
    log_date,
    coalesce(harvest_fresh_a,0) + coalesce(harvest_fresh_rej,0) + coalesce(harvest_healthy_kg,0) + coalesce(harvest_recovered_kg,0) as harvest_fresh_kg,
    coalesce(pr_fresh_in,0)   as pr_fresh_in,
    coalesce(pr_dried_out,0)  as pr_dried_out,
    coalesce(pr_dried_in,0)   as pr_dried_in,
    coalesce(pr_powder_out,0) as pr_powder_out,
    coalesce(pr_dried_reject_kg,0)  as pr_dried_reject_kg,
    coalesce(pr_powder_reject_kg,0) as pr_powder_reject_kg,
    coalesce(s_fresh_kg,0)    as s_fresh_kg,
    coalesce(s_dried_kg,0)    as s_dried_kg,
    coalesce(s_powder_kg,0)   as s_powder_kg,
    coalesce(s_waste_kg,0)    as s_waste_kg,
    coalesce(s_returned_kg,0) as s_returned_kg,
    st_fresh, st_dried, st_powder
  from public.farm_daily_logs
),
b2bfnf as (
  select log_date, sum(qty) as qty from (
    select log_date, qty from public.b2b_sale_entries
    union all
    select log_date, qty from public.fnf_sale_entries
  ) x
  group by log_date
),
samples as (
  select log_date,
    sum(coalesce(fresh_kg,0))  as fresh_kg,
    sum(coalesce(dried_kg,0))  as dried_kg,
    sum(coalesce(powder_kg,0)) as powder_kg
  from public.sample_entries
  group by log_date
)
select
  l.log_date,
  l.st_fresh, l.st_dried, l.st_powder,
  lag(l.st_fresh)  over (order by l.log_date) as prev_st_fresh,
  lag(l.st_dried)  over (order by l.log_date) as prev_st_dried,
  lag(l.st_powder) over (order by l.log_date) as prev_st_powder,
  coalesce(lag(l.st_fresh) over (order by l.log_date), 0)
    + l.harvest_fresh_kg - l.pr_fresh_in
    - l.s_fresh_kg - coalesce(bf.qty,0) - coalesce(sm.fresh_kg,0)
    - l.s_waste_kg + l.s_returned_kg
    as expected_fresh,
  coalesce(lag(l.st_dried) over (order by l.log_date), 0)
    + l.pr_dried_out - l.pr_dried_in - l.s_dried_kg - coalesce(sm.dried_kg,0)
    - l.pr_dried_reject_kg
    as expected_dried,
  coalesce(lag(l.st_powder) over (order by l.log_date), 0)
    + l.pr_powder_out - l.s_powder_kg - coalesce(sm.powder_kg,0)
    - l.pr_powder_reject_kg
    as expected_powder
from logs l
left join b2bfnf bf on bf.log_date = l.log_date
left join samples sm on sm.log_date = l.log_date
where l.st_fresh is not null or l.st_dried is not null or l.st_powder is not null
order by l.log_date;

grant select on public.v_stock_reconciliation to authenticated;
