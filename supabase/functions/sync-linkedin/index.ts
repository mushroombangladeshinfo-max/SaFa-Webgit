// ============================================================================
// sync-linkedin — LinkedIn Company Page → marketing_metrics
// ============================================================================
// Pulls YESTERDAY's organic page stats (impressions, clicks, engagement,
// follower count) into channel='linkedin'.
//
// ── SECRETS TO SET ─────────────────────────────────────────────────────────
//   LINKEDIN_ACCESS_TOKEN     developer.linkedin.com → create app → request
//                             "Community Management API" access → OAuth token
//                             with scopes r_organization_social,
//                             rw_organization_admin. Tokens last 60 days —
//                             LinkedIn offers programmatic refresh; until you
//                             wire that, re-paste every ~2 months.
//   LINKEDIN_ORGANIZATION_ID  Number in your page's admin URL:
//                             linkedin.com/company/XXXXXXX/admin
//
// ── RUN ────────────────────────────────────────────────────────────────────
//   Deploy:   npx supabase functions deploy sync-linkedin
//   Schedule: daily 06:30 (see INTEGRATIONS.md)
//
// NOTE: LinkedIn's REST versioning header changes monthly ("LinkedIn-Version").
// Bump the LI_VERSION constant if the API starts returning 426 errors.
// ============================================================================

import { upsertMetrics, touchLastSynced, daysAgo, json, guard } from '../_shared/metrics.ts';

const LI_VERSION = '202407'; // bump when LinkedIn deprecates (YYYYMM format)

Deno.serve(async (req) => {
  const g = guard(req, ['LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_ORGANIZATION_ID']);
  if (!g.ok) return g.res;
  const { LINKEDIN_ACCESS_TOKEN: TOKEN, LINKEDIN_ORGANIZATION_ID: ORG } = g.env;

  const date = new URL(req.url).searchParams.get('date') ?? daysAgo(1);
  const errors: string[] = [];

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'LinkedIn-Version': LI_VERSION,
    'X-Restli-Protocol-Version': '2.0.0',
  };
  const orgUrn = encodeURIComponent(`urn:li:organization:${ORG}`);
  const dayStartMs = Date.parse(`${date}T00:00:00Z`);
  const dayEndMs   = dayStartMs + 86_400_000;

  try {
    // ── 1. Page share statistics for the day ───────────────────────────────
    const stats = await fetch(
      `https://api.linkedin.com/rest/organizationalEntityShareStatistics` +
      `?q=organizationalEntity&organizationalEntity=${orgUrn}` +
      `&timeIntervals=(timeRange:(start:${dayStartMs},end:${dayEndMs}),timeGranularityType:DAY)`,
      { headers },
    ).then((x) => x.json());

    const s = stats.elements?.[0]?.totalShareStatistics ?? {};

    // ── 2. Follower count (lifetime snapshot) ──────────────────────────────
    const foll = await fetch(
      `https://api.linkedin.com/rest/networkSizes/${orgUrn}?edgeType=COMPANY_FOLLOWED_BY_MEMBER`,
      { headers },
    ).then((x) => x.json());

    await upsertMetrics([{
      metric_date: date,
      channel: 'linkedin',
      impressions: s.impressionCount ?? null,
      clicks:      s.clickCount ?? null,
      engagements: (s.likeCount ?? 0) + (s.commentCount ?? 0) + (s.shareCount ?? 0) || null,
      followers:   foll.firstDegreeSize ?? null,
    }]);
    await touchLastSynced('linkedin');
  } catch (e) { errors.push(String(e)); }

  return json({ configured: true, date, errors });
});
