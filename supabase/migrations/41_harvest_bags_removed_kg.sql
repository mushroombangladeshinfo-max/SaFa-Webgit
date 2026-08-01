-- Same fix as migration 40 (qc_entries), applied to harvest_entries: bag
-- count isn't a meaningful unit since bags aren't a uniform size. Adding
-- bags_removed_kg; bags_removed (numeric, was used as a count) stays in
-- schema unused going forward, same non-destructive pattern as elsewhere.
alter table public.harvest_entries
  add column bags_removed_kg numeric;

-- update_harvest_entry (migration 30) takes p_bags_removed as one of its
-- typed parameters, so the signature itself has to change -- drop the old
-- overload first so it doesn't linger alongside the new one.
drop function if exists public.update_harvest_entry(uuid,text,int,numeric,numeric,numeric,numeric,numeric);

create or replace function public.update_harvest_entry(
  p_id uuid,
  p_batch_number text,
  p_flush_num int,
  p_fresh_a_kg numeric,
  p_fresh_rej_kg numeric,
  p_healthy_kg numeric,
  p_recovered_kg numeric,
  p_bags_removed_kg numeric
) returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_log_date date;
  v_room text;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  select room into v_room from public.batches where batch_number = p_batch_number;

  update public.harvest_entries
  set batch_number = p_batch_number,
      room         = v_room,
      flush_num    = p_flush_num,
      fresh_a_kg   = p_fresh_a_kg,
      fresh_rej_kg = p_fresh_rej_kg,
      healthy_kg   = p_healthy_kg,
      recovered_kg = p_recovered_kg,
      bags_removed_kg = p_bags_removed_kg
  where id = p_id
  returning log_date into v_log_date;

  if v_log_date is null then
    raise exception 'harvest_entries row % not found', p_id;
  end if;

  -- Targeted update -- only the 4 harvest_* columns quick-log itself
  -- writes -- so the other ~60 unrelated columns on that farm_daily_logs
  -- row are never touched.
  update public.farm_daily_logs f
  set harvest_fresh_a      = agg.fresh_a,
      harvest_fresh_rej    = agg.fresh_rej,
      harvest_healthy_kg   = agg.healthy,
      harvest_recovered_kg = agg.recovered
  from (
    select
      coalesce(sum(fresh_a_kg),0)   as fresh_a,
      coalesce(sum(fresh_rej_kg),0) as fresh_rej,
      coalesce(sum(healthy_kg),0)   as healthy,
      coalesce(sum(recovered_kg),0) as recovered
    from public.harvest_entries
    where log_date = v_log_date
  ) agg
  where f.log_date = v_log_date;
end;
$$;

grant execute on function public.update_harvest_entry(uuid,text,int,numeric,numeric,numeric,numeric,numeric) to authenticated;
