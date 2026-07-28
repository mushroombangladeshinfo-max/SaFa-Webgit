-- Wires up the order-confirmation-email Edge Function, which existed in the
-- repo but was never actually triggered by anything: checkout.html tells
-- customers "We'll send your receipt here" but no code path called the
-- function. The function itself expects a Supabase Database Webhook-style
-- payload ({ record: <row> }) on INSERT to orders — this trigger reproduces
-- that via pg_net directly instead of requiring the Dashboard UI click-through,
-- matching the same net.http_post pattern already used for the weather cron.
--
-- Two auth layers, same as the platform sync crons in INTEGRATIONS.md:
--   Authorization: the anon key — public by design, safe to inline directly
--   (this is the Edge Functions *gateway* check, separate from the function's
--   own logic; without it every call 401s before the function even runs).
--   x-webhook-secret: NOT public — this is what stops a stranger from POSTing
--   arbitrary order data at the function to spam emails through our Resend
--   quota. Lives in Supabase Vault (inserted separately via
--   `vault.create_secret()`, not in this file) and is looked up by name at
--   call time, so it never appears in git.

create or replace function public.notify_order_confirmation_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  webhook_secret text;
begin
  select decrypted_secret into webhook_secret
    from vault.decrypted_secrets
    where name = 'order_webhook_secret';

  perform net.http_post(
    url     := 'https://uiwmerejtrdrykqpumdu.supabase.co/functions/v1/order-confirmation-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0',
      'x-webhook-secret', webhook_secret
    ),
    body := jsonb_build_object('record', to_jsonb(new))
  );
  return new;
end;
$$;

drop trigger if exists trg_orders_confirmation_email on public.orders;
create trigger trg_orders_confirmation_email
  after insert on public.orders
  for each row
  execute function public.notify_order_confirmation_email();
