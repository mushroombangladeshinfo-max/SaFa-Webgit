-- Two fixes from a critical review of the Expenses (খরচের হিসাব) step and
-- Closing Stock, respectively.
--
-- 1. v_ops_daily.farm_expenses was missing online_delivery_cost/
-- offline_delivery_cost entirely -- those two columns were only ever read
-- by v_channel_pnl_monthly, never by v_ops_daily. That view drives the
-- daily summary screen and the weekly WhatsApp/email report, so any
-- delivery fee -- however diligently entered -- never reduced the profit
-- number actually looked at day to day. Fixed by adding both columns to
-- the same formula. ex_spawn/ex_electricity/ex_transport/ex_water stay in
-- the SUM (not removed) even though quick-log.html no longer writes them
-- going forward (see quick-log.html's calcExp() comment) -- historical
-- rows may still hold real values there, and coalesce(...,0) makes the
-- term a harmless no-op for every future date once nothing writes to it,
-- same non-destructive pattern as every other superseded column.
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
  coalesce(f.ex_spawn,0) + coalesce(f.ex_substrate,0) + coalesce(f.ex_packaging,0) + coalesce(f.ex_labor,0)
    + coalesce(f.ex_electricity,0) + coalesce(f.ex_transport,0) + coalesce(f.ex_water,0) + coalesce(f.ex_other,0)
    + coalesce(f.online_packaging_cost,0) + coalesce(f.online_delivery_cost,0)
    + coalesce(f.offline_packaging_cost,0) + coalesce(f.offline_delivery_cost,0)
    + coalesce(oo.amount,0) as farm_expenses,
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

-- 2. v_stock_reconciliation: closing stock was being manually counted
-- every day (st_fresh/st_dried/st_powder) and then never compared to
-- anything -- pure data-entry cost, zero payoff. This computes what the
-- count SHOULD be from everything else already logged that day (harvest,
-- processing, sales across every channel, waste, returns, samples), using
-- the PRIOR day's actual count as the running baseline (via LAG), and
-- exposes the delta so a real mismatch (unlogged sale, uncounted spoilage,
-- theft, a scale error) becomes visible instead of three numbers nobody
-- ever looks at again.
--
-- Known, deliberate approximations (documented here rather than silently
-- assumed): b2b_sale_entries/fnf_sale_entries have no fresh/dried/powder
-- breakdown yet, so their qty is treated as fresh (matches every real B2B
-- sale logged so far). s_waste_kg has no product-form breakdown either,
-- also treated as fresh (fresh is what actually spoils; dried/powder are
-- shelf-stable). s_returned_kg is added back into fresh stock, assuming a
-- return is physically recoverable. Dried/powder reconciliation currently
-- has no waste/return/B2B/FnF term at all for the same reason -- expected
-- dried/powder will run slightly high if any of those ever apply to
-- processed product, not just fresh.
--
-- LAG() runs over rows that actually have a stock count (the WHERE below),
-- not literally the calendar-previous day -- if a day's Closing Stock step
-- is skipped, that day's own harvest/sales/waste flows are simply not
-- folded into the next count's "expected" baseline, so a multi-day gap
-- between counts will show as a larger delta than real shrinkage alone.
-- That's a known shape, not a bug: the whole point is to make daily
-- counting worth doing, and a big delta after a skipped stretch is itself
-- an honest signal (go recount, don't trust the gap-spanning estimate).
create view public.v_stock_reconciliation
with (security_invoker = true) as
with logs as (
  select
    log_date,
    coalesce(harvest_fresh_a,0) + coalesce(harvest_fresh_rej,0) + coalesce(harvest_healthy_kg,0) + coalesce(harvest_recovered_kg,0) as harvest_fresh_kg,
    coalesce(pr_fresh_in,0)   as pr_fresh_in,
    coalesce(pr_dried_out,0)  as pr_dried_out,
    coalesce(pr_dried_in,0)   as pr_dried_in,
    coalesce(pr_powder_out,0) as pr_powder_out,
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
    as expected_dried,
  coalesce(lag(l.st_powder) over (order by l.log_date), 0)
    + l.pr_powder_out - l.s_powder_kg - coalesce(sm.powder_kg,0)
    as expected_powder
from logs l
left join b2bfnf bf on bf.log_date = l.log_date
left join samples sm on sm.log_date = l.log_date
where l.st_fresh is not null or l.st_dried is not null or l.st_powder is not null
order by l.log_date;

grant select on public.v_stock_reconciliation to authenticated;
