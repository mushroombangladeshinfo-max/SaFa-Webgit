// Supabase Edge Function — WhatsApp Order Notification
// Triggered by Supabase Database Webhook on INSERT to orders table
// Sends a WhatsApp template message to the customer

const WA_API_URL = 'https://graph.facebook.com/v20.0';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  items: { name: string; qty: number; price: number }[];
  total_amount: number;
  full_address: string;
  thana: string;
  district: string;
}

function formatPhone(phone: string): string {
  // Ensure Bangladesh number is in international format for WhatsApp API
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('880')) return digits;
  if (digits.startsWith('0'))   return '880' + digits.slice(1);
  if (digits.startsWith('1') && digits.length === 10) return '880' + digits;
  return digits;
}

Deno.serve(async (req) => {
  // Supabase sends a POST with the record in the body
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const WA_ACCESS_TOKEN    = Deno.env.get('WA_ACCESS_TOKEN');
  const WA_PHONE_NUMBER_ID = Deno.env.get('WA_PHONE_NUMBER_ID');

  if (!WA_ACCESS_TOKEN || !WA_PHONE_NUMBER_ID) {
    console.error('Missing WA_ACCESS_TOKEN or WA_PHONE_NUMBER_ID secrets');
    return new Response('Server misconfiguration', { status: 500 });
  }

  let body: { record: Order };
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const order = body.record;
  if (!order?.customer_phone) {
    return new Response('No customer_phone in order', { status: 400 });
  }

  // Build template variable values
  const customerName  = order.customer_name || 'Customer';
  const orderNumber   = order.order_number  || order.id.slice(0, 8);
  const itemsSummary  = (order.items || [])
    .map(i => `${i.name} ×${i.qty}`)
    .join(', ') || 'Your items';
  const total         = (order.total_amount || 0).toLocaleString('en');
  const address       = [order.full_address, order.thana, order.district]
    .filter(Boolean).join(', ');

  const waPayload = {
    messaging_product: 'whatsapp',
    to: formatPhone(order.customer_phone),
    type: 'template',
    template: {
      name: 'order_confirmed',
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: customerName },
            { type: 'text', text: orderNumber  },
            { type: 'text', text: itemsSummary },
            { type: 'text', text: total        },
            { type: 'text', text: address      },
          ],
        },
      ],
    },
  };

  const res = await fetch(`${WA_API_URL}/${WA_PHONE_NUMBER_ID}/messages`, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${WA_ACCESS_TOKEN}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(waPayload),
  });

  const result = await res.json();

  if (!res.ok) {
    console.error('WhatsApp API error:', JSON.stringify(result));
    return new Response(JSON.stringify({ error: result }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log(`WhatsApp sent to ${order.customer_phone} for order #${orderNumber}`);
  return new Response(JSON.stringify({ success: true, result }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
