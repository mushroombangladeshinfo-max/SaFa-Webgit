-- Four new views for the harvest-data integration pass (see the published
-- harvest-integration-plan artifact, approved 2026-07-30). All query base
-- tables directly, never through v_ops_daily/v_kpi_daily -- a view built
-- on top of an un-invoked view inherits that view's bypass regardless of
-- its own security_invoker setting (this is exactly the shape of the bug
-- just fixed in migration 24, so this migration doesn't repeat it).

-- 1. Room-level harvest trend -- Room A vs Room B (vs C once active), by
-- week. Same GREATEST(grade-pair, source-pair) dedup as v_batch_yield:
-- fresh_a/fresh_rej and healthy/recovered are two lenses on one harvest,
-- not four additive buckets (see migration 22's fix for why).
create view public.v_room_yield_weekly
with (security_invoker = true) as
select
  date_trunc('week', he.log_date)::date as week,
  he.room,
  greatest(
    coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0),
    coalesce(sum(he.healthy_kg),0) + coalesce(sum(he.recovered_kg),0)
  ) as total_kg,
  count(distinct he.batch_number) as batch_count
from public.harvest_entries he
where he.room is not null
group by 1, 2
order by 1, 2;

grant select on public.v_room_yield_weekly to authenticated;

-- 2. Offline harvest allocation -- where the kg actually went, by week.
-- Online sales are deliberately excluded: orders.items is a jsonb array
-- with no clean kg field, and forcing one here would be a much bigger,
-- fragile build for what's meant to be pure assembly of existing fields.
-- Online stays tracked in ৳ via v_channel_pnl_monthly. Matches the kg-sum
-- convention already established in home.html's loadHarvestVsSold
-- (fresh+dried+powder treated as directly comparable kg).
create view public.v_channel_kg_weekly
with (security_invoker = true) as
select
  date_trunc('week', log_date)::date as week,
  coalesce(sum(s_fresh_kg),0) + coalesce(sum(s_dried_kg),0) + coalesce(sum(s_powder_kg),0) as retail_kg,
  coalesce(sum(s_b2b_qty),0) as b2b_kg,
  coalesce(sum(fnf_qty),0) as fnf_kg,
  coalesce(sum(sample_fresh_kg),0) + coalesce(sum(sample_dried_kg),0) + coalesce(sum(sample_powder_kg),0) as sample_kg,
  coalesce(sum(s_waste),0) as waste_kg
from public.farm_daily_logs
group by 1
order by 1;

grant select on public.v_channel_kg_weekly to authenticated;

-- 3. Supply vs demand, daily -- harvest kg against online revenue/orders
-- and ad spend, same day axis. harvest_kg formula inlined from
-- farm_daily_logs directly (matches v_ops_daily's own definition) rather
-- than selecting through v_ops_daily, for the same reason as above.
create view public.v_supply_demand_daily
with (security_invoker = true) as
with harvest as (
  select
    log_date as day,
    coalesce(harvest_fresh_a,0) + coalesce(harvest_fresh_b,0) + coalesce(harvest_fresh_rej,0)
      + coalesce(harvest_healthy_kg,0) + coalesce(harvest_recovered_kg,0) as harvest_kg
  from public.farm_daily_logs
),
online as (
  select created_at::date as day, sum(total_amount) as online_revenue, count(*) as online_orders
  from public.orders
  where status not in ('cancelled','returned')
  group by 1
),
ads as (
  select metric_date as day, sum(spend) as ad_spend
  from public.marketing_metrics
  group by 1
)
select
  coalesce(h.day, o.day, a.day) as day,
  coalesce(h.harvest_kg, 0) as harvest_kg,
  coalesce(o.online_revenue, 0) as online_revenue,
  coalesce(o.online_orders, 0) as online_orders,
  coalesce(a.ad_spend, 0) as ad_spend
from harvest h
full join online o on o.day = h.day
full join ads a on a.day = coalesce(h.day, o.day)
order by 1;

grant select on public.v_supply_demand_daily to authenticated;

-- 4. Contamination vs weather, weekly -- turns the standing memory note
-- ("day temps often exceed oyster mushroom's ideal range") into an actual
-- correlation view instead of a hunch.
create view public.v_contamination_weather_weekly
with (security_invoker = true) as
select
  date_trunc('week', f.log_date)::date as week,
  count(*) filter (where f.contam_event) as contam_days,
  sum(coalesce(f.contam_bags,0)) as bags_affected,
  round(avg(w.temp_day_avg_c)::numeric, 1) as avg_day_temp_c,
  round(avg(w.humidity_day_avg_pct)::numeric, 1) as avg_day_humidity_pct
from public.farm_daily_logs f
left join public.weather_daily w on w.weather_date = f.log_date
group by 1
order by 1;

grant select on public.v_contamination_weather_weekly to authenticated;
