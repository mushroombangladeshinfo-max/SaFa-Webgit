-- Two fixes to Contamination (qc_entries), per the user's direct feedback:
--
-- 1. Bag count ("bags") isn't a meaningful unit -- bags aren't a uniform
-- size, so a count can't be compared across entries or summed
-- meaningfully. Weight (kg) is added as bags_kg; bags (int) stays in
-- schema unused going forward, same non-destructive pattern as every
-- other superseded column this session.
--
-- 2. batch_number is the identifier that actually ties everything
-- together across the app (harvest_entries, inoculation_entries both key
-- off it) -- Contamination was the one child table still keyed only by
-- room, which can't disambiguate if a room's active batch matters
-- elsewhere (BE%, batch history). batch_number is now captured directly;
-- room is still stored too (auto-derived from the batch when one is
-- selected, kept as a manual fallback for the rare case contamination is
-- found with no identifiable active batch -- e.g. an idle room).
alter table public.qc_entries
  add column batch_number text references public.batches(batch_number),
  add column bags_kg numeric;

create index qc_entries_batch_number_idx on public.qc_entries(batch_number);

-- farm_daily_logs.contam_bags (count) is superseded by contam_kg (weight),
-- same daily-aggregate role contam_bags played for
-- v_contamination_weather_weekly. contam_bags stays in schema, unused
-- going forward.
alter table public.farm_daily_logs
  add column contam_kg numeric;

-- v_contamination_weather_weekly: bags_affected -> kg_affected, sourced
-- from the new column. Column name changes, so this needs drop+create
-- rather than create-or-replace.
drop view public.v_contamination_weather_weekly;

create view public.v_contamination_weather_weekly
with (security_invoker = true) as
select
  date_trunc('week', f.log_date)::date as week,
  count(*) filter (where f.contam_event) as contam_days,
  sum(coalesce(f.contam_kg,0)) as kg_affected,
  round(avg(w.temp_day_avg_c)::numeric, 1) as avg_day_temp_c,
  round(avg(w.humidity_day_avg_pct)::numeric, 1) as avg_day_humidity_pct
from public.farm_daily_logs f
left join public.weather_daily w on w.weather_date = f.log_date
group by 1
order by 1;

grant select on public.v_contamination_weather_weekly to authenticated;
