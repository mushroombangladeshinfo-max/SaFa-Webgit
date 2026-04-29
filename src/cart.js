/* ============================================================
   src/cart.js
   SaFa Naturals — Cart Engine
   ─────────────────────────────────────────────────────────
   Pure data logic — no DOM access anywhere in this file.
   Works on every page: index, recipes, checkout.
   Persists to localStorage.

   Cart structure (localStorage 'safaCart'):
   {
     "fresh_oyster": { name, price, qty, unit, image? },
     "dried_oyster": { name, price, qty, unit, image? }
   }

   Imported by: ui.js, main.js
============================================================ */

import {
  CART_STORAGE_KEY,
  COUPON_STORAGE_KEY,
} from './config.js';


/* ============================================================
   READ / WRITE
============================================================ */

/**
 * Returns the current cart object from localStorage.
 * Returns empty object on parse failure — never throws.
 * @returns {Object} cart
 */
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

/**
 * Saves a cart object to localStorage.
 * @param {Object} cart
 */
export function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Wipes the cart and coupon from localStorage.
 * Called after a successful order.
 */
export function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(COUPON_STORAGE_KEY);
}


/* ============================================================
   MUTATIONS
============================================================ */

/**
 * Adds a product to cart or increments qty if already present.
 * Optionally stores an image URL for display on checkout.
 *
 * @param {string} name   — Display name e.g. "Fresh Oyster Mushroom"
 * @param {number} price  — Unit price in BDT (integer)
 * @param {string} id     — Unique product key e.g. "fresh_oyster"
 * @param {string} unit   — Pack size e.g. "1kg", "100g"
 * @param {string} image  — Optional image path for checkout thumbnail
 */
export function addToCart(name, price, id, unit = '', image = '') {
  const cart = getCart();

  if (cart[id]) {
    /* Product already in cart — just increment */
    cart[id].qty += 1;
  } else {
    /* New product — create entry */
    cart[id] = { name, price: Number(price), qty: 1, unit, image };
  }

  saveCart(cart);

  /* ── Dispatch event for UI notifications ── */
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cart-item-added', {
      detail: { name, image }
    }));
  }
}

/**
 * Changes qty of a cart item by delta (+1 or -1).
 * Removes the item entirely if qty drops to 0 or below.
 *
 * @param {string} id    — Product key
 * @param {number} delta — +1 to increase, -1 to decrease
 */
export function updateQuantity(id, delta) {
  const cart = getCart();
  if (!cart[id]) return;

  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];

  saveCart(cart);
}


/* ============================================================
   READS
============================================================ */

/**
 * Returns the total number of items across all products.
 * e.g. 2× Fresh Oyster + 1× Powder = 3
 * @returns {number}
 */
export function getCartCount() {
  return Object.values(getCart())
    .reduce((sum, item) => sum + item.qty, 0);
}

/**
 * Returns the total price across all products (before delivery).
 * @returns {number} — BDT integer
 */
export function getCartTotal() {
  return Object.values(getCart())
    .reduce((sum, item) => sum + item.price * item.qty, 0);
}
