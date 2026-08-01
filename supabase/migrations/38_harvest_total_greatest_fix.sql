-- Correction to migration 22's GREATEST(grade-pair, source-pair) rule.
--
-- Confirmed with the user: a single harvest entry only ever uses ONE of
-- the two pairs (fresh_a/fresh_rej for a normal clean-bag flush, OR
-- healthy_kg/recovered_kg for mold-recovered mushroom) -- never both for
-- the same kg. There is no "grade A/B" concept in this business.
--
-- That means GREATEST was solving the wrong problem. It was applied across
-- a SUM spanning many entries (a batch's whole life in v_batch_yield, a
-- room's whole week in v_room_yield_weekly), not within a single entry. If
-- batch 1-A's early flushes used fresh_a/fresh_rej and a later flush (after
-- a mold recovery) used healthy_kg/recovered_kg, GREATEST(sum_pair_1,
-- sum_pair_2) silently discarded whichever pair's total was smaller, when
-- the correct total is just the sum of every entry's (already
-- non-overlapping) kg. A straight 4-column sum is correct here precisely
-- because no single row ever double-fills both pairs -- confirmed by the
-- business rule above, not assumed.
--
-- harvest_entries.total_kg (migration 28) and its GREATEST-per-ROW formula
-- are untouched: GREATEST(a,b) with one of a/b always 0 for that row is
-- mathematically identical to a+b, so that generated column is already
-- correct and doesn't need this fix.
create or replace view public.v_batch_yield
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
  coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0)
    + coalesce(sum(he.healthy_kg),0) + coalesce(sum(he.recovered_kg),0)
    as total_fresh_kg,
  case when coalesce(ie.total_substrate_kg,0) > 0
    then round(((coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0)
      + coalesce(sum(he.healthy_kg),0) + coalesce(sum(he.recovered_kg),0))
      / ie.total_substrate_kg * 100)::numeric, 1)
    else null
  end as be_pct,
  case when coalesce(ie.total_bags_count,0) > 0
    then round(((coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0)
      + coalesce(sum(he.healthy_kg),0) + coalesce(sum(he.recovered_kg),0))
      / ie.total_bags_count)::numeric, 3)
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

create or replace view public.v_room_yield_weekly
with (security_invoker = true) as
select
  date_trunc('week', he.log_date)::date as week,
  he.room,
  coalesce(sum(he.fresh_a_kg),0) + coalesce(sum(he.fresh_rej_kg),0)
    + coalesce(sum(he.healthy_kg),0) + coalesce(sum(he.recovered_kg),0)
    as total_kg,
  count(distinct he.batch_number) as batch_count
from public.harvest_entries he
where he.room is not null
group by 1, 2
order by 1, 2;

grant select on public.v_room_yield_weekly to authenticated;
