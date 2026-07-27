// ============================================================================
// _shared/metrics.ts — common plumbing for every platform sync function
// ============================================================================
// Each sync-* function fetches yesterday's numbers from one platform and
// calls upsertMetrics(). The upsert targets the UNIQUE
// (metric_date, channel, account_ref) key on marketing_metrics, so re-running
// a sync (or overwriting a manual entry) is always safe and idempotent.
//
// Uses Supabase's auto-injected env vars — no keys to configure for THIS
// file: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY exist in every deployed
// edge function automatically.
// ============================================================================

/** One day-row destined for public.marketing_metrics. */
export interface MetricRow {
  metric_date: string;            // 'YYYY-MM-DD'
  channel:
    | 'facebook' | 'instagram' | 'tiktok' | 'whatsapp'
    | 'linkedin' | 'google_ads' | 'website' | 'other';
  account_ref?: string;           // defaults to 'default'
  spend?: number;
  impressions?: number;
  reach?: number;
  clicks?: number;
  engagements?: number;
  video_views?: number;
  followers?: number;             // end-of-day snapshot
  leads?: number;
  conversions?: number;
  revenue_attr?: number;
  notes?: string;
}

/** Every column PostgREST needs to see on EVERY row of a batch insert —
 *  it rejects the whole batch (PGRST102) if row objects don't all have
 *  identical key sets, so we pad every row out to this full shape. */
const METRIC_ROW_TEMPLATE: Omit<MetricRow, 'metric_date' | 'channel'> = {
  account_ref:  'default',
  spend:        undefined,
  impressions:  undefined,
  reach:        undefined,
  clicks:       undefined,
  engagements:  undefined,
  video_views:  undefined,
  followers:    undefined,
  leads:        undefined,
  conversions:  undefined,
  revenue_attr: undefined,
  notes:        undefined,
};

/** Insert-or-update rows into marketing_metrics (source = 'api'). */
export async function upsertMetrics(rows: MetricRow[]): Promise<void> {
  if (!rows.length) return;

  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Supabase env vars missing (deploy via supabase CLI)');

  // Normalize every row to the same key set (values default to null, not
  // just omitted) — PostgREST's bulk insert requires matching object shapes.
  const normalized = rows.map((r) => {
    const merged = { ...METRIC_ROW_TEMPLATE, ...r, source: 'api' };
    for (const k of Object.keys(merged) as (keyof typeof merged)[]) {
      if (merged[k] === undefined) (merged as Record<string, unknown>)[k] = null;
    }
    return merged;
  });

  const res = await fetch(
    `${url}/rest/v1/marketing_metrics?on_conflict=metric_date,channel,account_ref`,
    {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        // merge-duplicates → UPSERT on the unique key
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(normalized),
    },
  );

  if (!res.ok) {
    throw new Error(`marketing_metrics upsert failed (${res.status}): ${await res.text()}`);
  }
}

/** One day-row destined for public.site_section_engagement. */
export interface SectionEngagementRow {
  metric_date:  string;
  page_path:    string;
  section_name: string;
  views:        number;
}

/** Insert-or-update rows into site_section_engagement. */
export async function upsertSectionEngagement(rows: SectionEngagementRow[]): Promise<void> {
  if (!rows.length) return;
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Supabase env vars missing (deploy via supabase CLI)');

  const res = await fetch(
    `${url}/rest/v1/site_section_engagement?on_conflict=metric_date,page_path,section_name`,
    {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(rows),
    },
  );
  if (!res.ok) {
    throw new Error(`site_section_engagement upsert failed (${res.status}): ${await res.text()}`);
  }
}

/** One day-row destined for public.site_scroll_depth. */
export interface ScrollDepthRow {
  metric_date:      string;
  page_path:        string;
  percent_scrolled: 25 | 50 | 75 | 90;
  sessions:         number;
}

/** Insert-or-update rows into site_scroll_depth. */
export async function upsertScrollDepth(rows: ScrollDepthRow[]): Promise<void> {
  if (!rows.length) return;
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Supabase env vars missing (deploy via supabase CLI)');

  const res = await fetch(
    `${url}/rest/v1/site_scroll_depth?on_conflict=metric_date,page_path,percent_scrolled`,
    {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(rows),
    },
  );
  if (!res.ok) {
    throw new Error(`site_scroll_depth upsert failed (${res.status}): ${await res.text()}`);
  }
}

/** One day-row destined for public.weather_daily. */
export interface WeatherRow {
  weather_date:            string;   // 'YYYY-MM-DD'
  temp_min_c?:              number;
  temp_max_c?:              number;
  temp_day_avg_c?:          number;
  temp_night_avg_c?:        number;
  humidity_day_avg_pct?:    number;
  humidity_night_avg_pct?:  number;
  precipitation_mm?:        number;
  conditions?:               string;
}

/** Insert-or-update rows into weather_daily. */
export async function upsertWeather(rows: WeatherRow[]): Promise<void> {
  if (!rows.length) return;
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Supabase env vars missing (deploy via supabase CLI)');

  const res = await fetch(
    `${url}/rest/v1/weather_daily?on_conflict=weather_date`,
    {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(rows.map((r) => ({ ...r, source: 'open-meteo' }))),
    },
  );
  if (!res.ok) {
    throw new Error(`weather_daily upsert failed (${res.status}): ${await res.text()}`);
  }
}

/** Stamp channel_accounts.last_synced so the dashboard shows sync health. */
export async function touchLastSynced(channel: string): Promise<void> {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return;

  await fetch(`${url}/rest/v1/channel_accounts?channel=eq.${channel}`, {
    method: 'PATCH',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ last_synced: new Date().toISOString() }),
  });
}

/** 'YYYY-MM-DD' for N days ago (default 1 = yesterday, the usual sync day —
 *  platforms finalise a day's numbers only after it ends). */
export function daysAgo(n = 1): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Standard JSON response helper. */
export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Guard every sync function:
 *  - optional CRON_SECRET check (set it in Edge Function secrets, then send
 *    header  x-cron-secret: <value>  from your scheduler / manual curl)
 *  - collects required platform env keys; returns a helpful "not configured"
 *    payload listing exactly which secrets are missing, instead of crashing.
 */
export function guard(
  req: Request,
  requiredEnv: string[],
): { ok: true; env: Record<string, string> } | { ok: false; res: Response } {
  const CRON_SECRET = Deno.env.get('CRON_SECRET');
  if (CRON_SECRET && req.headers.get('x-cron-secret') !== CRON_SECRET) {
    return { ok: false, res: json({ error: 'Unauthorized' }, 401) };
  }

  const env: Record<string, string> = {};
  const missing: string[] = [];
  for (const name of requiredEnv) {
    const v = Deno.env.get(name);
    if (v && !v.startsWith('PLACEHOLDER')) env[name] = v;
    else missing.push(name);
  }

  if (missing.length) {
    return {
      ok: false,
      res: json({
        configured: false,
        message: 'Sync skipped — API credentials not set yet. Add the secrets below, then re-run.',
        missing_secrets: missing,
        how: 'Supabase Dashboard → Edge Functions → Secrets (see INTEGRATIONS.md)',
      }),
    };
  }

  return { ok: true, env };
}
