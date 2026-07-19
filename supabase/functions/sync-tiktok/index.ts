// ============================================================================
// sync-tiktok — TikTok Business account → marketing_metrics
// ============================================================================
// Pulls YESTERDAY's organic account metrics (video views, engagement,
// followers) into channel='tiktok'. Ad spend can be added later via the
// TikTok Ads endpoint (commented stub at the bottom).
//
// ── SECRETS TO SET ─────────────────────────────────────────────────────────
//   TIKTOK_ACCESS_TOKEN  From a TikTok for Developers app with the
//                        "TikTok Business Account" product enabled.
//                        developers.tiktok.com → Manage apps → your app →
//                        add product "Business Account" → OAuth flow →
//                        long-lived access token.
//   TIKTOK_BUSINESS_ID   Your business account's open_id / business_id
//                        (returned during the OAuth handshake).
//
// ── RUN ────────────────────────────────────────────────────────────────────
//   Deploy:   npx supabase functions deploy sync-tiktok
//   Schedule: daily 06:10 (see INTEGRATIONS.md)
//
// NOTE: TikTok's API surface changes more often than Meta's. When you
// connect for real, verify the endpoint + field names against
// business-api.tiktok.com docs ("Get Business Account Data").
// ============================================================================

import { upsertMetrics, touchLastSynced, daysAgo, json, guard } from '../_shared/metrics.ts';

const API = 'https://business-api.tiktok.com/open_api/v1.3';

Deno.serve(async (req) => {
  const g = guard(req, ['TIKTOK_ACCESS_TOKEN', 'TIKTOK_BUSINESS_ID']);
  if (!g.ok) return g.res;
  const { TIKTOK_ACCESS_TOKEN: TOKEN, TIKTOK_BUSINESS_ID: BIZ_ID } = g.env;

  const date = new URL(req.url).searchParams.get('date') ?? daysAgo(1);
  const errors: string[] = [];

  try {
    // "Get Business Account Data" — daily organic metrics.
    const r = await fetch(
      `${API}/business/get/?business_id=${BIZ_ID}` +
      `&fields=["video_views","likes","comments","shares","followers_count","profile_views"]` +
      `&start_date=${date}&end_date=${date}`,
      { headers: { 'Access-Token': TOKEN } },
    ).then((x) => x.json());

    // Expected shape: { data: { metrics: [ { date, video_views, likes, ... } ] } }
    const d = r.data?.metrics?.[0] ?? {};

    await upsertMetrics([{
      metric_date: date,
      channel: 'tiktok',
      video_views: d.video_views ?? null,
      engagements: (d.likes ?? 0) + (d.comments ?? 0) + (d.shares ?? 0) || null,
      followers:   d.followers_count ?? null,
      impressions: d.profile_views ?? null,
    }]);
    await touchLastSynced('tiktok');
  } catch (e) { errors.push(String(e)); }

  return json({ configured: true, date, errors });

  // ── LATER: TikTok Ads spend ────────────────────────────────────────────
  // Requires the "TikTok Ads" product + TIKTOK_ADVERTISER_ID secret.
  // GET ${API}/report/integrated/get/  with report_type=BASIC,
  // dimensions=["stat_time_day"], metrics=["spend","impressions","clicks"]
  // → merge into the same upsert row (spend / impressions / clicks).
});
