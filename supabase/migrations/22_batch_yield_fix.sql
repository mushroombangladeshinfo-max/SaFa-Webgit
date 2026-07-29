-- v_batch_yield's total_fresh_kg only summed fresh_a_kg + fresh_rej_kg
-- (the Grade A/Rejected pair) and silently ignored healthy_kg/recovered_kg
-- (the healthy-bags/mold-recovered pair) entirely. These two pairs are two
-- different LENSES on the same harvest (quality grade vs biological
-- source), not four independent additive buckets -- confirmed against
-- farm-analytics.html's own rowFresh(), which already sums all of
-- harvest_fresh_a/fresh_b/fresh_rej/healthy_kg/recovered_kg together for
-- "today's total harvest".
--
-- Found while logging a real harvest entered purely via the healthy/
-- recovered lens (no Grade A/Rejected given at all) -- under the old
-- formula that batch's BE% would have computed as 0%, silently wrong.
--
-- Using GREATEST(...) of the two pairs' sums rather than adding all four
-- together: if a future entry ever fills in BOTH lenses for the same
-- physical harvest (thorough logging, not just whichever lens fit that
-- day), a straight 4-way sum would double-count it. GREATEST is correct
-- under both today's "only one lens filled in" convention (returns
-- whichever pair is real) and a future both-filled-in day (returns the
-- true total instead of double it) -- strictly safer than matching
-- farm-analytics.html's existing additive pattern, which has the same
-- double-counting exposure and is flagged separately, not fixed here
-- (unscoped for this change).

-- CREATE OR REPLACE VIEW can only append new columns at the end without
-- dropping -- total_healthy_kg/total_recovered_kg need to sit next to
-- total_fresh_a_kg/total_fresh_rej_kg for the columns to read sensibly in
-- pairs, which reorders the existing total_fresh_kg/be_pct/yield_per_bag_kg
-- columns. Safe to drop and recreate outright: this view has no other view
-- depending on it, and it was only just created (no real data has been
-- read from it yet).
drop view public.v_batch_yield;

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
  coalesce(sum(he.healthy_kg),0) as total_healthy_kg,
  coalesce(sum(he.recovered_kg),0) as total_recovered_kg,
  greatest(
    coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0),
    coalesce(sum(he.healthy_kg),0) + coalesce(sum(he.recovered_kg),0)
  ) as total_fresh_kg,
  case when b.substrate_kg > 0
    then round((greatest(
      coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0),
      coalesce(sum(he.healthy_kg),0) + coalesce(sum(he.recovered_kg),0)
    ) / b.substrate_kg * 100)::numeric, 1)
    else null
  end as be_pct,
  case when b.bags_count > 0
    then round((greatest(
      coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0),
      coalesce(sum(he.healthy_kg),0) + coalesce(sum(he.recovered_kg),0)
    ) / b.bags_count)::numeric, 3)
    else null
  end as yield_per_bag_kg
from public.batches b
left join public.harvest_entries he on he.batch_number = b.batch_number
group by b.batch_number, b.room, b.spawn_date, b.substrate_type, b.substrate_kg, b.bags_count, b.status;

grant select on public.v_batch_yield to authenticated;
