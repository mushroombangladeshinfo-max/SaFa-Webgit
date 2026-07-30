-- Editable Harvest Log: an admin can now correct a mistyped harvest entry
-- from harvest-log.html. Two pieces:
--
-- 1. Realtime fix, found while building this: migration 11 enabled
--    Postgres-realtime replication for orders/products/farm_daily_logs/
--    one_off_expenses/b2b_pipeline/spawn_purchases/marketing_metrics, but
--    never added harvest_entries or batches. That means two subscriptions
--    already in the codebase (farm-analytics.html's 'farm-analytics-
--    batches-live' channel, and harvest-log.html's own 'harvest-log-live'
--    channel) have been connecting successfully but silently never
--    receiving events -- the exact failure mode migration 11's own
--    comment describes. Fixed here since it directly undercuts "edits
--    show up everywhere" for the new edit feature.
--
-- 2. update_harvest_entry(): one atomic RPC that updates a harvest_entries
--    row AND recomputes farm_daily_logs' daily aggregate for that date in
--    the same transaction, using the exact same 4-field mapping quick-log.
--    html's own sumEntries()/submit() already uses (quick-log.html:917-
--    952) -- so there is only ever one aggregation implementation, not
--    two that can silently drift apart. security invoker (the default) so
--    it runs as the calling admin and the existing is_admin()-gated RLS on
--    both tables applies exactly as if the client ran these statements
--    itself -- no privilege escalation.

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'harvest_entries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.harvest_entries;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'batches'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.batches;
  END IF;
END $$;

create or replace function public.update_harvest_entry(
  p_id uuid,
  p_batch_number text,
  p_flush_num int,
  p_fresh_a_kg numeric,
  p_fresh_rej_kg numeric,
  p_healthy_kg numeric,
  p_recovered_kg numeric,
  p_bags_removed numeric
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
      bags_removed = p_bags_removed
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
