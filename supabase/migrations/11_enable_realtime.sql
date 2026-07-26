-- ============================================================================
-- 11_enable_realtime.sql — actually enable Postgres realtime replication
-- ============================================================================
-- Found while auditing "does data update live everywhere": the
-- supabase_realtime publication existed but had ZERO tables in it. This
-- means every .channel(...).on('postgres_changes', ...) subscription in
-- this project — including admin.html's pre-existing orders live-update
-- feature — has been connecting successfully but never actually receiving
-- change events, since Postgres was never told to replicate these tables
-- to the realtime server in the first place. The client-side code was
-- correct; this was the missing piece underneath it.
--
-- Wrapped per-table so re-running this migration is safe (ALTER
-- PUBLICATION ... ADD TABLE errors if the table's already a member).
-- ============================================================================

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'orders', 'products', 'farm_daily_logs', 'one_off_expenses',
    'b2b_pipeline', 'spawn_purchases', 'marketing_metrics'
  ]
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;
