/* ============================================================
   src/main.js
   SaFa Naturals — Entry Point
   ─────────────────────────────────────────────────────────
   Single entry point loaded by all HTML pages via:
     <script type="module" src="/src/main.js"></script>

   Responsibilities:
   1. Import all modules
   2. Expose required functions on window.*
      (ES modules are scoped — inline onclick attributes in HTML
       need window.* to find functions at runtime)
   3. Call all init functions on DOMContentLoaded

   Pages: index.html, recipes.html, checkout.html, hero.html
   Each init function checks for its required DOM elements
   before running — safe to call on every page.
============================================================ */

/* ── Module imports ── */
import { initNav, initHamburger, initSmoothScroll, closeMenu } from './nav.js';
import { initProductFilters }  from './filters.js';
import { initFadeObserver }    from './observer.js';
import {
  getCart,
  saveCart,
  addToCart,
  updateQuantity,
  getCartCount,
  getCartTotal,
  clearCart,
} from './cart.js';
import {
  renderCartDrawer,
  toggleCart,
  applyCoupon,
  initCart,
  renderItems,
  updateTotals,
  updateCheckoutQty,
  initAddToCartButtons,
} from './ui.js';


/* ============================================================
   WINDOW GLOBALS
   ─────────────────────────────────────────────────────────
   Inline onclick attributes in HTML (e.g. onclick="toggleCart()")
   and dynamically rendered HTML strings in ui.js both require
   functions to be on window.

   Rule: if a function is called from an onclick attribute
   anywhere in HTML or in an innerHTML string, it goes here.
============================================================ */

/* Cart actions — called from cart drawer HTML (onclick attrs) */
window.addToCart       = addToCart;
window.updateQuantity  = (id, delta) => { updateQuantity(id, delta); renderCartDrawer(); };
window.toggleCart      = toggleCart;
window.applyCoupon     = applyCoupon;

/* Checkout qty — called from renderItems() inline HTML */
window.updateCheckoutQty = updateCheckoutQty;

/* Mobile menu — called from mobile-menu links (onclick="closeMenu()") */
window.closeMenu = closeMenu;

/* Recipe video play — called from rv-play-overlay onclick */
window.playRV = function () {
  const vid     = document.getElementById('recipeVid');
  const overlay = document.getElementById('rvOverlay');
  if (!vid || !overlay) return;
  overlay.classList.add('hidden');
  vid.play();
};

/* Expose cart reads for checkout.html inline script */
window.getCart              = getCart;
window.saveCart             = saveCart;
window.clearCart            = clearCart;
window.getCartCount         = getCartCount;
window.getCartTotal         = getCartTotal;
window.renderItems          = renderItems;
window.updateTotals         = updateTotals;
window.renderCartDrawer     = renderCartDrawer;

/* Expose constants needed by checkout.html inline script */
import { FREE_SHIPPING_THRESHOLD, DELIVERY_FEE } from './config.js';
window.FREE_SHIPPING_THRESHOLD = FREE_SHIPPING_THRESHOLD;
window.DELIVERY_FEE            = DELIVERY_FEE;


/* ============================================================
   INITIALISATION
   ─────────────────────────────────────────────────────────
   Every init function is page-safe:
   — returns immediately if required DOM elements are absent
   — no errors thrown on pages where a feature doesn't apply
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  initNav();              /* Sticky nav scroll + active link highlight */
  initHamburger();        /* Mobile menu toggle + outside-click close  */
  initSmoothScroll();     /* Anchor smooth scroll + menu close          */
  initCart();             /* Inject cart drawer if absent + render      */
  initProductFilters();   /* index.html product grid filter tabs        */
  initFadeObserver();     /* .fi elements fade in on scroll             */
  initAddToCartButtons(); /* Wire data-* add-to-cart buttons            */
  renderItems();          /* checkout.html order summary (no-op elsewhere) */

  /* Update nav cart dot count on every page load */
  const navDot = document.querySelector('.nav-dot');
  if (navDot) {
    const count = getCartCount();
    navDot.style.display = count > 0 ? 'block' : 'none';
  }

});
