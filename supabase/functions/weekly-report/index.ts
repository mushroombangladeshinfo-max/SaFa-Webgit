// Supabase Edge Function — Weekly Farm Report
// Triggered by pg_cron every Friday 04:00 UTC (10:00 Dhaka) — see
// supabase/migrations/19_weekly_report.sql for the schedule.
//
// Summarizes the prior Saturday–Thursday (the standard Bangladesh business
// week) from v_kpi_daily: fresh harvest kg, farm sales, online sales, total
// sales, and total cost — then emails all admins (always) and best-effort
// WhatsApps both founders via CallMeBot (only once each founder's personal
// CALLMEBOT_KEY_* secret is set — until then this silently no-ops so it
// never blocks the email).

import { createClient } from 'jsr:@supabase/supabase-js@2';

const RESEND_API = 'https://api.resend.com/emails';
const FROM_NAME  = 'SaFa Naturals';
const FROM_EMAIL = 'onboarding@resend.dev';

// Same drift-risk caveat as the other hand-maintained admin-email copies
// (src/admin-auth.js, public.is_admin()) — update all of them together.
const ADMIN_EMAILS = [
  'mushroombangladesh.info@gmail.com',
  'quazishaab@gmail.com',
  'abrarfahim.nsu@gmail.com',
  'sunnymarjuk@gmail.com',
];

function fmt(n: number) {
  return '৳' + Math.round(n || 0).toLocaleString('en');
}

function dhakaTodayISO(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());
}
function addDays(iso: string, delta: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}
function displayDate(iso: string): string {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface Totals {
  harvestKg: number;
  farmRevenue: number;
  webRevenue: number;
  totalSales: number;
  totalCost: number;
  net: number;
}

function computeTotals(rows: any[]): Totals {
  const t: Totals = (rows || []).reduce((acc, row) => {
    acc.harvestKg   += Number(row.harvest_kg)    || 0;
    acc.farmRevenue += Number(row.farm_revenue)  || 0;
    acc.webRevenue  += Number(row.web_revenue)   || 0;
    acc.totalCost   += Number(row.farm_expenses) || 0;
    return acc;
  }, { harvestKg: 0, farmRevenue: 0, webRevenue: 0, totalSales: 0, totalCost: 0, net: 0 });
  t.totalSales = t.farmRevenue + t.webRevenue;
  t.net        = t.totalSales - t.totalCost;
  return t;
}

// AI takeaway paragraph — reads the same shared ai_settings row the admin
// tools use (src/ai-client.js), via this function's existing service-role
// client so RLS/is_admin() never comes into it and the key never reaches
// a browser. Compares this week against the prior week so the paragraph
// adds real synthesis instead of just restating numbers already in the
// table above it. Best-effort: any failure (no key configured, rate
// limited, provider down) just omits the section — never blocks the
// actual report, same resilience principle as the WhatsApp send below.
async function fetchAiCfg(sb: any): Promise<{ url: string; model: string; key: string } | null> {
  const { data } = await sb.from('ai_settings').select('url,model,api_key').eq('id', true).maybeSingle();
  if (!data || !data.api_key) return null;
  return { url: data.url, model: data.model, key: data.api_key };
}

async function generateWeeklyTakeaway(
  cfg: { url: string; model: string; key: string },
  startDate: string, endDate: string, t: Totals, prev: Totals | null,
): Promise<string | null> {
  const prevLine = prev
    ? `Prior week for comparison — Fresh Harvest: ${prev.harvestKg.toFixed(1)} kg, Total Sales: ${fmt(prev.totalSales)}, Total Cost: ${fmt(prev.totalCost)}, Net: ${fmt(prev.net)}.`
    : 'No prior-week data available for comparison.';
  const messages = [
    { role: 'system', content: 'You write a single short paragraph (2-3 sentences, no bullet points, no headers) summarizing a small organic mushroom farm\'s weekly business report for its two co-founders. Use ONLY the numbers given below — never invent figures, trends, or explanations not supported by the data. If nothing notable stands out, it\'s fine to say the week was steady. Be specific with the actual numbers, not vague. Currency is BDT (৳).' },
    { role: 'user', content: `Week: ${displayDate(startDate)} – ${displayDate(endDate)}\nFresh Harvest: ${t.harvestKg.toFixed(1)} kg\nFarm Sales: ${fmt(t.farmRevenue)}\nOnline Sales: ${fmt(t.webRevenue)}\nTotal Sales: ${fmt(t.totalSales)}\nTotal Cost: ${fmt(t.totalCost)}\nNet: ${fmt(t.net)}\n\n${prevLine}` },
  ];
  const res = await fetch(`${cfg.url}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` },
    body: JSON.stringify({ model: cfg.model, messages }),
  });
  if (!res.ok) {
    console.error('AI weekly takeaway failed:', res.status, await res.text());
    return null;
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() || null;
}

