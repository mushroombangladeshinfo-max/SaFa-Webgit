// Supabase Edge Function — Order Confirmation Email
// Triggered by Supabase Database Webhook on INSERT to orders table
// Uses Resend (resend.com) — free tier: 3000 emails/month

const RESEND_API = 'https://api.resend.com/emails';
const FROM_NAME  = 'SaFa Naturals';
const FROM_EMAIL = 'orders@safanaturals.org'; // must be verified in Resend

interface OrderItem { name: string; qty: number; price: number; }

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount_amount?: number;
  coupon_code?: string;
  total_amount: number;
  full_address: string;
  thana: string;
  district: string;
  special_notes?: string;
  created_at: string;
}

function fmt(n: number) {
  return '৳' + (n || 0).toLocaleString('en');
}

function buildEmailHtml(o: Order): string {
  const itemRows = (o.items || []).map(i => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#333;">${i.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#666;text-align:center;">×${i.qty}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#333;text-align:right;">${fmt((i.price||0)*(i.qty||0))}</td>
    </tr>`).join('');

  const deliveryRow = o.delivery_fee === 0
    ? `<tr><td style="font-size:13px;color:#5a7a62;padding:4px 0;">Delivery</td><td></td><td style="font-size:13px;color:#5a7a62;text-align:right;padding:4px 0;">FREE</td></tr>`
    : `<tr><td style="font-size:13px;color:#666;padding:4px 0;">Delivery</td><td></td><td style="font-size:13px;color:#666;text-align:right;padding:4px 0;">${fmt(o.delivery_fee)}</td></tr>`;

  const discountRow = (o.discount_amount && o.discount_amount > 0) ? `
    <tr>
      <td style="font-size:13px;color:#5a7a62;padding:4px 0;">Discount${o.coupon_code ? ` (${o.coupon_code})` : ''}</td>
      <td></td>
      <td style="font-size:13px;color:#5a7a62;text-align:right;padding:4px 0;">- ${fmt(o.discount_amount)}</td>
    </tr>` : '';

  const address = [o.full_address, o.thana, o.district].filter(Boolean).join(', ');
  const orderDate = new Date(o.created_at).toLocaleString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Order Confirmed — SaFa Naturals</title></head>
<body style="margin:0;padding:0;background:#f7f3ee;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ee;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#0a1a0f;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
          <div style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#f5efe6;letter-spacing:1px;">SaFa Naturals</div>
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c49a3c;margin-top:6px;">Organic Mushroom Farm · Sirajganj</div>
        </td></tr>

        <!-- Order confirmed banner -->
        <tr><td style="background:#c49a3c;padding:16px 40px;text-align:center;">
          <div style="font-size:16px;font-weight:700;color:#0a1a0f;letter-spacing:1px;">✓ ORDER CONFIRMED</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px 40px;">

          <p style="font-size:16px;color:#333;margin:0 0 8px;">Hello <strong>${o.customer_name}</strong>,</p>
          <p style="font-size:14px;color:#666;margin:0 0 28px;line-height:1.6;">
            Thank you for your order! We've confirmed it and will pack it fresh from the farm.
            Expect delivery within <strong>24–48 hours</strong>. Cash on delivery — no payment needed now.
          </p>

          <!-- Order meta -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ee;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
            <tr>
              <td style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Order Number</td>
              <td style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Date</td>
            </tr>
            <tr>
              <td style="font-size:20px;font-weight:700;color:#0a1a0f;padding-top:4px;">#${o.order_number}</td>
              <td style="font-size:13px;color:#555;padding-top:4px;">${orderDate}</td>
            </tr>
          </table>

          <!-- Items -->
          <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Your Order</div>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemRows}
            <tr><td colspan="3" style="padding-top:12px;"></td></tr>
            ${discountRow}
            ${deliveryRow}
            <tr>
              <td colspan="3" style="border-top:2px solid #0a1a0f;padding-top:12px;"></td>
            </tr>
            <tr>
              <td style="font-size:16px;font-weight:700;color:#0a1a0f;padding-bottom:4px;">Total</td>
              <td></td>
              <td style="font-size:20px;font-weight:700;color:#c49a3c;text-align:right;">${fmt(o.total_amount)}</td>
            </tr>
            <tr>
              <td colspan="3" style="font-size:12px;color:#5a7a62;padding-top:4px;">💵 Cash on Delivery — pay when you receive</td>
            </tr>
          </table>

          <!-- Delivery address -->
          <div style="margin-top:28px;padding:16px 20px;border:1px solid #e8e0d5;border-radius:8px;">
            <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Delivering To</div>
            <div style="font-size:14px;color:#333;line-height:1.6;">${address}</div>
            <div style="font-size:13px;color:#666;margin-top:4px;">📞 ${o.customer_phone}</div>
            ${o.special_notes ? `<div style="font-size:12px;color:#888;margin-top:8px;font-style:italic;">Note: ${o.special_notes}</div>` : ''}
          </div>

          <!-- Track CTA -->
          <div style="text-align:center;margin-top:32px;">
            <a href="https://safanaturals.org/track.html"
               style="display:inline-block;background:#0a1a0f;color:#f5efe6;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
              Track Your Order
            </a>
          </div>

          <p style="font-size:13px;color:#888;text-align:center;margin-top:24px;line-height:1.6;">
            Questions? WhatsApp us at
            <a href="https://wa.me/8801970099378" style="color:#c49a3c;text-decoration:none;">+880 1970 099378</a>
          </p>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f0ebe3;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
          <p style="font-size:12px;color:#999;margin:0;line-height:1.8;">
            SaFa Naturals Agrotech Farm · Alompur, Sirajganj, Bangladesh<br>
            100% Organic · Zero Pesticides · Farm to Doorstep
          </p>
          <p style="font-size:11px;color:#bbb;margin:8px 0 0;">
            © 2026 SaFa Naturals · <a href="https://safanaturals.org" style="color:#bbb;">safanaturals.org</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const RESEND_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_KEY) {
    console.error('Missing RESEND_API_KEY secret');
    return new Response('Server misconfiguration', { status: 500 });
  }

  let body: { record: Order };
  try { body = await req.json(); }
  catch { return new Response('Invalid JSON', { status: 400 }); }

  const order = body.record;

  // Only send if customer provided an email
  if (!order?.customer_email) {
    console.log(`Order #${order?.order_number} — no customer email, skipping`);
    return new Response(JSON.stringify({ skipped: 'no email' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const html = buildEmailHtml(order);

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:    `${FROM_NAME} <${FROM_EMAIL}>`,
      to:      [order.customer_email],
      subject: `Order #${order.order_number} Confirmed — SaFa Naturals 🍄`,
      html,
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    console.error('Resend error:', JSON.stringify(result));
    return new Response(JSON.stringify({ error: result }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log(`Email sent to ${order.customer_email} for order #${order.order_number}`);
  return new Response(JSON.stringify({ success: true, id: result.id }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
