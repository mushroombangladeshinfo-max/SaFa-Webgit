/* ============================================================
   src/filters.js
   SaFa Naturals — Product Grid Filters
   ─────────────────────────────────────────────────────────
   Filters .pl-card elements by data-category attribute.
   Filter buttons use class .pl-filter + data-filter attribute.
   Only active on pages with filter buttons — skips silently.
============================================================ */


/**
 * Wires up product filter tabs on the index.html products grid.
 * Each .pl-filter button has data-filter="all|fresh|dry|coming".
 * Each .pl-card has data-category matching one of those values.
 */
export function initProductFilters() {
  const filterBtns   = document.querySelectorAll('.pl-filter');
  const productCards = document.querySelectorAll('.pl-card');
  if (!filterBtns.length) return; /* Not on a page with filters */

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {

      /* Update active button state */
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      /* Show/hide cards based on category match */
      productCards.forEach(card => {
        const match = filter === 'all' ||
          card.getAttribute('data-category') === filter;

        card.style.display = match ? 'flex' : 'none';

        if (match) {
          /* Re-trigger fade-in so cards animate in after filtering */
          card.classList.remove('show');
          setTimeout(() => card.classList.add('show'), 50);
        }
      });
    });
  });
}
