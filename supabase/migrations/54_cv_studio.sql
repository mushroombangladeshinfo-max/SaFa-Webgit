-- CV Studio: generate a base CV per target role from the confirmed Career
-- Profile, then tailor it for a specific job — both evidence-constrained
-- (every bullet carries its own evidence + status, unsupported claims are
-- excluded rather than invented). A generated CV is immutable; a new
-- generation or tailoring pass always creates another row, chained via
-- parent_version_id, rather than overwriting one — so an earlier version
-- is never silently lost.

create table public.job_resume_versions (
  id                uuid primary key default gen_random_uuid(),
  profile_id        bigint not null references public.job_profiles(id) on delete cascade,
  parent_version_id uuid references public.job_resume_versions(id) on delete set null,
  opportunity_id    uuid references public.job_opportunities(id) on delete set null,
  kind              text not null check (kind in ('base', 'tailored')),
  name              text not null,
  target_role       text,
  -- The job_profiles.profile_version this was generated against — lets the
  -- UI flag a resume as stale once the confirmed profile has since changed,
  -- without needing to diff the full structured_profile every render.
  profile_version   integer not null,
  content           jsonb not null,
  ats               jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.job_resume_versions enable row level security;
create policy "admin full access" on public.job_resume_versions
  for all using (public.is_admin()) with check (public.is_admin());

create trigger trg_job_resume_versions_touch
  before update on public.job_resume_versions
  for each row execute function public.touch_updated_at();

alter publication supabase_realtime add table public.job_resume_versions;

create index job_resume_versions_profile_idx      on public.job_resume_versions(profile_id, created_at desc);
create index job_resume_versions_parent_idx        on public.job_resume_versions(parent_version_id);
create index job_resume_versions_opportunity_idx   on public.job_resume_versions(opportunity_id);
