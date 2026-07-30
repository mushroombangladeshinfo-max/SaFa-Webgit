-- b2b_payments needs live-refresh on pipeline.html same as b2b_pipeline --
-- added in its own migration rather than folded into 31 so the "did we
-- forget realtime" check stays a habit applied per new table, not a thing
-- bundled in and easy to skip next time.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'b2b_payments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.b2b_payments;
  END IF;
END $$;
