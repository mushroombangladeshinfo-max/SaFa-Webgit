// ============================================================================
// sync-weather — farm-location weather → weather_daily
// ============================================================================
// Pulls day/night temperature, humidity and rainfall for the farm's own
// coordinates (Sirajganj, 24.4539°N 89.7006°E — matches the LocalBusiness
// schema in index.html) from Open-Meteo. No API key, no signup, no secrets
// to configure — this is the one sync function that "just works" with zero
// setup, unlike the platform syncs which need OAuth/developer tokens.
//
// Replaces the manual "আজকের আবহাওয়া" dropdown in quick-log.html, which
// had 0 of 4 log entries ever filled in — a habit that was never going to
// stick. This runs automatically instead.
//
// ── RUN ────────────────────────────────────────────────────────────────────
//   Deploy:   npx supabase functions deploy sync-weather
//   Test:     curl -X POST https://<ref>.supabase.co/functions/v1/sync-weather \
//                  -H "Authorization: Bearer <anon-key>"
//   Backfill: .../sync-weather?date=2026-07-20   (Open-Meteo keeps ~92 days
//             of recent history on the free forecast endpoint used here)
// ============================================================================

import { upsertWeather, daysAgo, json, guard, type WeatherRow } from '../_shared/metrics.ts';

const LATITUDE  = 24.4539;
const LONGITUDE = 89.7006;
const TIMEZONE  = 'Asia/Dhaka';

// Local-hour boundaries splitting a day into "day" vs "night" buckets.
const DAY_START_HOUR = 6;   // 06:00 local
const NIGHT_START_HOUR = 18; // 18:00 local

function mean(nums: number[]): number | null {
  if (!nums.length) return null;
  return Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 10) / 10;
}

/** Simple rule-based label using the same vocabulary the old manual
 *  dropdown used (normal/hot/rainy/cold/humid/stormy), so historical
 *  manual entries and auto-synced ones read the same way. */
function classify(
  tempMax: number | null, tempMin: number | null,
  humidityDayAvg: number | null, precipitationMm: number | null,
): string {
  if (precipitationMm !== null && precipitationMm >= 20) return 'stormy';
  if (precipitationMm !== null && precipitationMm >= 1) return 'rainy';
  if (tempMax !== null && tempMax >= 35) return 'hot';
  if (tempMin !== null && tempMin <= 15) return 'cold';
  if (humidityDayAvg !== null && humidityDayAvg >= 85) return 'humid';
  return 'normal';
}

Deno.serve(async (req) => {
  const g = guard(req, []); // no platform secrets needed — Open-Meteo is keyless
  if (!g.ok) return g.res;

  const date = new URL(req.url).searchParams.get('date') ?? daysAgo(1);

  try {
    // past_days must cover from `date` through today; Open-Meteo's free
    // forecast endpoint accepts up to 92.
    const daysBack = Math.min(
      92,
      Math.max(1, Math.ceil((Date.now() - new Date(`${date}T00:00:00+06:00`).getTime()) / 86_400_000) + 1),
    );

    const url = `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${LATITUDE}&longitude=${LONGITUDE}` +
      `&hourly=temperature_2m,relative_humidity_2m,precipitation` +
      `&past_days=${daysBack}&forecast_days=1&timezone=${encodeURIComponent(TIMEZONE)}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo replied ${res.status}: ${await res.text()}`);
    const data = await res.json();

    const times: string[] = data.hourly?.time ?? [];
    const temps: number[] = data.hourly?.temperature_2m ?? [];
    const humidity: number[] = data.hourly?.relative_humidity_2m ?? [];
    const precip: number[] = data.hourly?.precipitation ?? [];

    const dayTemps: number[] = [], nightTemps: number[] = [];
    const dayHumidity: number[] = [], nightHumidity: number[] = [];
    const allTemps: number[] = [];
    let totalPrecip = 0;
    let hoursFound = 0;

    times.forEach((iso, i) => {
      if (!iso.startsWith(date)) return; // only this target date's 24 hours
      hoursFound++;
      const hour = Number(iso.slice(11, 13));
      const t = temps[i], h = humidity[i], p = precip[i] ?? 0;
      if (typeof t === 'number') {
        allTemps.push(t);
        if (hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR) dayTemps.push(t);
        else nightTemps.push(t);
      }
      if (typeof h === 'number') {
        if (hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR) dayHumidity.push(h);
        else nightHumidity.push(h);
      }
      totalPrecip += p;
    });

    if (!hoursFound) {
      return json({ configured: true, date, rows_written: 0, error: 'No hourly data returned for that date (too far in the past for the free forecast endpoint — max ~92 days back).' });
    }

    const tempMin = allTemps.length ? Math.min(...allTemps) : null;
    const tempMax = allTemps.length ? Math.max(...allTemps) : null;
    const humidityDayAvg = mean(dayHumidity);

    const row: WeatherRow = {
      weather_date:           date,
      temp_min_c:             tempMin,
      temp_max_c:             tempMax,
      temp_day_avg_c:         mean(dayTemps),
      temp_night_avg_c:       mean(nightTemps),
      humidity_day_avg_pct:   humidityDayAvg,
      humidity_night_avg_pct: mean(nightHumidity),
      precipitation_mm:       Math.round(totalPrecip * 10) / 10,
      conditions:             classify(tempMax, tempMin, humidityDayAvg, totalPrecip),
    };

    await upsertWeather([row]);

    return json({ configured: true, date, rows_written: 1, row });
  } catch (e) {
    return json({ configured: true, date, rows_written: 0, error: String(e) }, 500);
  }
});
