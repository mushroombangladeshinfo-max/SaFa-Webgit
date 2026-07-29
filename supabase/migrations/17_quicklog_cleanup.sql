-- quick-log.html's "Operations" step (8 fields) and the Notes step's star
-- rating had zero real data across every existing row (confirmed via direct
-- query before writing this migration) and zero references in any
-- dashboard -- pure daily entry burden with no payoff. Dropping the dead
-- columns; op_bags_removed is repurposed rather than dropped (relocated
-- into the Harvest step in the UI, meaning something distinct from
-- Spawn's existing "bags discarded at inoculation" field -- bags retired
-- at the end of a harvest cycle).
--
-- v_ops_daily passes op_bags_total and n_overall_rating straight through
-- (both dead, confirmed no page selects them from the view either) --
-- redefine it without those two columns first so the DROP COLUMNs below
-- don't fail on the dependency. v_kpi_daily only reads harvest_fresh_kg/
-- farm_revenue/farm_expenses/avg_temp/avg_humidity from v_ops_daily, none
-- of which are touched here, so it needs no changes.

-- Postgres won't let CREATE OR REPLACE VIEW drop columns, only add them --
-- have to drop and recreate both views (v_kpi_daily depends on
-- v_ops_daily, so it goes first; recreated identically afterward, its
-- definition isn't changing).
drop view public.v_kpi_daily;
drop view public.v_ops_daily;

create view public.v_ops_daily as
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
  coalesce(f.s_fresh_kg,0)*coalesce(f.s_fresh_price,0) + coalesce(f.s_dried_kg,0)*coalesce(f.s_dried_price,0) + coalesce(f.s_powder_kg,0)*coalesce(f.s_powder_price,0) + coalesce(f.s_b2b_value,0) as farm_revenue,
  coalesce(f.ex_spawn,0) + coalesce(f.ex_substrate,0) + coalesce(f.ex_packaging,0) + coalesce(f.ex_labor,0) + coalesce(f.ex_electricity,0) + coalesce(f.ex_transport,0) + coalesce(f.ex_water,0) + coalesce(f.ex_other,0) + coalesce(oo.amount,0) as farm_expenses,
  coalesce(f.s_waste,0) as waste_kg,
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

alter table public.farm_daily_logs
  drop column op_rooms,
  drop column op_bags_total,
  drop column op_workers,
  drop column op_shifts,
  drop column op_new_batches,
  drop column op_done_batches,
  drop column op_energy_kwh,
  drop column op_issue,
  drop column op_issue_desc,
  drop column n_overall_rating;

alter table public.farm_daily_logs
  rename column op_bags_removed to harvest_bags_removed;

-- Recreate v_kpi_daily exactly as it was -- its own definition never
-- touched op_bags_total/n_overall_rating, only had to be dropped as a
-- side effect of v_ops_daily needing to be dropped and recreated above.
create view public.v_kpi_daily as
select
  coalesce(s.day, m.day, o.day) as day,
  coalesce(s.orders_valid, 0) as web_orders,
  coalesce(s.revenue, 0) as web_revenue,
  s.avg_order_value,
  coalesce(m.total_spend, 0) as ad_spend,
  m.impressions, m.reach, m.clicks, m.engagements, m.leads,
  coalesce(o.harvest_fresh_kg, 0) as harvest_kg,
  coalesce(o.farm_revenue, 0) as farm_revenue,
  coalesce(o.farm_expenses, 0) as farm_expenses,
  o.avg_temp, o.avg_humidity,
  coalesce(s.revenue, 0)::numeric + coalesce(o.farm_revenue, 0) - coalesce(o.farm_expenses, 0) - coalesce(m.total_spend, 0) as net_position
from v_sales_daily s
full join v_marketing_daily m on m.day = s.day
full join v_ops_daily o on o.day = coalesce(s.day, m.day);
