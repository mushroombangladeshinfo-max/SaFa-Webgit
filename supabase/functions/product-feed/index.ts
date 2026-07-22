// ============================================================================
// product-feed — public product catalog feed for Meta Commerce Manager
// ============================================================================
// Returns an RSS 2.0 + Google/Meta product-feed-namespace XML document,
// generated live from the `products` table on every request. Point Meta
// Commerce Manager's "Data Feed" setup at this function's URL with a
// scheduled (e.g. daily) fetch — no manual re-upload needed when prices,
// stock, or descriptions change.
//
// This is deliberately PUBLIC (no auth) — Meta's feed-fetching bot can't
// send an Authorization header, and product listings are meant to be public
// anyway (same data already visible on product.html).
//
// Every product link carries utm_source=facebook&utm_medium=catalog, so a
// purchase that comes from clicking a product in Facebook/Instagram Shop
// gets picked up automatically by src/attribution.js at checkout — no
// extra wiring needed on the attribution side.
//
// Docs: https://www.facebook.com/business/help/120325381656392
//       (Meta's product feed spec is a subset of Google's, same tag names)
// ============================================================================

import { createClient } from 'jsr:@supabase/supabase-js@2';

const SITE = 'https://safa-webgit.pages.dev';
const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, name_bn, price, discount_price, unit, inventory_count, image_url, description, active')
    .eq('active', true)
    .not('price', 'is', null);

  if (error) {
    return new Response(`Feed generation failed: ${error.message}`, { status: 500 });
  }

  const items = (products || []).map((p) => {
    const link  = `${SITE}/product.html?id=${encodeURIComponent(p.id)}` +
                  `&utm_source=facebook&utm_medium=catalog&utm_campaign=organic_listing`;
    const image = `${SITE}/${encodeURIComponent(p.image_url || '')}`;
    const price = Number(p.discount_price ?? p.price).toFixed(2);
    const availability = p.inventory_count > 0 ? 'in stock' : 'out of stock';

    return `
  <item>
    <g:id>${xmlEscape(p.id)}</g:id>
    <title>${xmlEscape(p.name)}</title>
    <description>${xmlEscape(p.description || p.name)}</description>
    <link>${xmlEscape(link)}</link>
    <g:image_link>${xmlEscape(image)}</g:image_link>
    <g:availability>${availability}</g:availability>
    <g:condition>new</g:condition>
    <g:price>${price} BDT</g:price>
    ${p.discount_price ? `<g:sale_price>${price} BDT</g:sale_price>` : ''}
    <g:brand>SaFa Naturals</g:brand>
    <g:product_type>Groceries &gt; Organic Mushrooms</g:product_type>
  </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>SaFa Naturals — Product Feed</title>
  <link>${SITE}</link>
  <description>Organic mushroom products from SaFa Naturals, Sirajganj</description>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
});
