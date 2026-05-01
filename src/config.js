/* ============================================================
   src/config.js
   SaFa Naturals — Shared Constants
   ─────────────────────────────────────────────────────────
   Single source of truth for all site-wide values.
   Change a value here → updates everywhere automatically.
   Imported by: cart.js, ui.js, main.js
============================================================ */


/* ── Shipping ── */

/** Orders above this amount get free delivery (BDT) */
export const FREE_SHIPPING_THRESHOLD = 700;

/** Flat delivery fee when below threshold (BDT) */
export const DELIVERY_FEE = 100;


/* ── Cart ── */

/** localStorage key for cart data */
export const CART_STORAGE_KEY = 'safaCart';

/** localStorage key for active coupon */
export const COUPON_STORAGE_KEY = 'activeCoupon';

/** localStorage key for saved checkout form */
export const CHECKOUT_STORAGE_KEY = 'safaCheckout';


/* ── Coupon codes ──
   Add new codes here. Value is the display message shown to customer.
   The discount logic lives in ui.js applyCoupon().
── */
export const VALID_COUPONS = {
  'SAFA10':  '10% discount applied!',
  'WELCOME': 'Welcome discount applied!',
};


/* ── Cart drawer HTML ──
   Injected into pages that don't already have it in their HTML.
   onclick handlers reference global functions exposed by main.js.
   Note: In ES module mode, functions must be on window.* to work
   in inline onclick attributes — main.js handles this.
── */
export const CART_DRAWER_HTML = `
  <div class="cart-overlay" id="cartOverlay" onclick="window.toggleCart()"></div>
  <div class="cart-drawer" id="cartDrawer">
    <div class="cart-header">
      <h2 class="cart-title">Your Cart</h2>
      <button class="cart-close" onclick="window.toggleCart()" aria-label="Close Cart">✕</button>
    </div>
    <div class="cart-banner-wrapper">
      <p class="cart-banner-label">Add to your order</p>
      <div class="cart-banner-track">
        <div class="cart-banner-card">
          <div class="cart-banner-img">🍄</div>
          <div class="cart-banner-info">
            <h4>Fresh Oyster</h4>
            <span>350 ৳</span>
          </div>
          <button class="cart-banner-add"
            onclick="window.addToCart('Fresh Oyster',350,'fresh_oyster','1kg')">+</button>
        </div>
        <div class="cart-banner-card">
          <div class="cart-banner-img">🌿</div>
          <div class="cart-banner-info">
            <h4>Dried Oyster</h4>
            <span>280 ৳</span>
          </div>
          <button class="cart-banner-add"
            onclick="window.addToCart('Dried Oyster',280,'dried_oyster','100g')">+</button>
        </div>
        <div class="cart-banner-card">
          <div class="cart-banner-img">🫙</div>
          <div class="cart-banner-info">
            <h4>Mushroom Powder</h4>
            <span>350 ৳</span>
          </div>
          <button class="cart-banner-add"
            onclick="window.addToCart('Mushroom Powder',350,'mushroom_powder','100g')">+</button>
        </div>
      </div>
    </div>
    <div class="cart-items-container"></div>
    <div class="cart-footer">
      <div class="cart-subtotal"><span>Subtotal</span><span>0 ৳</span></div>
      <button class="cart-checkout-btn"
        onclick="window.location.href='checkout.html'">
        Proceed to Checkout →
      </button>
    </div>
  </div>`;
