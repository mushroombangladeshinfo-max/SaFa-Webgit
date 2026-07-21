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

const GA_ID       = import.meta.env.VITE_GA_ID;
const CLARITY_ID  = import.meta.env.VITE_CLARITY_ID;

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

/* Inject Microsoft Clarity (heatmaps + session recordings), only when ID is configured */
if (CLARITY_ID) {
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);
}

function push(name, params = {}) {
  if (typeof window.gtag === 'function') window.gtag('event', name, params);
}

/* ── Scroll depth: fires once per threshold, per page load ── */
if (GA_ID) {
  const thresholds = [25, 50, 75, 90];
  const fired = new Set();
  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = Math.round((scrollTop / docHeight) * 100);
    thresholds.forEach(t => {
      if (pct >= t && !fired.has(t)) {
        fired.add(t);
        push('scroll_depth', { percent_scrolled: t, page_path: location.pathname });
      }
    });
    if (fired.size === thresholds.length) window.removeEventListener('scroll', onScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Section visibility: fires once per section, per page load.
   Add data-section-name="..." to any element you want tracked. ── */
if (GA_ID && typeof IntersectionObserver !== 'undefined') {
  const sections = document.querySelectorAll('[data-section-name]');
  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          push('section_view', { section_name: entry.target.dataset.sectionName });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(el => observer.observe(el));
  }
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
