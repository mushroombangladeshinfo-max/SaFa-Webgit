-- ============================================================================
-- 12_weather_daily.sql — automated daily weather for the farm's location
-- ============================================================================
-- Replaces the manual "আজকের আবহাওয়া" (today's weather) dropdown in
-- quick-log.html, which required a click every day and — checked directly —
-- had 0 of 4 log entries ever filled in. sync-weather pulls real day/night
-- temperature, humidity and rainfall for the farm's coordinates
-- (Sirajganj, 24.4539°N 89.7006°E — from index.html's LocalBusiness schema)
-- from Open-Meteo (free, no API key needed) once a day, automatically.
--
-- Answers: "was there a rainy/humid stretch when contamination spiked?" once
-- joined against farm_daily_logs' QC contamination fields by date — no
-- manual entry required going forward.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.weather_daily (
  weather_date            DATE NOT NULL PRIMARY KEY,

  temp_min_c              NUMERIC,
  temp_max_c              NUMERIC,
  temp_day_avg_c          NUMERIC,   -- mean of 06:00–17:59 local hours
  temp_night_avg_c        NUMERIC,   -- mean of 18:00–05:59 local hours
  humidity_day_avg_pct    NUMERIC,
  humidity_night_avg_pct  NUMERIC,
  precipitation_mm        NUMERIC,   -- total for the day

  -- Auto-classified into the same vocabulary the old manual dropdown used
  -- (normal/hot/rainy/cold/humid/stormy), so any future view can treat
  -- historical manual entries and auto-synced ones the same way.
  conditions               TEXT,

  source                   TEXT NOT NULL DEFAULT 'open-meteo',
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weather_daily_date ON public.weather_daily (weather_date DESC);

ALTER TABLE public.weather_daily ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS weather_daily_admin ON public.weather_daily;
CREATE POLICY weather_daily_admin ON public.weather_daily
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_weather_daily_touch ON public.weather_daily;
CREATE TRIGGER trg_weather_daily_touch BEFORE UPDATE ON public.weather_daily
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
