// ============================================================================
// sync-ga4 — Google Analytics 4 (website) → marketing_metrics
// ============================================================================
// Pulls YESTERDAY's site-wide numbers from the GA4 Data API and upserts one
// row with channel='website'.
//
// Auth: GA4's Data API has no simple "API key" option — it requires OAuth2.
// Rather than a user OAuth flow, this uses a Service Account: we sign our own
// short-lived JWT with the service account's private key (RS256, via Deno's
// native Web Crypto) and exchange it for an access token. No client library
// needed, no user interaction needed on every run.
//
// ── SECRETS TO SET (Dashboard → Edge Functions → Secrets) ──────────────────
//   GA4_CLIENT_EMAIL   From the downloaded service-account JSON key file
//   GA4_PRIVATE_KEY     From the same file — the full "-----BEGIN PRIVATE
//                       KEY-----...-----END PRIVATE KEY-----" block,
//                       including the \n line breaks
//   GA4_PROPERTY_ID     GA4 Admin → Property Settings → Property ID (digits
//                       only, NOT the G-XXXXXXXXXX Measurement ID)
//
// Grant this service account "Viewer" (or broader) access under
// GA4 Admin → Property Access Management before this will work.
//
// ── RUN ────────────────────────────────────────────────────────────────────
//   Deploy:   npx supabase functions deploy sync-ga4
//   Test:     curl -X POST https://<ref>.supabase.co/functions/v1/sync-ga4 \
//                  -H "Authorization: Bearer <anon-key>"
//   Backfill: .../sync-ga4?date=2026-07-01
// ============================================================================

import {
  upsertMetrics, upsertSectionEngagement, upsertScrollDepth,
  touchLastSynced, daysAgo, json, guard,
  type MetricRow, type SectionEngagementRow, type ScrollDepthRow,
} from '../_shared/metrics.ts';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DATA_API  = 'https://analyticsdata.googleapis.com/v1beta';

function base64url(bytes: Uint8Array | string): string {
  const b64 = typeof bytes === 'string' ? btoa(bytes) : btoa(String.fromCharCode(...bytes));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Sign a short-lived JWT with the service account's private key and trade
 *  it for a Google OAuth2 access token (grant type: jwt-bearer). */
async function getAccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header  = { alg: 'RS256', typ: 'JWT' };
  const claims  = {
    iss:   clientEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud:   TOKEN_URL,
    exp:   now + 3600,
    iat:   now,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;

  const pem = privateKeyPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    'pkcs8',
    der.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsigned),
  );
  const jwt = `${unsigned}.${base64url(new Uint8Array(sig))}`;

  const res = await fetch(TOKEN_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion:  jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Google OAuth token exchange failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

/** Run a GA4 Data API report and return its raw rows (dimension values + metric values, as strings). */
async function runReport(
  accessToken: string,
  propertyId: string,
  body: Record<string, unknown>,
): Promise<{ dims: string[]; metrics: string[] }[]> {
  const r = await fetch(`${DATA_API}/properties/${propertyId}:runReport`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((x) => x.json());

  if (r.error) throw new Error(`GA4 Data API error: ${JSON.stringify(r.error)}`);

  return (r.rows ?? []).map((row: { dimensionValues?: { value: string }[]; metricValues: { value: string }[] }) => ({
    dims:    (row.dimensionValues ?? []).map((d) => d.value),
    metrics: row.metricValues.map((m) => m.value),
  }));
}

Deno.serve(async (req) => {
  const g = guard(req, ['GA4_CLIENT_EMAIL', 'GA4_PRIVATE_KEY', 'GA4_PROPERTY_ID']);
  if (!g.ok) return g.res;
  const { GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY, GA4_PROPERTY_ID } = g.env;

  const date = new URL(req.url).searchParams.get('date') ?? daysAgo(1);
  const errors: string[] = [];
  let row: MetricRow | null = null;
  let sectionRows: SectionEngagementRow[] = [];
  let scrollRows: ScrollDepthRow[] = [];

  let accessToken: string;
  try {
    accessToken = await getAccessToken(GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY.replace(/\\n/g, '\n'));
  } catch (e) {
    errors.push(`ga4 auth: ${e}`);
    return json({ configured: true, date, rows_written: 0, errors });
  }

  try {
    const [siteTotals] = await runReport(accessToken, GA4_PROPERTY_ID, {
      dateRanges: [{ startDate: date, endDate: date }],
      metrics: [
        { name: 'totalUsers' },        // → reach
        { name: 'sessions' },
        { name: 'engagedSessions' },    // → engagements
        { name: 'screenPageViews' },    // → impressions (closest GA4 equivalent)
        { name: 'conversions' },
        { name: 'totalRevenue' },       // → revenue_attr
      ],
    }).then((rows) => rows.map((r) => r.metrics.map(Number)));

    const [totalUsers, sessions, engagedSessions, pageViews, conversions, revenue] = siteTotals ?? [];

    row = {
      metric_date:  date,
      channel:      'website',
      reach:        totalUsers ?? null,
      clicks:       sessions ?? null,
      engagements:  engagedSessions ?? null,
      impressions:  pageViews ?? null,
      conversions:  conversions ?? null,
      revenue_attr: revenue ?? null,
    };
  } catch (e) { errors.push(`ga4 site totals: ${e}`); }

  // ── Section engagement: which on-page sections people actually see ──────
  // Needs "Section Name" custom dimension registered in GA4 Admin →
  // Custom definitions, mapped to the section_view event's section_name
  // parameter (src/analytics.js fires this via IntersectionObserver).
  try {
    const sectionData = await runReport(accessToken, GA4_PROPERTY_ID, {
      dateRanges: [{ startDate: date, endDate: date }],
      dimensions: [{ name: 'pagePath' }, { name: 'customEvent:section_name' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: { fieldName: 'eventName', stringFilter: { value: 'section_view' } },
      },
      limit: 1000,
    });
    sectionRows = sectionData
      .filter((r) => r.dims[1])
      .map((r) => ({
        metric_date:  date,
        page_path:    r.dims[0] || '/',
        section_name: r.dims[1],
        views:        Number(r.metrics[0]) || 0,
      }));
    await upsertSectionEngagement(sectionRows);
  } catch (e) { errors.push(`ga4 section engagement: ${e}`); }

  // ── Scroll depth: how far down the page people get before leaving ──────
  // Needs "Scroll Percent" custom dimension registered the same way, mapped
  // to scroll_depth's percent_scrolled parameter.
  try {
    const scrollData = await runReport(accessToken, GA4_PROPERTY_ID, {
      dateRanges: [{ startDate: date, endDate: date }],
      dimensions: [{ name: 'pagePath' }, { name: 'customEvent:percent_scrolled' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: { fieldName: 'eventName', stringFilter: { value: 'scroll_depth' } },
      },
      limit: 1000,
    });
    scrollRows = scrollData
      .filter((r) => [25, 50, 75, 90].includes(Number(r.dims[1])))
      .map((r) => ({
        metric_date:      date,
        page_path:        r.dims[0] || '/',
        percent_scrolled: Number(r.dims[1]) as 25 | 50 | 75 | 90,
        sessions:         Number(r.metrics[0]) || 0,
      }));
    await upsertScrollDepth(scrollRows);
  } catch (e) { errors.push(`ga4 scroll depth: ${e}`); }

  const rows = row ? [row] : [];
  await upsertMetrics(rows);
  await touchLastSynced('website');

  return json({
    configured: true,
    date,
    rows_written: rows.length,
    section_engagement_rows: sectionRows.length,
    scroll_depth_rows: scrollRows.length,
    errors,
  });
});
