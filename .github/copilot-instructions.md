# SaFa Naturals — AI Coding Agent Instructions

## Project Overview
SaFa Naturals is an e-commerce website for premium organic mushrooms in Bangladesh. Built with vanilla JavaScript, HTML, and CSS using Vite for multi-page builds. Cart data persists in localStorage, orders save to Supabase PostgreSQL, and seller notifications go via WhatsApp.

## Architecture
- **Multi-page app**: `index.html` (products), `recipes.html` (content), `checkout.html` (order form)
- **Modular JS**: `src/main.js` imports from `nav.js`, `cart.js`, `ui.js`, `filters.js`, `observer.js`
- **Data flow**: Cart mutations in `cart.js` → UI updates in `ui.js` → localStorage persistence
- **Backend**: Supabase orders table (insert-only via anon key, RLS blocks reads)
- **Build**: Vite with rollup multi-entry config in `vite.config.js`

## Key Patterns
- **Window globals**: ES modules expose functions on `window.*` for HTML `onclick` handlers (e.g., `window.addToCart()`)
- **Cart structure**: `{ "fresh_oyster": { name, price, qty, unit, image } }` stored in localStorage `'safaCart'`
- **Constants**: All site values in `src/config.js` (shipping thresholds, coupon codes, HTML templates)
- **Inline scripts**: Page-specific logic in `<script>` tags within HTML files (e.g., checkout validation)
- **Supabase integration**: Client created as `const db = window.supabase.createClient(URL, ANON_KEY)` in checkout.html
- **Order serialization**: Cart items stripped to `{ id, name, price, qty, unit, subtotal }` for JSONB storage

## Developer Workflows
- **Dev server**: `vite` (opens http://localhost:5173, auto-opens browser)
- **Build**: `vite build` (outputs to `dist/` with separate bundles for each HTML entry)
- **No package.json**: Direct Vite commands, no npm scripts
- **Setup**: Follow `SAFA-SETUP-GUIDE.md` for Supabase table creation and RLS policies
- **Testing**: No automated tests; manual browser testing for cart/checkout flows

## Conventions
- **Currency**: BDT integers (e.g., 500 for ৳500), no decimals
- **Product IDs**: Snake_case like `'fresh_oyster'`, `'mushroom_powder'`
- **Order numbers**: `'SAFA-1904-7823'` format (generated in checkout.html)
- **Language**: Bengali text in HTML (Open Graph, titles), English in code comments
- **Styling**: CSS variables in `style.css` (e.g., `--g900` for dark green backgrounds)
- **Error handling**: Try/catch with user-friendly banners, Supabase retries with backoff

## Integration Points
- **Supabase**: Orders table with RLS (anon insert only), indexes on status/phone/district
- **WhatsApp**: Seller notifications via CallMeBot API (fire-and-forget after order save)
- **Local storage**: Cart `'safaCart'`, coupon `'activeCoupon'`, checkout form `'safaCheckout'`
- **Fonts**: Google Fonts (Cormorant Garamond, Syne, DM Sans, Hind Siliguri)

## Common Tasks
- **Add product**: Update `config.js` CART_DRAWER_HTML with new banner card, add to index.html product grid
- **Modify shipping**: Change `FREE_SHIPPING_THRESHOLD`/`DELIVERY_FEE` in `config.js`
- **Update checkout**: Edit inline script in `checkout.html` for validation/formatting
- **Style changes**: Modify `style.css` variables or add scoped styles in HTML `<style>` blocks</content>
<parameter name="filePath">/Users/ace/SaFa Web/.github/copilot-instructions.md