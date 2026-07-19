// ============================================================================
// sync-whatsapp — WhatsApp Business conversation analytics → marketing_metrics
// ============================================================================
// Pulls YESTERDAY's conversation counts from the WhatsApp Cloud API into
// channel='whatsapp'. Conversations map to the `leads` column — for SaFa,
// a WhatsApp conversation IS a lead, so this feeds straight into the
// funnel view on the Insights dashboard.
//
// ── SECRETS TO SET ─────────────────────────────────────────────────────────
//   WA_ACCESS_TOKEN  ← you already have this (order notifications use it)
//   WA_WABA_ID       WhatsApp Business Account ID:
//                    developers.facebook.com → your app → WhatsApp →
//                    API Setup → "WhatsApp Business Account ID"
//                    (NOT the phone number ID — the WABA is one level up)
//
// ── RUN ────────────────────────────────────────────────────────────────────
//   Deploy:   npx supabase functions deploy sync-whatsapp
//   Schedule: daily 06:40 (see INTEGRATIONS.md)
// ============================================================================

import { upsertMetrics, touchLastSynced, daysAgo, json, guard } from '../_shared/metrics.ts';

const GRAPH = 'https://graph.facebook.com/v20.0';

Deno.serve(async (req) => {
  const g = guard(req, ['WA_ACCESS_TOKEN', 'WA_WABA_ID']);
  if (!g.ok) return g.res;
  const { WA_ACCESS_TOKEN: TOKEN, WA_WABA_ID: WABA } = g.env;

  const date = new URL(req.url).searchParams.get('date') ?? daysAgo(1);
  const errors: string[] = [];

  // Unix seconds for the day's bounds (conversation_analytics requires them).
  const start = Math.floor(Date.parse(`${date}T00:00:00Z`) / 1000);
  const end   = start + 86_400;

  try {
    const r = await fetch(
      `${GRAPH}/${WABA}?fields=conversation_analytics` +
      `.start(${start}).end(${end}).granularity(DAILY)` +
      `.dimensions(["CONVERSATION_CATEGORY"])&access_token=${TOKEN}`,
    ).then((x) => x.json());

    // Shape: { conversation_analytics: { data: [ { data_points: [
    //   { conversation, cost, conversation_category }, ... ] } ] } }
    const points = r.conversation_analytics?.data?.[0]?.data_points ?? [];

    let conversations = 0;
    let cost = 0;
    for (const p of points) {
      conversations += p.conversation ?? 0;
      cost          += p.cost ?? 0; // Meta bills per conversation (USD)
    }

    await upsertMetrics([{
      metric_date: date,
      channel: 'whatsapp',
      leads: conversations || null,
      // Conversation cost is in USD — recorded in notes, not mixed into BDT spend.
      notes: cost ? `conversation_cost_usd=${cost.toFixed(4)}` : undefined,
    }]);
    await touchLastSynced('whatsapp');
  } catch (e) { errors.push(String(e)); }

  return json({ configured: true, date, errors });
});
