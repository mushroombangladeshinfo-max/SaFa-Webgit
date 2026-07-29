-- Biological Efficiency (BE%) per batch — the standard commercial mushroom
-- KPI (fresh yield ÷ dry substrate weight), currently impossible to compute
-- because substrate weight/bag count were only ever logged as a DAILY
-- aggregate (farm_daily_logs.substrate_kg/bags_inoculated), never linked to
-- the specific batch they produced. batches gets its own substrate_kg (dry
-- weight) and bags_count, captured once at batch creation (quick-log's
-- "নতুন Batch শুরু করবেন?" flow), nullable — a batch without them just can't
-- show BE%/yield-per-bag later, not an error.
--
-- v_batch_yield aggregates harvest_entries per batch (crop-cycle span,
-- flush count, total fresh kg) and computes BE% from it. Uses TOTAL fresh
-- biomass (Grade A + rejected), not just marketable Grade A — BE% measures
-- biological conversion, not sellability; rejected mushrooms still came
-- from the substrate. Both be_pct and yield_per_bag_kg are null when their
-- batch has no substrate_kg/bags_count on record, rather than a misleading
-- divide-by-zero or a silently wrong number.

alter table public.batches
  add column substrate_kg numeric,
  add column bags_count   int;

-- security_invoker: plain views in this project run as their OWNER
-- (postgres, which has BYPASSRLS) unless told otherwise, so a view over
-- an RLS-gated table silently ignores that RLS for anyone with a SELECT
-- grant on the view -- confirmed v_ops_daily/v_kpi_daily already have this
-- exact gap (owned by postgres, security_invoker unset, `authenticated`
-- holds a SELECT grant -- meaning any logged-in customer, not just admins,
-- could currently query them directly). Not fixing those two here since
-- that's unscoped and needs its own careful pass; not repeating the same
-- gap on this new view -- security_invoker=true makes it run as the
-- querying role instead, so is_admin() on batches/harvest_entries is
-- actually enforced.
create view public.v_batch_yield
with (security_invoker = true) as
select
  b.batch_number,
  b.room,
  b.spawn_date,
  b.substrate_type,
  b.substrate_kg,
  b.bags_count,
  b.status,
  count(he.id) as flush_count,
  min(he.log_date) as first_harvest_date,
  max(he.log_date) as last_harvest_date,
  coalesce(sum(he.fresh_a_kg),0) as total_fresh_a_kg,
  coalesce(sum(he.fresh_rej_kg),0) as total_fresh_rej_kg,
  coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0) as total_fresh_kg,
  case when b.substrate_kg > 0
    then round(((coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0)) / b.substrate_kg * 100)::numeric, 1)
    else null
  end as be_pct,
  case when b.bags_count > 0
    then round(((coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0)) / b.bags_count)::numeric, 3)
    else null
  end as yield_per_bag_kg
from public.batches b
left join public.harvest_entries he on he.batch_number = b.batch_number
group by b.batch_number, b.room, b.spawn_date, b.substrate_type, b.substrate_kg, b.bags_count, b.status;

grant select on public.v_batch_yield to authenticated;