function buildEmailHtml(startDate: string, endDate: string, t: Totals, aiTakeaway: string | null): string {
  const row = (label: string, value: string, color = '#0a1a0f', big = false) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#666;">${label}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f0ebe3;font-size:${big ? 20 : 16}px;font-weight:700;color:${color};text-align:right;">${value}</td>
    </tr>`;
  // Visually distinct from the numbers table (different background) so
  // it reads clearly as AI commentary, not another measured figure.
  const takeawayBlock = aiTakeaway ? `
        <tr><td style="background:#f7f0dc;padding:20px 40px;">
          <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#a67f2e;font-weight:700;margin-bottom:8px;">✦ This Week's Take</div>
          <div style="font-size:14px;line-height:1.6;color:#3a3226;">${aiTakeaway}</div>
        </td></tr>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Weekly Report — SaFa Naturals</title></head>
<body style="margin:0;padding:0;background:#f7f3ee;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ee;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr><td style="background:#0a1a0f;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
          <div style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#f5efe6;letter-spacing:1px;">SaFa Naturals</div>
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c49a3c;margin-top:6px;">Weekly Report</div>
        </td></tr>

        <tr><td style="background:#c49a3c;padding:14px 40px;text-align:center;">
          <div style="font-size:14px;font-weight:700;color:#0a1a0f;letter-spacing:0.5px;">${displayDate(startDate)} – ${displayDate(endDate)}</div>
        </td></tr>

        <tr><td style="background:#ffffff;padding:36px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row('🌱 Fresh Harvest', t.harvestKg.toFixed(1) + ' kg')}
            ${row('💰 Farm Sales', fmt(t.farmRevenue))}
            ${row('🛒 Online Sales', fmt(t.webRevenue))}
            ${row('📈 Total Sales', fmt(t.totalSales), '#c49a3c', true)}
            ${row('💸 Total Cost', fmt(t.totalCost))}
            ${row('✅ Net', fmt(t.net), t.net >= 0 ? '#2d6a3e' : '#b23b3b', true)}
          </table>
        </td></tr>
        ${takeawayBlock}
        <tr><td style="background:#f0ebe3;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
          <p style="font-size:12px;color:#999;margin:0;line-height:1.8;">
            SaFa Naturals Agrotech Farm · Alompur, Sirajganj, Bangladesh<br>
            Auto-generated every Friday from farm daily logs + online orders.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendEmail(startDate: string, endDate: string, t: Totals, aiTakeaway: string | null): Promise<{ ok: boolean; detail: unknown }> {
  const RESEND_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_KEY) return { ok: false, detail: 'Missing RESEND_API_KEY secret' };

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from:    `${FROM_NAME} <${FROM_EMAIL}>`,
      to:      ADMIN_EMAILS,
      subject: `Weekly Report: ${displayDate(startDate)} – ${displayDate(endDate)} · SaFa Naturals 🍄`,
      html:    buildEmailHtml(startDate, endDate, t, aiTakeaway),
    }),
  });
  const result = await res.json();
  if (!res.ok) console.error('Resend error:', JSON.stringify(result));
  return { ok: res.ok, detail: result };
}

function buildWaMessage(startDate: string, endDate: string, t: Totals, aiTakeaway: string | null): string {
  const lines = [
    `📊 SaFa Naturals — Weekly Report`,
    `${displayDate(startDate)} – ${displayDate(endDate)}`,
    '─────────────────────',
    `🌱 Fresh Harvest: ${t.harvestKg.toFixed(1)} kg`,
    `💰 Farm Sales: ${fmt(t.farmRevenue)}`,
    `🛒 Online Sales: ${fmt(t.webRevenue)}`,
    `📈 Total Sales: ${fmt(t.totalSales)}`,
    `💸 Total Cost: ${fmt(t.totalCost)}`,
    `✅ Net: ${fmt(t.net)}`,
  ];
  if (aiTakeaway) lines.push('─────────────────────', `✦ ${aiTakeaway}`);
  return lines.join('\n');
}

