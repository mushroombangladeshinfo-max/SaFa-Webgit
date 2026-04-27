/* ============================================================
   src/ui.js
   SaFa Naturals — Cart UI & Checkout Rendering
   ─────────────────────────────────────────────────────────
   All DOM-touching functions live here.
   No direct localStorage access — uses cart.js for data.

   Sections:
   1. CART DRAWER        — render, open, close, toggle
   2. COUPON             — validate and apply codes
   3. CART INJECTION     — auto-inject drawer if not in HTML
   4. CHECKOUT RENDER    — order items, totals, qty controls
   5. ADD-TO-CART WIRING — data-attribute button wiring

   Imported by: main.js
============================================================ */

import {
  FREE_SHIPPING_THRESHOLD,
  DELIVERY_FEE,
  CART_DRAWER_HTML,
  VALID_COUPONS,
  COUPON_STORAGE_KEY,
} from './config.js';

import {
  getCart,
  saveCart,
  addToCart,
  updateQuantity,
} from './cart.js';


/* ============================================================
   1. CART DRAWER
============================================================ */

/**
 * Rebuilds the cart drawer contents from current cart state.
 * Called after every cart mutation (add, remove, update).
 */
export function renderCartDrawer() {
  const container = document.querySelector('.cart-items-container');
  const subtotalEl = document.querySelector('.cart-subtotal span:last-child');
  if (!container) return;

  const cart  = getCart();
  const items = Object.entries(cart);

  /* ── Empty state ── */
  if (!items.length) {
    container.innerHTML = `
      <div class="cart-empty-state"
           style="text-align:center;padding:60px 20px;opacity:0.6;">
        <p style="font-size:32px;margin-bottom:12px;">🛒</p>
        <p style="font-size:13px;letter-spacing:0.06em;
                  font-family:'Syne',sans-serif;text-transform:uppercase;">
          Your cart is empty
        </p>
        <p style="font-size:11px;margin-top:6px;opacity:0.6;">
          Add mushrooms to get started
        </p>
      </div>`;
    if (subtotalEl) subtotalEl.textContent = '0 ৳';
    return;
  }

  let total    = 0;
  let itemsHTML = '';

  /* ── Item rows ── */
  items.forEach(([id, item]) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    itemsHTML += `
      <div class="cart-item" style="
        display:flex;justify-content:space-between;align-items:center;
        padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
        <div style="flex:1;min-width:0;">
          <div style="font-size:14px;font-weight:500;color:#f5efe6;
                      margin-bottom:8px;line-height:1.3;">${item.name}</div>
          <div style="display:flex;align-items:center;gap:12px;">

            <!-- Qty stepper -->
            <div style="display:flex;align-items:center;
              background:rgba(255,255,255,0.05);
              border:1px solid rgba(255,255,255,0.1);
              border-radius:4px;overflow:hidden;">
              <button
                onclick="window.updateQuantity('${id}', -1)"
                aria-label="Decrease quantity"
                style="background:none;border:none;color:#f5efe6;cursor:pointer;
                       width:28px;height:28px;font-size:16px;transition:background 0.15s;"
                onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                onmouseout="this.style.background='none'">−</button>
              <span style="font-size:12px;width:24px;text-align:center;
                           color:#f5efe6;">${item.qty}</span>
              <button
                onclick="window.updateQuantity('${id}', 1)"
                aria-label="Increase quantity"
                style="background:none;border:none;color:#f5efe6;cursor:pointer;
                       width:28px;height:28px;font-size:16px;transition:background 0.15s;"
                onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                onmouseout="this.style.background='none'">+</button>
            </div>

            ${item.unit
              ? `<span style="font-size:10px;color:rgba(245,239,230,0.4);
                              text-transform:uppercase;letter-spacing:0.08em;">
                   ${item.unit}</span>`
              : ''}
          </div>
        </div>

        <!-- Line total -->
        <div style="font-weight:600;color:#d9b254;font-size:15px;
                    margin-left:12px;white-space:nowrap;">
          ${itemTotal.toLocaleString()} ৳
        </div>
      </div>`;
  });

  /* ── Free shipping progress bar ── */
  const remaining = FREE_SHIPPING_THRESHOLD - total;
  const percent   = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const progressMsg = remaining > 0
    ? `Add <strong style="color:#d9b254;">${remaining} ৳</strong> more for
       <strong style="color:#d9b254;">Free Shipping</strong>`
    : `🎉 You've unlocked <strong style="color:#5fcf80;">Free Shipping!</strong>`;

  const progressHTML = `
    <div style="margin-bottom:20px;background:rgba(196,154,60,0.05);
                padding:14px 16px;border-radius:8px;
                border:1px solid rgba(196,154,60,0.15);">
      <p style="font-size:11px;margin-bottom:10px;
                color:rgba(245,239,230,0.8);text-align:center;
                line-height:1.5;">${progressMsg}</p>
      <div style="width:100%;height:3px;background:rgba(255,255,255,0.08);
                  border-radius:10px;overflow:hidden;">
        <div style="
          width:${percent}%;height:100%;
          background:${percent >= 100 ? '#5fcf80' : '#d9b254'};
          border-radius:10px;
          transition:width 0.4s cubic-bezier(0.4,0,0.2,1);
        "></div>
      </div>
    </div>`;

  /* ── Coupon input ── */
  const couponHTML = `
    <div style="margin-top:20px;padding-top:18px;
                border-top:1px solid rgba(255,255,255,0.06);">
      <div style="display:flex;gap:8px;">
        <input
          type="text"
          id="cartCoupon"
          placeholder="Coupon code"
          style="flex:1;background:rgba(255,255,255,0.03);
                 border:1px solid rgba(255,255,255,0.08);
                 border-radius:4px;padding:10px 12px;
                 color:#f5efe6;font-size:12px;
                 font-family:'DM Sans',sans-serif;
                 outline:none;transition:border 0.2s;"
          onfocus="this.style.borderColor='rgba(196,154,60,0.4)'"
          onblur="this.style.borderColor='rgba(255,255,255,0.08)'"
        >
        <button
          onclick="window.applyCoupon()"
          style="background:rgba(184,92,56,0.12);color:#d0724f;
                 border:1px solid rgba(184,92,56,0.28);
                 border-radius:4px;padding:0 16px;
                 font-size:10px;font-weight:700;
                 font-family:'Syne',sans-serif;
                 text-transform:uppercase;letter-spacing:0.1em;
                 cursor:pointer;transition:all 0.2s;white-space:nowrap;"
          onmouseover="this.style.background='rgba(184,92,56,0.22)'"
          onmouseout="this.style.background='rgba(184,92,56,0.12)'"
        >Apply</button>
      </div>
      <p id="couponMsg"
         style="font-size:11px;margin-top:8px;display:none;
                font-weight:500;letter-spacing:0.04em;"></p>
    </div>`;

  container.innerHTML = progressHTML + itemsHTML + couponHTML;
  if (subtotalEl) subtotalEl.textContent = total.toLocaleString() + ' ৳';
}

