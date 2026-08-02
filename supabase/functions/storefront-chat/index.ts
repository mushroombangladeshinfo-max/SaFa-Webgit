// Supabase Edge Function — Storefront AI Assistant
//
// The first function in this app called directly from a public,
// unauthenticated browser page (index.html/product.html). This is why it
// looks different from the admin AI tools (src/ai-client.js, used by
// home.html/insights.html): those read ai_settings.api_key straight into
// the browser, which is fine ONLY because is_admin() RLS keeps anonymous
// visitors from ever reaching that table. A storefront visitor is nobody
// — so the Groq key is read here with the service-role client and never
// leaves the server; the browser only ever gets back completion text.
//
// Two things a public, unauthenticated endpoint needs that an admin-only
// one doesn't: CORS (this is a genuine cross-origin call — the site is
// served from Cloudflare Pages, this function from *.supabase.co) and a
// rate limit (nothing else stops one visitor from hammering the shared
// Groq key's quota).

import { createClient } from 'jsr:@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

const MAX_MESSAGE_LEN = 500;
const MAX_HISTORY = 6;             // caps token cost/abuse per request
const RATE_LIMIT_WINDOW_MIN = 10;
const RATE_LIMIT_MAX = 12;         // requests per IP per window

// Fixed, brand-approved policy copy — same content as index.html's FAQ
// accordion. Unlike prices/stock (queried live below), this doesn't change
// day to day, so it's kept here directly rather than scraped from the page
// at request time. If the FAQ section on index.html changes, update this
// too — there's no single source of truth linking the two today.
const FAQ_CONTEXT = `
Delivery: Free delivery on orders ৳700+, otherwise a ৳100 charge. Courier charges may apply outside Dhaka, told at order time. 24-48 hours to Sirajganj/major Dhaka areas, 2-3 business days to other district towns. WhatsApp updates on order confirmation.
Returns: Mushroom is fresh, perishable food — please check on arrival. Wrong/damaged items: message WhatsApp immediately, they resolve it.
Organic claim: Indoor farm, no soil, no pests — so no pesticides are used at all. Temperature/humidity are controlled via IoT sensors, no chemicals.
Storage: Fresh mushroom keeps 3-5 days refrigerated — use a paper bag or open container, not plastic, so air can circulate. Dried mushroom keeps 6 months, powder up to 1 year.
Diabetes/health: Low glycemic index, doesn't spike blood sugar quickly. No cholesterol, has plant protein — a good option for heart/diabetes concerns. Always says: still follow your own doctor's advice.
Weight loss: 100-150g cooked per meal, at least 4 days a week, is the guidance given. Filling, low calorie.
Ordering: Every product has a "WhatsApp-এ অর্ডার করুন" (Order on WhatsApp) button — clicking starts a chat. Any website issue, message WhatsApp too.
B2B/bulk: Regular supply to restaurants, cafes, hotels, and other institutions. Special pricing and weekly schedules available for bulk orders — contact via WhatsApp or email.
`.trim();

const SYSTEM_PROMPT_HEADER = `You are the storefront assistant for SaFa Naturals, an organic mushroom farm and e-commerce brand in Bangladesh (currency: BDT ৳). You're embedded on the public website, talking to visitors and potential customers who are not logged in.

Ground rules:
- Answer ONLY using the information given to you below (current products/prices, and the FAQ policy content). Never invent a price, delivery time, product, or policy detail that isn't given here.
- For health-related questions, use ONLY the health information given in the FAQ context below, and always keep its doctor-consultation caveat. Never make a new health or medical claim beyond what's given — mushroom health claims are a real regulatory concern, not just a style preference.
- For anything you don't have real information for (exact current stock, order status, complaints, custom bulk quotes, anything specific to an individual's order), say so plainly and point them to WhatsApp — do not guess.
- SaFa Naturals is explicit on its own site that WhatsApp connects to a real person, not a bot ("একজন মানুষ জবাব দেবেন, বট নয়") — so never imply you ARE that human contact; you're a separate, faster first-line assistant for quick questions.
- Keep answers short and conversational, matching the visitor's language (Bengali or English).
- The WhatsApp contact is: https://wa.me/+8801970099378`;

async function buildSystemPrompt(sb: any): Promise<string> {
  const { data: products } = await sb
    .from('products')
    .select('name,name_bn,price,discount_price,unit,description,inventory_count')
    .eq('active', true);

  const productLines = (products || []).map((p: any) => {
    const price = p.discount_price && p.discount_price < p.price
      ? `৳${p.discount_price} (discounted from ৳${p.price})`
      : `৳${p.price}`;
    const stock = p.inventory_count != null ? `, inventory shows ${p.inventory_count} ${p.unit || 'unit'}(s) — treat as a general indicator, not a guarantee; suggest WhatsApp to confirm before a firm commitment` : '';
    return `- ${p.name}${p.name_bn ? ` (${p.name_bn})` : ''}: ${price} per ${p.unit || 'unit'}${stock}${p.description ? `. ${p.description}` : ''}`;
  }).join('\n') || 'No product data available right now.';

  return `${SYSTEM_PROMPT_HEADER}

Current products (live, queried at the time of this conversation):
${productLines}

FAQ / policy context:
${FAQ_CONTEXT}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON body' }, 400); }

  const messages = Array.isArray(body?.messages) ? body.messages : null;
  if (!messages || !messages.length) return json({ error: 'No message provided' }, 400);

  const last = messages[messages.length - 1];
  if (!last || typeof last.content !== 'string' || !last.content.trim()) {
    return json({ error: 'Empty message' }, 400);
  }
  if (last.content.length > MAX_MESSAGE_LEN) {
    return json({ error: `Message too long — please keep it under ${MAX_MESSAGE_LEN} characters.` }, 400);
  }

  const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Rate limit — IP-based, the only signal available for an endpoint with
  // no login. x-forwarded-for's first entry is the original client per
  // Cloudflare/Supabase's proxy chain.
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('cf-connecting-ip') || 'unknown';
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MIN * 60_000).toISOString();
  const { count } = await sb.from('storefront_chat_log')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip).gte('created_at', windowStart);
  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return json({ reply: null, error: 'Too many messages right now — please try again in a few minutes, or message us on WhatsApp: https://wa.me/+8801970099378' }, 429);
  }
  await sb.from('storefront_chat_log').insert({ ip });

  const { data: cfg } = await sb.from('ai_settings').select('url,model,api_key').eq('id', true).maybeSingle();
  if (!cfg?.api_key) {
    return json({ reply: null, error: 'The assistant isn\'t available right now — please message us on WhatsApp: https://wa.me/+8801970099378' });
  }

  const trimmedHistory = messages.slice(-MAX_HISTORY).map((m: any) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, MAX_MESSAGE_LEN),
  }));

  try {
    const systemPrompt = await buildSystemPrompt(sb);
    const res = await fetch(`${cfg.url}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.api_key}` },
      body: JSON.stringify({ model: cfg.model, messages: [{ role: 'system', content: systemPrompt }, ...trimmedHistory] }),
    });
    if (!res.ok) {
      console.error('storefront-chat provider error:', res.status, await res.text());
      return json({ reply: null, error: 'Something went wrong — please try again, or message us on WhatsApp: https://wa.me/+8801970099378' });
    }
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) return json({ reply: null, error: 'No response — please try again.' });
    return json({ reply });
  } catch (err) {
    console.error('storefront-chat threw:', err);
    return json({ reply: null, error: 'Something went wrong — please try again, or message us on WhatsApp: https://wa.me/+8801970099378' });
  }
});
