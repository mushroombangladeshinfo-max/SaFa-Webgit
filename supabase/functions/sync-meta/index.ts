// ============================================================================
// sync-meta — Facebook Page + Instagram + Meta Ads → marketing_metrics
// ============================================================================
// Pulls YESTERDAY's numbers from the Meta Graph API and upserts three rows:
//   channel='facebook'   page impressions/engagement/fans (+ ad spend)
//   channel='instagram'  reach/impressions/followers
//   (ad spend lands on 'facebook' unless you split campaigns by platform)
//
// ── SECRETS TO SET (Dashboard → Edge Functions → Secrets) ──────────────────
//   META_ACCESS_TOKEN   System-user token, never expires. Get it:
//                       business.facebook.com → Business Settings → Users →
//                       System Users → Generate Token → scopes:
//                       pages_read_engagement, read_insights, ads_read,
//                       instagram_basic, instagram_manage_insights
//   META_PAGE_ID        Page → About → Page ID
//   META_IG_USER_ID     Graph API: GET /{page-id}?fields=instagram_business_account
//   META_AD_ACCOUNT_ID  Ads Manager URL: act_XXXXXXXXX  (include the act_ prefix)
//
// ── RUN ────────────────────────────────────────────────────────────────────
//   Deploy:   npx supabase functions deploy sync-meta
//   Test:     curl -X POST https://<ref>.supabase.co/functions/v1/sync-meta \
//                  -H "Authorization: Bearer <anon-key>"
//   Schedule: daily 06:00 (see INTEGRATIONS.md → Scheduling)
//
// NOTE: field names below match Graph API v20. When you connect for real,
// sanity-check one response in the Graph API Explorer — Meta occasionally
// renames insight metrics between versions.
// ============================================================================

import { upsertMetrics, touchLastSynced, daysAgo, json, guard, type MetricRow } from '../_shared/metrics.ts';

const GRAPH = 'https://graph.facebook.com/v20.0';

Deno.serve(async (req) => {
  const g = guard(req, [
    'META_ACCESS_TOKEN',
    'META_PAGE_ID',
    'META_IG_USER_ID',
    'META_AD_ACCOUNT_ID',
  ]);
  if (!g.ok) return g.res;
  const { META_ACCESS_TOKEN: TOKEN, META_PAGE_ID, META_IG_USER_ID, META_AD_ACCOUNT_ID } = g.env;

  // Allow ?date=YYYY-MM-DD for backfills; default: yesterday.
  const date = new URL(req.url).searchParams.get('date') ?? daysAgo(1);
  const since = date, until = date;
  const rows: MetricRow[] = [];
  const errors: string[] = [];

  // ── 1. Facebook Page insights ─────────────────────────────────────────────
  try {
    const metrics = 'page_impressions,page_impressions_unique,page_post_engagements,page_fans';
    const r = await fetch(
      `${GRAPH}/${META_PAGE_ID}/insights?metric=${metrics}&period=day` +
      `&since=${since}&until=${until}&access_token=${TOKEN}`,
    ).then((x) => x.json());

    // Response shape: { data: [ { name, values: [{ value }] }, ... ] }
    const get = (name: string) =>
      r.data?.find((m: { name: string }) => m.name === name)?.values?.at(-1)?.value ?? null;

    rows.push({
      metric_date: date,
      channel: 'facebook',
      impressions: get('page_impressions'),
      reach:       get('page_impressions_unique'),
      engagements: get('page_post_engagements'),
      followers:   get('page_fans'),
    });
  } catch (e) { errors.push(`facebook page: ${e}`); }

  // ── 2. Instagram insights ────────────────────────────────────────────────
  try {
    const r = await fetch(
      `${GRAPH}/${META_IG_USER_ID}/insights?metric=impressions,reach&period=day` +
      `&since=${since}&until=${until}&access_token=${TOKEN}`,
    ).then((x) => x.json());
    const follower = await fetch(
      `${GRAPH}/${META_IG_USER_ID}?fields=followers_count&access_token=${TOKEN}`,
    ).then((x) => x.json());

    const get = (name: string) =>
      r.data?.find((m: { name: string }) => m.name === name)?.values?.at(-1)?.value ?? null;

    rows.push({
      metric_date: date,
      channel: 'instagram',
      impressions: get('impressions'),
      reach:       get('reach'),
      followers:   follower.followers_count ?? null,
    });
  } catch (e) { errors.push(`instagram: ${e}`); }

  // ── 3. Meta Ads spend (whole ad account, attributed to 'facebook') ────────
  try {
    const r = await fetch(
      `${GRAPH}/${META_AD_ACCOUNT_ID}/insights?fields=spend,impressions,clicks,actions` +
      `&time_range={"since":"${since}","until":"${until}"}&access_token=${TOKEN}`,
    ).then((x) => x.json());

    const d = r.data?.[0];
    if (d) {
      const purchases = d.actions?.find(
        (a: { action_type: string }) => a.action_type === 'purchase',
      )?.value;
      // Merge spend into the facebook row (same unique key → same row).
      const fb = rows.find((x) => x.channel === 'facebook') ??
        rows[rows.push({ metric_date: date, channel: 'facebook' }) - 1];
      fb.spend       = parseFloat(d.spend ?? '0');
      fb.clicks      = parseInt(d.clicks ?? '0', 10);
      fb.conversions = purchases ? parseInt(purchases, 10) : undefined;
    }
  } catch (e) { errors.push(`meta ads: ${e}`); }

  // ── 4. Store ─────────────────────────────────────────────────────────────
  await upsertMetrics(rows);
  await touchLastSynced('facebook');
  await touchLastSynced('instagram');

  return json({ configured: true, date, rows_written: rows.length, errors });
});