/**
 * Opens the cart drawer and dims the page.
 * Called automatically after addToCart().
 */
export function openCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  const drawer  = document.getElementById('cartDrawer');
  if (!overlay || !drawer) return;
  overlay.classList.add('active');
  drawer.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Toggles cart drawer open/closed.
 * Called from nav cart icon and overlay click.
 */
export function toggleCart() {
  const overlay = document.getElementById('cartOverlay');
  const drawer  = document.getElementById('cartDrawer');
  if (!overlay || !drawer) return;

  const isOpen = drawer.classList.toggle('active');
  overlay.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}


/* ============================================================
   2. COUPON
============================================================ */

/**
 * Validates a coupon code and stores it if valid.
 * Reads from VALID_COUPONS in config.js — add new codes there.
 */
export function applyCoupon() {
  const input = document.getElementById('cartCoupon');
  const msg   = document.getElementById('couponMsg');
  if (!input || !msg) return;

  const code = input.value.trim().toUpperCase();
  msg.style.display = 'block';

  if (VALID_COUPONS[code]) {
    msg.textContent = '✓ ' + VALID_COUPONS[code];
    msg.style.color = '#5fcf80';
    localStorage.setItem(COUPON_STORAGE_KEY, code);
  } else {
    msg.textContent = '✕ Invalid or expired coupon code.';
    msg.style.color = '#d0724f';
    localStorage.removeItem(COUPON_STORAGE_KEY);
  }
}


/* ============================================================
   3. CART INJECTION
   Auto-injects cart drawer HTML into pages that don't have it.
   Skipped if cartDrawer already exists in the HTML.
============================================================ */

/**
 * Injects cart HTML into the page if not already present,
 * then renders the current cart state.
 */
export function initCart() {
  if (!document.getElementById('cartDrawer')) {
    document.body.insertAdjacentHTML('afterbegin', CART_DRAWER_HTML);
  }
  renderCartDrawer();
}


/* ============================================================
   4. CHECKOUT RENDERING
   Only active when #orderItems exists (checkout.html only).
============================================================ */

/**
 * Renders order items into the checkout summary panel.
 * Supports item.image for product thumbnail — falls back to 🍄.
 * Called on page load and after every qty change.
 */
