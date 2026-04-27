/* ============================================================
   src/nav.js
   SaFa Naturals — Navigation
   ─────────────────────────────────────────────────────────
   Sticky scroll effect, hamburger menu, smooth anchor scroll.
   Safe to call on any page — checks elements exist first.
============================================================ */


/**
 * Adds .scrolled to nav after 56px scroll.
 * CSS uses this to add background + blur.
 * Also highlights the active nav link based on scroll position.
 */
export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  /* Scroll effect */
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 56);
  }, { passive: true });

  /* Active link highlighting */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 80) {
          current = section.id;
        }
      });
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + current
        );
      });
    }, { passive: true });
  }
}


/**
 * Hamburger toggle — opens/closes the mobile slide-in menu.
 * Locks body scroll while menu is open.
 * Closes when clicking outside or resizing to desktop.
 */
export function initHamburger() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close on outside click */
  document.addEventListener('click', e => {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* Close on resize to desktop width */
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeMenu();
  });
}


/**
 * Closes the mobile menu.
 * Called internally and exposed on window for HTML onclick use.
 */
export function closeMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger)  hamburger.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}


/**
 * Smooth scroll for all anchor links (#section).
 * Closes mobile menu after clicking a nav link.
 */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        closeMenu();
      }
    });
  });
}
