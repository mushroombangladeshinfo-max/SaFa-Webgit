/* ============================================================
   src/observer.js
   SaFa Naturals — Scroll Fade-In Observer
   ─────────────────────────────────────────────────────────
   Watches .fi elements and adds .show when they enter viewport.
   CSS in style.css handles the actual opacity/transform transition.

   Usage in HTML:
     <div class="fi">...</div>   ← starts invisible
     When scrolled into view → .show added → CSS animates it in
============================================================ */


/**
 * Sets up an IntersectionObserver on all .fi elements.
 * Staggers the animation with a small delay per element
 * so groups of cards animate in one after another.
 */
export function initFadeObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Stagger: each element delayed by 70ms × its index */
        setTimeout(() => {
          entry.target.classList.add('show');
        }, i * 70);
      }
    });
  }, {
    threshold: 0.08 /* Trigger when 8% of element is visible */
  });

  document.querySelectorAll('.fi').forEach(el => observer.observe(el));
}