export function renderItems() {
  const listEl  = document.getElementById('orderItems');
  const emptyEl = document.getElementById('emptyCart');
  if (!listEl) return; /* Not on checkout page — safe on any page */

  const cart  = getCart();
  const items = Object.entries(cart);

  /* ── Empty cart ── */
  if (!items.length) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    updateTotals(0);
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  let subtotal = 0;

  listEl.innerHTML = items.map(([id, item]) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    /* Thumbnail: real image or emoji fallback */
    const hasImage    = Boolean(item.image);
    const iconHTML    = hasImage
      ? `<img src="${item.image}" alt="${item.name}"
              style="width:100%;height:100%;object-fit:cover;
                     border-radius:7px;display:block;"
              onerror="this.style.display='none';
                       this.nextElementSibling.style.display='flex'">`
      : '';
    const emojiFallback = `<span style="display:${hasImage ? 'none' : 'flex'};
      width:100%;height:100%;align-items:center;
      justify-content:center;font-size:20px;">🍄</span>`;

    return `
      <div class="order-item">
        <!-- Thumbnail -->
        <div class="item-icon"
             style="overflow:hidden;padding:0;
                    border:1px solid rgba(255,255,255,.07);">
          ${iconHTML}${emojiFallback}
        </div>

        <!-- Name + qty stepper -->
        <div style="flex:1;min-width:0;">
          <div class="item-name">${item.name}</div>
          <div style="display:flex;align-items:center;
                      gap:12px;margin-top:6px;">
            <div style="display:flex;align-items:center;
              background:rgba(255,255,255,.05);
              border:1px solid rgba(255,255,255,.1);
              border-radius:4px;overflow:hidden;">
              <button onclick="window.updateCheckoutQty('${id}', -1)"
                aria-label="Decrease quantity"
                style="background:none;border:none;color:var(--c);
                       cursor:pointer;width:26px;height:26px;font-size:15px;
                       transition:background 0.15s;"
                onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                onmouseout="this.style.background='none'">−</button>
              <span style="font-size:12px;width:22px;text-align:center;
                           font-family:'Syne',sans-serif;
                           color:var(--c);">${item.qty}</span>
              <button onclick="window.updateCheckoutQty('${id}', 1)"
                aria-label="Increase quantity"
                style="background:none;border:none;color:var(--c);
                       cursor:pointer;width:26px;height:26px;font-size:15px;
                       transition:background 0.15s;"
                onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                onmouseout="this.style.background='none'">+</button>
            </div>
            <span class="item-meta">${item.unit || 'Pack'}</span>
          </div>
        </div>

        <!-- Line total -->
        <div class="item-price">৳${itemTotal.toLocaleString()}</div>
      </div>`;
  }).join('');

  updateTotals(subtotal);
}

/**
 * Updates subtotal, delivery, and total on the checkout page.
 * Free delivery when subtotal ≥ FREE_SHIPPING_THRESHOLD.
 * @param {number} subtotal
 */
export function updateTotals(subtotal) {
  const delivery = (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0)
    ? 0
    : DELIVERY_FEE;
  const total = subtotal + delivery;

  const subtotalEl = document.getElementById('subtotalVal');
  const deliveryEl = document.getElementById('deliveryVal');
  const totalEl    = document.getElementById('totalVal');
  const freeBadge  = document.getElementById('freeDeliveryBadge');

  if (subtotalEl) subtotalEl.textContent = '৳' + subtotal.toLocaleString();
  if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'Free 🎉' : '৳' + delivery;
  if (totalEl)    totalEl.textContent    = '৳' + total.toLocaleString();

  if (freeBadge) {
    const earned = subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0;
    freeBadge.style.display = earned ? 'flex' : 'none';
  }
}

/**
 * Updates item qty from the checkout page.
 * Re-renders both the order list and cart drawer to stay in sync.
 * @param {string} id    — product key
 * @param {number} delta — +1 or -1
 */
export function updateCheckoutQty(id, delta) {
  const cart = getCart();
  if (!cart[id]) return;

  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];

  saveCart(cart);
  renderItems();
  renderCartDrawer();
}


/* ============================================================
   5. ADD-TO-CART BUTTON WIRING
   Finds all .add-to-cart-btn elements and wires them up.
   Reads product data from data-* attributes on the button.

   Required attributes on each button:
     data-name="Fresh Oyster Mushroom"
     data-price="350"
     data-id="fresh_oyster"
     data-unit="1kg"
   Optional:
     data-image="SaFa Fresh Oyester Mushroom.png"
============================================================ */

/**
 * Wires all .add-to-cart-btn buttons on the current page.
 * Safe to call on any page — silently skips if none found.
 */
export function initAddToCartButtons() {
  const buttons = document.querySelectorAll('.add-to-cart-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const name  = this.dataset.name  || 'Product';
      const price = parseInt(this.dataset.price, 10) || 0;
      const id    = this.dataset.id    || 'product_' + Date.now();
      const unit  = this.dataset.unit  || '';
      const image = this.dataset.image || '';

      if (!price) {
        console.warn('[SaFa] add-to-cart: missing data-price on', this);
        return;
      }

      /* Add to cart data + open drawer */
      addToCart(name, price, id, unit, image);
      renderCartDrawer();
      openCartDrawer();

      /* Button feedback — flash "✓ Added!" for 1.4s */
      const original = this.innerHTML;
      this.innerHTML  = '✓ Added!';
      this.style.background = 'var(--g500, #2a5040)';
      this.style.color      = '#fff';
      setTimeout(() => {
        this.innerHTML        = original;
        this.style.background = '';
        this.style.color      = '';
      }, 1400);
    });
  });

  console.log(`[SaFa] Wired ${buttons.length} add-to-cart button(s)`);
}
