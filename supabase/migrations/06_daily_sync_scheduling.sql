-- ============================================================================
-- 06_daily_sync_scheduling.sql — automatic daily marketing-metrics syncs
-- ============================================================================
-- Schedules sync-meta and sync-ga4 to run automatically every day via
-- pg_cron + pg_net, instead of needing a manual curl trigger.
--
-- Times are UTC, staggered 10 minutes apart to be polite to both platforms'
-- rate limits. 06:00 UTC = 12:00 noon Dhaka — yesterday's numbers are final
-- on every platform by then.
--
-- Requires the ANON_KEY_HERE and CRON_SECRET_HERE placeholders below to be
-- replaced before running (CRON_SECRET is optional — only needed if you've
-- set a CRON_SECRET edge function secret; if you haven't, remove the
-- x-cron-secret header entirely from both calls).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.schedule(
  'sync-meta-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url     := 'https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/sync-meta',
    headers := '{"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"}'::jsonb
  )
  $$
);

SELECT cron.schedule(
  'sync-ga4-daily',
  '10 6 * * *',
  $$
  SELECT net.http_post(
    url     := 'https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/sync-ga4',
    headers := '{"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"}'::jsonb
  )
  $$
);

-- To check scheduled jobs later:      SELECT * FROM cron.job;
-- To check run history/failures:      SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;
-- To remove a schedule:               SELECT cron.unschedule('sync-meta-daily');
