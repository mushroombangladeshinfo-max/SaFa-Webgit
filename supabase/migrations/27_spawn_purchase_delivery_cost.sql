-- spawn_purchases had no way to record delivery/freight cost -- price_per_kg
-- was the supplier's quoted unit price only, and total_cost (a GENERATED
-- column) was just kg_purchased * price_per_kg. A real purchase from
-- Bismillah Mushroom included a flat ৳1600 delivery charge on top of
-- 210kg @ ৳35/kg -- the true landed cost per kg (৳42.62) is meaningfully
-- higher than the quoted ৳35, and nothing in the schema could reflect that.
--
-- Adds delivery_cost (defaults to 0, so every existing row's total_cost is
-- unchanged) and redefines total_cost to include it -- this is landed-cost
-- accounting (purchase price + cost to get goods to a usable location),
-- not the future "allocate a shared cost across multiple batches" question
-- flagged separately -- this is about correctly costing ONE purchase.
--
-- total_cost is a GENERATED column, which can't be altered in place --
-- drop and re-add. Three views depend on it (v_supplier_scorecard,
-- v_spawn_cost_monthly, and v_channel_pnl_monthly transitively through
-- v_spawn_cost_monthly), so they're dropped and recreated identically --
-- none of their own SQL logic changes, they just automatically pick up
-- the corrected total_cost once recreated.

drop view if exists public.v_channel_pnl_monthly;
drop view if exists public.v_spawn_cost_monthly;
drop view if exists public.v_supplier_scorecard;

alter table public.spawn_purchases drop column total_cost;
alter table public.spawn_purchases add column delivery_cost numeric(10,2) not null default 0;
alter table public.spawn_purchases add column total_cost numeric(10,2)
  generated always as (kg_purchased * price_per_kg + delivery_cost) stored;

-- ── recreate v_supplier_scorecard (unchanged from 05_channel_pnl_and_suppliers.sql) ──
create view public.v_supplier_scorecard
with (security_invoker = true) as
select
  coalesce(supplier_name, 'Unnamed / Unspecified')     as supplier_name,
  count(*)                                              as purchase_count,
  sum(kg_purchased)                                     as total_kg_purchased,
  sum(total_cost)                                       as total_spent,
  round(sum(total_cost) / nullif(sum(kg_purchased),0), 2) as avg_price_per_kg,
  sum(kg_wasted)                                        as total_kg_wasted,
  round(100.0 * sum(kg_wasted) / nullif(sum(kg_purchased),0), 1) as waste_rate_pct,
  sum(kg_refunded)                                      as total_kg_refunded,
  sum(refund_amount)                                    as total_refunded_amount,
  sum(total_cost) - sum(refund_amount)                  as net_cost_after_refunds,
  max(purchase_date)                                    as last_purchase_date,
  min(purchase_date)                                    as first_purchase_date
from public.spawn_purchases
group by 1;

-- ── recreate v_spawn_cost_monthly (unchanged) ──
create view public.v_spawn_cost_monthly
with (security_invoker = true) as
select
  date_trunc('month', purchase_date)::date as month,
  sum(total_cost)                          as gross_spawn_cost,
  sum(refund_amount)                       as refunds_received,
  sum(total_cost) - sum(refund_amount)     as net_spawn_cost
from public.spawn_purchases
group by 1;

-- ── recreate v_channel_pnl_monthly (unchanged) ──
create view public.v_channel_pnl_monthly
with (security_invoker = true) as
with online as (
  select date_trunc('month', created_at)::date as month,
         sum(total_amount) as revenue,
         count(*) as orders
  from public.orders
  where status not in ('cancelled','returned')
  group by 1
),
offline as (
  select date_trunc('month', log_date)::date as month,
         sum(coalesce(s_fresh_kg,0)*coalesce(s_fresh_price,0)
           + coalesce(s_dried_kg,0)*coalesce(s_dried_price,0)
           + coalesce(s_powder_kg,0)*coalesce(s_powder_price,0)
           + coalesce(s_b2b_value,0)) as revenue,
         sum(coalesce(online_packaging_cost,0))  as online_pack,
         sum(coalesce(online_delivery_cost,0))   as online_deliv,
         sum(coalesce(offline_packaging_cost,0)) as offline_pack,
         sum(coalesce(offline_delivery_cost,0))  as offline_deliv,
         sum(coalesce(ex_substrate,0) + coalesce(ex_labor,0) + coalesce(ex_electricity,0)
           + coalesce(ex_transport,0) + coalesce(ex_water,0) + coalesce(ex_other,0)) as shared_daily_costs,
         sum(coalesce(ex_spawn,0)) as legacy_ex_spawn
  from public.farm_daily_logs
  group by 1
),
ad_spend as (
  select date_trunc('month', metric_date)::date as month, sum(spend) as spend
  from public.marketing_metrics group by 1
),
oneoff as (
  select date_trunc('month', expense_date)::date as month,
         sum(amount) filter (where channel = 'online')  as online_oneoff,
         sum(amount) filter (where channel = 'offline') as offline_oneoff,
         sum(amount) filter (where channel is null)     as unallocated_oneoff
  from public.one_off_expenses group by 1
),
months as (
  select month from online
  union select month from offline
  union select month from ad_spend
  union select month from oneoff
),
base as (
  select
    mo.month,
    coalesce(o.revenue, 0)   as online_revenue,
    coalesce(o.orders, 0)    as online_orders,
    coalesce(f.revenue, 0)   as offline_revenue,
    coalesce(f.online_pack,0) + coalesce(f.online_deliv,0) + coalesce(a.spend,0) + coalesce(oo.online_oneoff,0)
                              as online_direct_costs,
    coalesce(f.offline_pack,0) + coalesce(f.offline_deliv,0) + coalesce(oo.offline_oneoff,0)
                              as offline_direct_costs,
    coalesce(f.shared_daily_costs,0) + coalesce(f.legacy_ex_spawn,0) + coalesce(sc.net_spawn_cost,0)
      + coalesce(oo.unallocated_oneoff,0)
                              as total_shared_costs
  from months mo
  left join online  o  on o.month  = mo.month
  left join offline f  on f.month  = mo.month
  left join ad_spend a on a.month  = mo.month
  left join oneoff   oo on oo.month = mo.month
  left join v_spawn_cost_monthly sc on sc.month = mo.month
)
select
  month,
  online_orders,
  online_revenue,
  offline_revenue,
  online_revenue + offline_revenue as total_revenue,
  round(100.0 * online_revenue / nullif(online_revenue + offline_revenue, 0), 1) as online_revenue_share_pct,
  online_direct_costs,
  offline_direct_costs,
  total_shared_costs,
  round(total_shared_costs * online_revenue / nullif(online_revenue + offline_revenue, 0), 2)  as online_allocated_shared_cost,
  round(total_shared_costs * offline_revenue / nullif(online_revenue + offline_revenue, 0), 2) as offline_allocated_shared_cost,
  online_revenue - online_direct_costs
    - round(total_shared_costs * online_revenue / nullif(online_revenue + offline_revenue, 0), 2)
                                    as online_net_profit,
  offline_revenue - offline_direct_costs
    - round(total_shared_costs * offline_revenue / nullif(online_revenue + offline_revenue, 0), 2)
                                    as offline_net_profit,
  (online_revenue + offline_revenue) - online_direct_costs - offline_direct_costs - total_shared_costs
                                    as combined_net_profit
from base
order by month;

grant select on public.v_supplier_scorecard to authenticated;
grant select on public.v_spawn_cost_monthly to authenticated;
grant select on public.v_channel_pnl_monthly to authenticated;
