-- Spawn traceability gap: inoculation_entries.grain_spawn_batch_id already
-- links an in-house inoculation forward to the grain_spawn_batches row it
-- used, but the purchased-spawn path (spawn_source='purchased') has no
-- equivalent -- there's no way to know which spawn_purchases delivery fed
-- a given batch. Neither direction is surfaced anywhere either: no page
-- shows "this purchase/grain batch was used by batch X" even where the
-- link already exists.
--
-- spawn_purchase_id mirrors grain_spawn_batch_id exactly -- same shape,
-- same reasoning: a single FK per inoculation entry, no partial-balance/
-- inventory-drawdown tracking (a purchase or grain batch is treated as
-- used-by-one-inoculation-event at a time, matching how the in-house side
-- already works and how a small farm actually uses one spawn lot per
-- inoculation session).
alter table public.inoculation_entries
  add column spawn_purchase_id bigint references public.spawn_purchases(id);

create index inoculation_entries_spawn_purchase_id_idx on public.inoculation_entries(spawn_purchase_id);

-- Reverse lookup for expenses.html's Suppliers tab: which batch(es) used
-- each purchase.
create view public.v_spawn_purchase_usage
with (security_invoker = true) as
select
  sp.id as spawn_purchase_id,
  array_agg(distinct ie.batch_number order by ie.batch_number) filter (where ie.batch_number is not null) as used_by_batches
from public.spawn_purchases sp
left join public.inoculation_entries ie on ie.spawn_purchase_id = sp.id
group by sp.id;

grant select on public.v_spawn_purchase_usage to authenticated;

-- Same for spawn-lab.html's grain spawn table -- the link
-- (grain_spawn_batch_id) already existed before this migration, only the
-- reverse-lookup view is new.
create view public.v_grain_spawn_usage
with (security_invoker = true) as
select
  gsb.id as grain_spawn_batch_id,
  array_agg(distinct ie.batch_number order by ie.batch_number) filter (where ie.batch_number is not null) as used_by_batches
from public.grain_spawn_batches gsb
left join public.inoculation_entries ie on ie.grain_spawn_batch_id = gsb.id
group by gsb.id;

grant select on public.v_grain_spawn_usage to authenticated;
