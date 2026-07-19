// ============================================================================
// sync-google-ads — Google Ads spend/clicks/conversions → marketing_metrics
// ============================================================================
// Pulls YESTERDAY's account-level totals into channel='google_ads'.
//
// Google Ads has the most involved auth of all the platforms (OAuth2 +
// developer token). Do it once, paste four secrets, done:
//
// ── SECRETS TO SET ─────────────────────────────────────────────────────────
//   GOOGLE_ADS_DEVELOPER_TOKEN  ads.google.com → Tools → API Center
//                               (Basic access is enough for your own account)
//   GOOGLE_ADS_CLIENT_ID        console.cloud.google.com → OAuth client
//   GOOGLE_ADS_CLIENT_SECRET    (same OAuth client)
//   GOOGLE_ADS_REFRESH_TOKEN    One-time OAuth consent for your Google
//                               account → exchange code for refresh token.
//                               Easiest path: developers.google.com/oauthplayground
//                               with scope https://www.googleapis.com/auth/adwords
//   GOOGLE_ADS_CUSTOMER_ID      Ten digits, no dashes (top-right in Ads UI)
//
// ── RUN ────────────────────────────────────────────────────────────────────
//   Deploy:   npx supabase functions deploy sync-google-ads
//   Schedule: daily 06:20 (see INTEGRATIONS.md)
// ============================================================================

import { upsertMetrics, touchLastSynced, daysAgo, json, guard } from '../_shared/metrics.ts';

Deno.serve(async (req) => {
  const g = guard(req, [
    'GOOGLE_ADS_DEVELOPER_TOKEN',
    'GOOGLE_ADS_CLIENT_ID',
    'GOOGLE_ADS_CLIENT_SECRET',
    'GOOGLE_ADS_REFRESH_TOKEN',
    'GOOGLE_ADS_CUSTOMER_ID',
  ]);
  if (!g.ok) return g.res;
  const env = g.env;

  const date = new URL(req.url).searchParams.get('date') ?? daysAgo(1);
  const errors: string[] = [];

  try {
    // ── 1. Refresh token → access token ────────────────────────────────────
    const tok = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     env.GOOGLE_ADS_CLIENT_ID,
        client_secret: env.GOOGLE_ADS_CLIENT_SECRET,
        refresh_token: env.GOOGLE_ADS_REFRESH_TOKEN,
        grant_type:    'refresh_token',
      }),
    }).then((x) => x.json());
    if (!tok.access_token) throw new Error(`OAuth refresh failed: ${JSON.stringify(tok)}`);

    // ── 2. GAQL query — account totals for the day ─────────────────────────
    const query = `
      SELECT metrics.cost_micros, metrics.impressions, metrics.clicks,
             metrics.conversions, metrics.conversions_value
      FROM customer
      WHERE segments.date = '${date}'`;

    const r = await fetch(
      `https://googleads.googleapis.com/v17/customers/${env.GOOGLE_ADS_CUSTOMER_ID}/googleAds:searchStream`,
      {
        method: 'POST',
        headers: {
          Authorization:     `Bearer ${tok.access_token}`,
          'developer-token': env.GOOGLE_ADS_DEVELOPER_TOKEN,
          'Content-Type':    'application/json',
        },
        body: JSON.stringify({ query }),
      },
    ).then((x) => x.json());

    // searchStream returns an array of chunks: [{ results: [{ metrics }] }]
    const m = r?.[0]?.results?.[0]?.metrics ?? {};

    await upsertMetrics([{
      metric_date:  date,
      channel:      'google_ads',
      spend:        m.costMicros ? Number(m.costMicros) / 1_000_000 : null,
      impressions:  m.impressions ? Number(m.impressions) : null,
      clicks:       m.clicks ? Number(m.clicks) : null,
      conversions:  m.conversions ? Math.round(Number(m.conversions)) : null,
      revenue_attr: m.conversionsValue ? Number(m.conversionsValue) : null,
    }]);
    await touchLastSynced('google_ads');
  } catch (e) { errors.push(String(e)); }

  return json({ configured: true, date, errors });
});
