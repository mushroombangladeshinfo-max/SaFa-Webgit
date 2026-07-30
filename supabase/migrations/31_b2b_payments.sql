-- B2B accounts-receivable tracking. farm_daily_logs.s_b2b_value records
-- revenue at time of sale but has no concept of "collected vs still owed" --
-- found while backfilling a legacy sale (batch 0, Hallal B2B) with a known
-- outstanding balance and nowhere structured to put it.
--
-- Ledger table (not a single "amount_paid" column) because a B2B buyer can
-- pay in installments across multiple days for one sale, and
-- farm_daily_logs is one row per CALENDAR DAY, not per sale -- a payment
-- received a week after the sale has no natural column to land in on that
-- earlier day's row. An append-only ledger plus a view that nets sold vs
-- paid avoids ever having to update/guess at a historical sale row again.

create table public.b2b_payments (
  id            bigint generated always as identity primary key,
  business_name text not null,
  amount        numeric(10,2) not null check (amount > 0),
  payment_date  date not null default current_date,
  batch_number  text references public.batches(batch_number),
  notes         text,
  created_at    timestamptz not null default now()
);

alter table public.b2b_payments enable row level security;

create policy b2b_payments_admin on public.b2b_payments
  for all using (is_admin()) with check (is_admin());

-- Per-buyer balance: total sold (from farm_daily_logs' existing s_b2b_*
-- fields, unchanged) minus total actually received (from the new ledger).
-- security_invoker so it's gated by both underlying tables' own
-- is_admin() policies, same convention as every other view in this schema.
create view public.v_b2b_receivables
with (security_invoker = true) as
with sold as (
  select s_b2b_name as business_name, sum(s_b2b_value) as total_sold
  from public.farm_daily_logs
  where s_b2b_name is not null
  group by s_b2b_name
),
paid as (
  select business_name, sum(amount) as total_paid
  from public.b2b_payments
  group by business_name
)
select
  s.business_name,
  s.total_sold,
  coalesce(p.total_paid, 0) as total_paid,
  s.total_sold - coalesce(p.total_paid, 0) as balance_due
from sold s
left join paid p on p.business_name = s.business_name;

grant select on public.v_b2b_receivables to authenticated;
