-- Real batch tracking, replacing the free-text "Primary Batch" field that
-- only ever had one informally-named value ("batch_1") logged against it.
-- Batch number encodes room as a prefix -- standard agriculture/food
-- traceability practice (location + start date directly in the lot ID) --
-- since a room holds multiple shelves/batches, not one batch per room.
-- Format: {ROOM}-{YYMMDD}-{seq}, e.g. 'A-260729-01'.

create table public.batches (
  batch_number   text primary key,
  room           text not null,
  spawn_date     date not null,
  substrate_type text,
  status         text not null default 'active',
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.batches enable row level security;

create policy batches_admin on public.batches
  for all using (is_admin()) with check (is_admin());

create trigger trg_batches_touch
  before update on public.batches
  for each row execute function public.touch_updated_at();

-- FnF (friends & family) paid sales -- previously a bare "orders fulfilled"
-- count that conflated real B2B sales, free samples, and offline personal
-- sales into one meaningless number. Mirrors B2B's own qty/value shape,
-- minus a formal buyer list (FnF buyers are one-off individuals, not a
-- small repeat set the way B2B buyers are, so free text is appropriate
-- here rather than a dropdown).
alter table public.farm_daily_logs
  add column fnf_name  text,
  add column fnf_qty   numeric,
  add column fnf_value numeric;