// Best-effort — swallows failures (e.g. a recipient hasn't activated their
// CallMeBot key yet) so a WhatsApp problem never blocks the email, which is
// the channel that actually works today.
//
// Uses CallMeBot (api.callmebot.com) instead of Meta's WhatsApp Business
// Cloud API — same free relay service checkout.html already wires up for
// seller order alerts (currently dormant there too, blank key). No Meta
// Business verification, no message-template approval, plain free-form
// text — just a personal API key per recipient, each obtained by that
// person messaging CallMeBot's own WhatsApp number once. Each key only
// works to message the phone number that generated it, so each founder
// needs their own secret.
const CALLMEBOT_RECIPIENTS = [
  { phone: '8801970099378', keyEnv: 'CALLMEBOT_KEY_FAHIM' },
  { phone: '8801681884371', keyEnv: 'CALLMEBOT_KEY_SUNNY' },
];

async function sendWhatsApp(startDate: string, endDate: string, t: Totals, aiTakeaway: string | null): Promise<{ ok: boolean; detail: unknown }[]> {
  const msg = buildWaMessage(startDate, endDate, t, aiTakeaway);
  const results = [];

  for (const { phone, keyEnv } of CALLMEBOT_RECIPIENTS) {
    const apiKey = Deno.env.get(keyEnv);
    if (!apiKey) {
      console.log(`WhatsApp skipped for ${phone}: ${keyEnv} not configured yet`);
      results.push({ ok: false, detail: `${keyEnv} not configured` });
      continue;
    }
    try {
      const res = await fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(msg)}&apikey=${apiKey}`);
      const detail = await res.text();
      if (!res.ok) console.error(`CallMeBot error for ${phone}:`, detail);
      results.push({ ok: res.ok, detail });
    } catch (err) {
      console.error(`CallMeBot send threw for ${phone}:`, err);
      results.push({ ok: false, detail: String(err) });
    }
  }
  return results;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  // Same webhook-secret pattern as order-confirmation-email — set once in
  // Vault as 'order_webhook_secret', reused here rather than provisioning
  // a second secret for the same purpose.
  const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET');
  if (WEBHOOK_SECRET && req.headers.get('x-webhook-secret') !== WEBHOOK_SECRET) {
    console.error('Rejected: bad or missing x-webhook-secret header');
    return new Response('Unauthorized', { status: 401 });
  }

  const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const today     = dhakaTodayISO();
  const endDate   = addDays(today, -1);   // Thursday
  const startDate = addDays(endDate, -5); // Saturday

  const { data, error } = await sb
    .from('v_kpi_daily')
    .select('harvest_kg,farm_revenue,web_revenue,farm_expenses')
    .gte('day', startDate)
    .lte('day', endDate);

  if (error) {
    console.error('v_kpi_daily query failed:', error);
    return new Response(JSON.stringify({ error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  const t: Totals = computeTotals(data || []);

  // Prior week (the 6 days immediately before startDate), for the AI
  // takeaway's comparison — best-effort, a failed/empty fetch just means
  // no comparison is offered, never blocks the report itself.
  const prevEnd   = addDays(startDate, -1);
  const prevStart = addDays(prevEnd, -6);
  const { data: prevData } = await sb
    .from('v_kpi_daily')
    .select('harvest_kg,farm_revenue,web_revenue,farm_expenses')
    .gte('day', prevStart)
    .lte('day', prevEnd);
  const prevT: Totals | null = prevData && prevData.length ? computeTotals(prevData) : null;

  let aiTakeaway: string | null = null;
  try {
    const aiCfg = await fetchAiCfg(sb);
    if (aiCfg) aiTakeaway = await generateWeeklyTakeaway(aiCfg, startDate, endDate, t, prevT);
  } catch (e) {
    console.error('AI weekly takeaway threw:', e);
  }

  const emailResult = await sendEmail(startDate, endDate, t, aiTakeaway);
  const waResults    = await sendWhatsApp(startDate, endDate, t, aiTakeaway);

  console.log(`Weekly report ${startDate}..${endDate}: harvest=${t.harvestKg}kg sales=${t.totalSales} cost=${t.totalCost} — email ${emailResult.ok ? 'sent' : 'FAILED'}, whatsapp ${waResults.filter(r => r.ok).length}/${waResults.length} sent, ai_takeaway ${aiTakeaway ? 'included' : 'omitted'}`);

  return new Response(JSON.stringify({ startDate, endDate, totals: t, aiTakeaway, email: emailResult, whatsapp: waResults }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
