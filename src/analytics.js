/* ============================================================
   src/analytics.js
   SaFa Naturals — Google Analytics 4 Helper
   ─────────────────────────────────────────────────────────
   Add your GA4 Measurement ID to .env → VITE_GA_ID=G-XXXXXXXXXX
   All functions are no-ops if GA_ID is not set, so the site
   works correctly without analytics configured.

   Events tracked:
   - page_view      (automatic via GA4 config)
   - add_to_cart    (product grid + cart banner buttons)
   - view_item      (product detail page)
   - begin_checkout (checkout page load)
   - purchase       (after successful Supabase order insert)
============================================================ */

const GA_ID = import.meta.env.VITE_GA_ID;

/* Inject gtag.js once, only when ID is configured */
if (GA_ID) {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    send_page_view: true,
    currency: 'BDT',
  });
}

function push(name, params = {}) {
  if (typeof window.gtag === 'function') window.gtag('event', name, params);
}

/* ── Public helpers ── */

export function trackAddToCart(name, price, id, qty = 1) {
  push('add_to_cart', {
    currency: 'BDT',
    value:    price * qty,
    items: [{ item_id: id, item_name: name, price, quantity: qty, currency: 'BDT' }],
  });
}

export function trackViewItem(id, name, price) {
  push('view_item', {
    currency: 'BDT',
    value:    price || 0,
    items: [{ item_id: id, item_name: name, price: price || 0 }],
  });
}

export function trackBeginCheckout(total, cartItems) {
  push('begin_checkout', {
    currency: 'BDT',
    value:    total,
    items: cartItems.map(([id, item]) => ({
      item_id:  id,
      item_name: item.name,
      price:     item.price,
      quantity:  item.qty,
    })),
  });
}

export function trackPurchase(orderId, total, cartItems) {
  push('purchase', {
    transaction_id: orderId,
    currency:       'BDT',
    value:          total,
    items: cartItems.map(([id, item]) => ({
      item_id:   id,
      item_name: item.name,
      price:     item.price,
      quantity:  item.qty,
    })),
  });
}
