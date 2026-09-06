-- Multi-profile support: every table in the Job Search Command Center was
-- implicitly single-user (job_career_profile was a hard singleton, and
-- nothing else had any notion of "whose" data a row was). This lets more
-- than one person's job search — or the same person's separate career
-- tracks — be tracked side by side without mixing data.
--
-- This is an ORGANIZATIONAL separation, not an access-control one: this
-- app's whole security model is is_admin() (any admin sees everything,
-- with zero per-founder partitioning anywhere else in the site), so
-- profile scoping here is enforced by the application layer (every query
-- filtered/tagged with profile_id), matching how the rest of the app
-- already works — not by per-profile RLS policies.

create table public.job_profiles (
  id                 bigint generated always as identity primary key,
  profile_name       text not null,
  education          text,
  work_experience    text,
  projects           text,
  skills             text,
  languages          text,
  certifications     text,
  career_preferences text,
  work_authorization text,
  target_locations   text,
  target_roles       text,
  salary_preferences text,
  availability       text,
  career_narrative   text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.job_profiles enable row level security;
create policy "admin full access" on public.job_profiles
  for all using (public.is_admin()) with check (public.is_admin());

create trigger trg_job_profiles_touch
  before update on public.job_profiles
  for each row execute function public.touch_updated_at();

alter publication supabase_realtime add table public.job_profiles;

-- Copy whatever is actually in the existing singleton row (never assume
-- its contents) into the first profile. job_career_profile itself is left
-- in place, unused — non-destructive, matches this codebase's convention
-- of never dropping a superseded table/column.
insert into public.job_profiles (
  profile_name, education, work_experience, projects, skills, languages,
  certifications, career_preferences, work_authorization, target_locations,
  target_roles, salary_preferences, availability, career_narrative
)
select
  'My Job Search', education, work_experience, projects, skills, languages,
  certifications, career_preferences, work_authorization, target_locations,
  target_roles, salary_preferences, availability, career_narrative
from public.job_career_profile
where id = true;

-- Add profile_id nullable first, backfill whatever real rows already
-- exist to the new default profile, then constrain to not null.
do $$
declare
  default_profile_id bigint;
begin
  select id into default_profile_id from public.job_profiles order by id limit 1;

  alter table public.job_opportunities add column profile_id bigint references public.job_profiles(id) on delete cascade;
  update public.job_opportunities set profile_id = default_profile_id where profile_id is null;
  alter table public.job_opportunities alter column profile_id set not null;

  alter table public.job_contacts add column profile_id bigint references public.job_profiles(id) on delete cascade;
  update public.job_contacts set profile_id = default_profile_id where profile_id is null;
  alter table public.job_contacts alter column profile_id set not null;

  alter table public.job_interviews add column profile_id bigint references public.job_profiles(id) on delete cascade;
  update public.job_interviews set profile_id = default_profile_id where profile_id is null;
  alter table public.job_interviews alter column profile_id set not null;

  alter table public.job_offers add column profile_id bigint references public.job_profiles(id) on delete cascade;
  update public.job_offers set profile_id = default_profile_id where profile_id is null;
  alter table public.job_offers alter column profile_id set not null;

  alter table public.job_skills add column profile_id bigint references public.job_profiles(id) on delete cascade;
  update public.job_skills set profile_id = default_profile_id where profile_id is null;
  alter table public.job_skills alter column profile_id set not null;

  alter table public.job_activities add column profile_id bigint references public.job_profiles(id) on delete cascade;
  update public.job_activities set profile_id = default_profile_id where profile_id is null;
  alter table public.job_activities alter column profile_id set not null;
end $$;

create index job_opportunities_profile_idx on public.job_opportunities(profile_id);
create index job_contacts_profile_idx      on public.job_contacts(profile_id);
create index job_interviews_profile_idx    on public.job_interviews(profile_id);
create index job_offers_profile_idx        on public.job_offers(profile_id);
create index job_skills_profile_idx        on public.job_skills(profile_id);
create index job_activities_profile_idx    on public.job_activities(profile_id);
