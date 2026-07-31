-- In-house spawn production, greenfield -- full pipeline from agar/petri
-- dishes onward, per the user's confirmed depth: culture (agar or liquid
-- culture) -> grain spawn (mother spawn, optionally multiplied G1->G2) ->
-- used to inoculate bulk substrate (inoculation_entries.grain_spawn_batch_id,
-- migration 34). Not a daily event -- gets its own page (spawn-lab.html),
-- not a toggle in quick-log's daily flow.

create table public.spawn_cultures (
  id                bigint generated always as identity primary key,
  stage             text not null check (stage in ('agar','liquid_culture')),
  strain            text,
  source            text,  -- free text: spore print, tissue culture, purchased slant, etc.
  parent_culture_id bigint references public.spawn_cultures(id),  -- e.g. an LC expanded from an agar plate
  quantity          int,   -- plate or jar count
  start_date        date not null default current_date,
  status            text not null default 'incubating'
                     check (status in ('incubating','ready','contaminated','used','expired')),
  ready_date        date,
  contaminated_count int not null default 0,
  location          text,  -- incubator/shelf, not a fruiting room -- not the A/B/C enum
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table public.grain_spawn_batches (
  id                     bigint generated always as identity primary key,
  source_culture_id      bigint references public.spawn_cultures(id),
  parent_grain_spawn_id  bigint references public.grain_spawn_batches(id),  -- G1->G2 multiplication
  grain_type             text,
  grain_kg               numeric,
  jars_or_bags_count     int,
  start_date             date not null default current_date,
  status                 text not null default 'incubating'
                         check (status in ('incubating','ready','contaminated','used','expired')),
  ready_date             date,
  contaminated_count     int not null default 0,
  location               text,
  notes                  text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

alter table public.inoculation_entries
  add constraint inoculation_entries_grain_spawn_batch_id_fkey
  foreign key (grain_spawn_batch_id) references public.grain_spawn_batches(id);

alter table public.spawn_cultures enable row level security;
alter table public.grain_spawn_batches enable row level security;

create policy spawn_cultures_admin on public.spawn_cultures
  for all using (is_admin()) with check (is_admin());
create policy grain_spawn_batches_admin on public.grain_spawn_batches
  for all using (is_admin()) with check (is_admin());

create trigger trg_spawn_cultures_touch
  before update on public.spawn_cultures
  for each row execute function public.touch_updated_at();
create trigger trg_grain_spawn_batches_touch
  before update on public.grain_spawn_batches
  for each row execute function public.touch_updated_at();

create index grain_spawn_batches_source_culture_idx on public.grain_spawn_batches(source_culture_id);
create index grain_spawn_batches_parent_idx on public.grain_spawn_batches(parent_grain_spawn_id);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'spawn_cultures'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.spawn_cultures;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'grain_spawn_batches'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.grain_spawn_batches;
  END IF;
END $$;
