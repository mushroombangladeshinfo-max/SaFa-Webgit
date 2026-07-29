-- Weekly farm report: fixes v_ops_daily's farm_revenue to count FnF sales
-- (added in migration 18, never wired into this view since it predates it —
-- same "built, not wired" shape as other fixes this session), then schedules
-- the weekly-report Edge Function every Friday 04:00 UTC (10:00 Dhaka),
-- summarizing the prior Saturday–Thursday business week.
--
-- CREATE OR REPLACE VIEW is safe here (no DROP needed) — the column list and
-- types are unchanged, only farm_revenue's expression gains one more term.

create or replace view public.v_ops_daily as
with days as (
  select log_date as day from farm_daily_logs
  union
  select expense_date as day from one_off_expenses
)
select
  d.day,
  coalesce(f.harvest_fresh_a,0) + coalesce(f.harvest_fresh_b,0) + coalesce(f.harvest_healthy_kg,0) + coalesce(f.harvest_recovered_kg,0) as harvest_fresh_kg,
  coalesce(f.harvest_dried,0) as harvest_dried_kg,
  coalesce(f.harvest_powder,0) as harvest_powder_kg,
  coalesce(f.qc_pass,0) as qc_pass_kg,
  coalesce(f.qc_fail,0) as qc_fail_kg,
  coalesce(f.s_fresh_kg,0)*coalesce(f.s_fresh_price,0) + coalesce(f.s_dried_kg,0)*coalesce(f.s_dried_price,0) + coalesce(f.s_powder_kg,0)*coalesce(f.s_powder_price,0) + coalesce(f.s_b2b_value,0) + coalesce(f.fnf_value,0) as farm_revenue,
  coalesce(f.ex_spawn,0) + coalesce(f.ex_substrate,0) + coalesce(f.ex_packaging,0) + coalesce(f.ex_labor,0) + coalesce(f.ex_electricity,0) + coalesce(f.ex_transport,0) + coalesce(f.ex_water,0) + coalesce(f.ex_other,0) + coalesce(oo.amount,0) as farm_expenses,
  coalesce(f.s_waste,0) as waste_kg,
  env.avg_temp,
  env.avg_humidity,
  coalesce(oo.amount,0) as one_off_expenses
from days d
left join farm_daily_logs f on f.log_date = d.day
left join (
  select expense_date as day, sum(amount) as amount
  from one_off_expenses group by expense_date
) oo on oo.day = d.day
left join (
  select created_at::date as day, round(avg(temperature),1) as avg_temp, round(avg(humidity),1) as avg_humidity
  from sensor_readings group by created_at::date
) env on env.day = d.day;

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.schedule(
  'weekly-report',
  '0 4 * * 5',
  $$
  SELECT net.http_post(
    url     := 'https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/weekly-report',
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
-- To remove a schedule:               SELECT cron.unschedule('weekly-report');
