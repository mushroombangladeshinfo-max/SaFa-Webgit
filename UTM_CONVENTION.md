# SaFa Naturals — UTM Naming Convention

Every marketing link (WhatsApp buttons, Facebook catalog, future paid ads)
should carry `utm_source` / `utm_medium` / `utm_campaign` in this format, so
GA4, `insights.html`'s channel tables, and the order-attribution system
(`src/attribution.js`, `orders.utm_*` columns) all group data consistently.

**Rule: always lowercase, always `snake_case`, never spaces.** Mismatched
casing (`Facebook` vs `facebook`) or separators (`fresh-oyster` vs
`fresh_oyster`) creates duplicate rows in every report instead of one
correctly-summed one — this is the single most common way attribution data
quietly breaks over time.

---

## utm_source — which platform

The traffic's origin platform. Matches the `channel` values already used in
`marketing_metrics` and `CHANNELS` in `insights.html`, so keep it to this
fixed list:

| Value | Use for |
|---|---|
| `whatsapp` | Any WhatsApp CTA on the site |
| `facebook` | Facebook Page posts, Facebook Shop/catalog, Facebook Ads |
| `instagram` | Instagram posts, Instagram Shop, Instagram Ads |
| `google` | Google Ads, Google organic (rare — GA4 usually auto-tags organic search, you don't need to hand-tag it) |
| `tiktok` | TikTok posts or ads |
| `linkedin` | LinkedIn posts or ads |
| `email` | If you ever send email campaigns |
| `sms` | If you ever send SMS campaigns |

Don't invent new values without adding them to `CHANNELS` in `insights.html`
too, or they'll fall back to the generic gray "other" bucket in every chart.

---

## utm_medium — what kind of link/placement

Describes *where on that platform* or *what type* of link it was. This is
where the existing site is already fairly descriptive — keep following the
same pattern:

**Already in use (WhatsApp buttons):**
`faq`, `floating_btn`, `how_to_order`, `product_card`, `product_page`,
`recipes_page`, `roadmap`, `roadmap_bar`

**For paid ads specifically, use:**
`cpc` (cost-per-click / standard paid ad)

**For the Facebook product catalog:**
`catalog` (already baked into every link the `product-feed` function generates)

**General rule of thumb:** name it after the *UI element or page section* a
human would recognize — "the floating WhatsApp button," "the FAQ section,"
"the roadmap notify bar." If you're tagging a brand-new button/section, just
describe it the same way.

---

## utm_campaign — the specific context or promotion

The most specific layer — what exact message, product, or promotion this
link is tied to. Existing examples: `fresh_oyster`, `dried_oyster`,
`mushroom_powder`, `customer_question`, `general_chat`, `order_help`,
`hydroponic_notify`, `pickle_notify`, `readytocook_notify`,
`new_product_notify`, `organic_listing` (used by the Facebook catalog feed).

**For a paid ad campaign**, name it something you'll still recognize in the
`insights.html` attribution table 3 months from now:
`{month}_{what}` — e.g. `jul2026_fresh_oyster_launch`, not just `campaign1`.

---

## Quick reference: building a new tagged link

```
https://safa-webgit.pages.dev/product.html?id=fresh_oyster
  &utm_source=facebook
  &utm_medium=cpc
  &utm_campaign=jul2026_fresh_oyster_launch
```

Once this link is clicked and the visitor eventually checks out,
`src/attribution.js` captures it automatically (last-touch — the most
recent tagged visit before checkout wins), attaches it to the order, and it
shows up in `insights.html`'s "Real Order Attribution" table under
`facebook / cpc / jul2026_fresh_oyster_launch` — no extra setup needed
beyond tagging the link correctly in the first place.

## Where this already lives in code

- `src/attribution.js` — captures/stores the UTM params off the URL
- `checkout.html` — attaches stored attribution to the order at save time
- `supabase/migrations/07_order_attribution.sql` — `orders.utm_source` /
  `utm_medium` / `utm_campaign` columns + `v_order_attribution_monthly` view
- `insights.html` — "Real Order Attribution" table (Channels tab)
- `supabase/functions/product-feed/index.ts` — every Facebook catalog link
  is pre-tagged `utm_source=facebook&utm_medium=catalog&utm_campaign=organic_listing`
