// Supabase Edge Function — Create SteadFast Courier Shipment
// Called from admin.html so the SteadFast API key/secret never reach the browser.
// Verifies the caller is an authenticated admin before touching the courier API
// or the orders table.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL          = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY     = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // ── Verify caller is a logged-in admin ──────────────────────────────────
  const authHeader = req.headers.get('Authorization') || '';
  const callerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: userErr } = await callerClient.auth.getUser();
  if (userErr || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { data: isAdmin, error: adminErr } = await callerClient.rpc('is_admin');
  if (adminErr || !isAdmin) {
    return new Response('Forbidden — admin only', { status: 403 });
  }

  const STEADFAST_KEY    = Deno.env.get('STEADFAST_KEY');
  const STEADFAST_SECRET = Deno.env.get('STEADFAST_SECRET');
  if (!STEADFAST_KEY || !STEADFAST_SECRET) {
    console.error('Missing STEADFAST_KEY or STEADFAST_SECRET secrets');
    return new Response('Server misconfiguration', { status: 500 });
  }

  let body: { orderId?: string };
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }
  if (!body.orderId) {
    return new Response('Missing orderId', { status: 400 });
  }

  // ── Load the order server-side (never trust client-supplied order data) ──
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  const { data: order, error: orderErr } = await admin
    .from('orders')
    .select('id, order_number, customer_name, customer_phone, full_address, thana, district, total_amount, special_notes')
    .eq('id', body.orderId)
    .single();

  if (orderErr || !order) {
    return new Response('Order not found', { status: 404 });
  }

  const sfRes = await fetch('https://portal.steadfast.com.bd/api/v1/create_order', {
    method: 'POST',
    headers: {
      'Api-Key':      STEADFAST_KEY,
      'Secret-Key':   STEADFAST_SECRET,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      invoice:           order.order_number,
      recipient_name:    order.customer_name,
      recipient_phone:   order.customer_phone,
      recipient_address: `${order.full_address}, ${order.thana}, ${order.district}`,
      cod_amount:        order.total_amount,
      note:              order.special_notes || '',
    }),
  });

  if (!sfRes.ok) {
    const errText = await sfRes.text();
    console.error('SteadFast API error:', sfRes.status, errText);
    return new Response(JSON.stringify({ error: `SteadFast API error: ${sfRes.status}` }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sfData = await sfRes.json();
  const trackingCode = sfData?.consignment?.tracking_code || sfData?.tracking_code;
  if (!trackingCode) {
    console.error('No tracking code in SteadFast response:', JSON.stringify(sfData));
    return new Response(JSON.stringify({ error: 'No tracking code in response' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { error: updateErr } = await admin
    .from('orders')
    .update({ tracking_code: trackingCode })
    .eq('id', body.orderId);

  if (updateErr) {
    console.error('Failed to save tracking_code:', updateErr);
    return new Response(JSON.stringify({ error: 'Shipment created but failed to save tracking code' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, trackingCode }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
