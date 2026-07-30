-- Daily backup of core business data to Supabase Storage, separate from the
-- live tables -- so a bad migration, an accidental delete, or an
-- account-level issue doesn't take the only copy of the data with it.
-- Mirrors the weekly-report pattern (migration 19): pg_cron + pg_net calls
-- a Deno edge function (supabase/functions/daily-backup) which dumps 16
-- core tables to dated CSV files.

insert into storage.buckets (id, name, public)
values ('backups', 'backups', false)
on conflict (id) do nothing;

-- Only an admin SELECT policy -- for a possible future in-app browsing UI.
-- No INSERT/UPDATE/DELETE policy for `authenticated` at all: the only
-- writer is the edge function, authenticated with the service-role key,
-- which bypasses RLS entirely and needs no policy. Adding an
-- is_admin()-gated write/delete policy "for symmetry" would let a
-- compromised admin session -- the exact threat this feature exists to
-- survive -- reach in and delete the recovery copies through the same
-- door that compromised the live data. Same lesson as migration 26: fewer
-- policies here is safer, not an oversight.
create policy backups_admin_read on storage.objects
  for select using (bucket_id = 'backups' and public.is_admin());

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 18:30 UTC = 00:30 Dhaka -- just past midnight, after the day's farm
-- logging/checkout/admin activity has settled, and clear of the existing
-- 06:00-06:50 UTC platform syncs and the Friday 04:00 UTC weekly report.
SELECT cron.schedule(
  'daily-backup',
  '30 18 * * *',
  $$
  SELECT net.http_post(
    url     := 'https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/daily-backup',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0',
      'x-webhook-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'order_webhook_secret')
    )
  )
  $$
);

-- To check scheduled jobs later:      SELECT * FROM cron.job;
-- To check run history/failures:      SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;
-- To remove a schedule:               SELECT cron.unschedule('daily-backup');
-- To browse backups:                  Supabase Dashboard -> Storage -> backups bucket -> pick a date folder.
