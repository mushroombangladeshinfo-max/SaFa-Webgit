-- Recurring monthly expenses (rent, and any future fixed monthly cost).
-- Previously every expense in one_off_expenses was, as the name says, a
-- one-off manual entry — nothing modeled a cost that repeats every month
-- without being re-typed. recurring_expenses is a small template table;
-- apply_recurring_expenses() reads it daily (via cron, self-healing if a
-- run is missed) and inserts the matching one_off_expenses row once per
-- template per calendar month, linked back via recurring_expense_id so the
-- idempotency check is a clean FK lookup instead of fuzzy date/description
-- matching.
create table public.recurring_expenses (
  id           bigint generated always as identity primary key,
  description  text not null,
  category     text not null,
  amount       numeric not null check (amount > 0),
  day_of_month int not null default 1 check (day_of_month between 1 and 28),
  start_date   date not null,
  end_date     date,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);

alter table public.recurring_expenses enable row level security;

create policy "admin full access" on public.recurring_expenses
  for all using (public.is_admin()) with check (public.is_admin());

alter publication supabase_realtime add table public.recurring_expenses;

-- one_off_expenses row auto-created by a recurring template; null for every
-- manually-entered expense (the existing, unchanged path).
alter table public.one_off_expenses
  add column recurring_expense_id bigint references public.recurring_expenses(id);

create index one_off_expenses_recurring_idx on public.one_off_expenses(recurring_expense_id);

create or replace function public.apply_recurring_expenses()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  today date := (now() at time zone 'Asia/Dhaka')::date;
  this_month date := date_trunc('month', today)::date;
  target_date date;
begin
  for r in
    select * from public.recurring_expenses
    where active
      and start_date <= today
      and (end_date is null or end_date >= today)
  loop
    target_date := this_month + (r.day_of_month - 1);
    if target_date <= today and not exists (
      select 1 from public.one_off_expenses
      where recurring_expense_id = r.id
        and expense_date >= this_month
        and expense_date < (this_month + interval '1 month')
    ) then
      insert into public.one_off_expenses (expense_date, category, description, amount, recurring_expense_id)
      values (target_date, r.category, r.description, r.amount, r.id);
    end if;
  end loop;
end;
$$;

-- Runs daily just after midnight Dhaka time (01:00) — daily rather than
-- once-on-the-1st so a missed cron run self-heals instead of silently
-- skipping a month; the not-exists check makes every other day's run a
-- no-op. Chosen to land just after daily-backup (18:30 UTC / 00:30 Dhaka)
-- rather than colliding with it.
select cron.schedule(
  'apply-recurring-expenses',
  '0 19 * * *',
  $$ select public.apply_recurring_expenses(); $$
);

-- Rent: ৳2000/month total, split as ৳1000 in each founder's name, backdated
-- to July 2026 per the user's request.
insert into public.recurring_expenses (description, category, amount, day_of_month, start_date)
values
  ('Rent — Fahim''s share', 'Rent', 1000, 1, '2026-07-01'),
  ('Rent — Sunny Bhai''s share', 'Rent', 1000, 1, '2026-07-01');

-- Backfill July + August 2026 (months already elapsed before this migration
-- ran) directly, linked to the templates above so future cron runs treat
-- them as already-applied and don't duplicate.
insert into public.one_off_expenses (expense_date, category, description, amount, recurring_expense_id)
select '2026-07-01'::date, re.category, re.description, re.amount, re.id
from public.recurring_expenses re
where re.description in ('Rent — Fahim''s share', 'Rent — Sunny Bhai''s share');

insert into public.one_off_expenses (expense_date, category, description, amount, recurring_expense_id)
select '2026-08-01'::date, re.category, re.description, re.amount, re.id
from public.recurring_expenses re
where re.description in ('Rent — Fahim''s share', 'Rent — Sunny Bhai''s share');
