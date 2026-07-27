/* ============================================================
   src/products.js
   SaFa Naturals — Live Product Price Sync
   ─────────────────────────────────────────
   Fetches active products from Supabase and updates price
   elements on any page that has product cards with data-id.
   Call syncProductPrices() once on DOMContentLoaded.
============================================================ */

import { supabase } from './supabase.js';

/**
 * Fetches live prices from Supabase and patches price elements
 * on index.html product cards. Falls back silently on error.
 */
export async function syncProductPrices() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, price, discount_price, active, inventory_count')
      .eq('active', true);

    if (error || !data?.length) return;

    data.forEach(p => {
      const card = document.querySelector(`.pl-card[data-id="${p.id}"]`);
      if (!card) return;

      const priceEl = card.querySelector('.pl-price');
      const cartBtn = card.querySelector('.add-to-cart-btn');
      const stockEl = card.querySelector('.pl-stock');

      /* Effective price customers pay */
      const effectivePrice = p.discount_price || p.price;

      /* Fade price/stock out before patching, then back in — a silent
         mid-glance text swap (e.g. ৳350 → ৳299, "In Stock" → "Out of
         Stock") reads as a bait-and-switch on a COD site where trust is
         the whole value prop. This makes the change read as "refreshing." */
      const fadeSwap = (el, apply) => {
        if (!el) return;
        el.classList.add('price-syncing');
        setTimeout(() => {
          apply();
          el.classList.remove('price-syncing');
        }, 200);
      };

      /* Update price display */
      if (priceEl && p.price) {
        fadeSwap(priceEl, () => {
          if (p.discount_price) {
            priceEl.innerHTML =
              `<s class="pl-price-orig">৳${p.price}</s> <span class="pl-price-disc">৳${p.discount_price}</span>`;
          } else {
            priceEl.textContent = `${p.price} ৳`;
          }
        });
      }

      /* Update add-to-cart button's effective price */
      if (cartBtn && effectivePrice) {
        cartBtn.dataset.price = effectivePrice;
      }

      /* Reflect stock status */
      if (stockEl && p.inventory_count !== undefined) {
        if (p.inventory_count === 0) {
          fadeSwap(stockEl, () => {
            stockEl.textContent = 'Out of Stock';
            stockEl.style.color = '#e05a2b';
            if (cartBtn) { cartBtn.disabled = true; cartBtn.textContent = 'Out of Stock'; }
          });
        } else if (p.inventory_count <= 10) {
          fadeSwap(stockEl, () => { stockEl.textContent = 'Limited Stock'; });
        }
      }
    });

  } catch { /* silent fail — page works fine with static prices */ }
}
