-- Harvest Log page needs a real, server-filterable/sortable "total kg" per
-- entry (min/max range filter + sort-by-kg), but PostgREST can only
-- .gte()/.lte()/.order() on actual columns, not expressions. A generated
-- column is the same non-destructive, additive pattern as migrations
-- 19/20/22/23.
--
-- Formula matches v_batch_yield's established rule (migration 22): kg has
-- two lenses on the same physical harvest -- fresh_a/fresh_rej (grade) and
-- healthy/recovered (biological source) -- that can both be filled on one
-- row, so GREATEST of the two pair-sums is correct; a straight 4-way sum
-- would double-count any row where both lenses are populated.
alter table public.harvest_entries
  add column total_kg numeric generated always as (
    greatest(
      coalesce(fresh_a_kg,0) + coalesce(fresh_rej_kg,0),
      coalesce(healthy_kg,0) + coalesce(recovered_kg,0)
    )
  ) stored;

create index harvest_entries_total_kg_idx on public.harvest_entries(total_kg);
